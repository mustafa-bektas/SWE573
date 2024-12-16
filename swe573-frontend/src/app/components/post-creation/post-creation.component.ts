import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../../services/post.service';
import { MysteryObjectModalComponent } from '../mystery-object-modal/mystery-object-modal.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError
} from 'rxjs/operators';
import {baseApiUrl} from '../../app.module';

interface WikidataResult {
  id: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-post-creation',
  templateUrl: './post-creation.component.html',
  styleUrls: ['./post-creation.component.css']
})
export class PostCreationComponent implements OnInit {
  postForm: FormGroup;
  mysteryObject: any;
  mysteryObjectImage: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  // Wikidata tag search properties
  tagSearchControl = new FormControl('');
  searchResults: WikidataResult[] = [];
  selectedTags: WikidataResult[] = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: [''],
      content: [''],
      tags: [''], // Keep this for manual tag input if needed
    });
  }

  ngOnInit() {
    // Setup Wikidata tag search
    this.tagSearchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        // Only search if query is at least 3 characters
        if (query && query.length >= 3) {
          return this.searchWikidata(query);
        }
        // Return empty array if search query is too short
        return new Observable<WikidataResult[]>(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
      },
      error: (err) => {
        console.error('Error searching Wikidata', err);
        this.searchResults = [];
      }
    });
  }

  searchWikidata(query: string): Observable<WikidataResult[]> {
    const wikidataUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&origin=*&language=en&limit=10&search=${encodeURIComponent(query)}`;

    return this.http.jsonp<any>(wikidataUrl, 'callback').pipe(
      switchMap(data => {
        // Transform Wikidata results
        return new Observable<WikidataResult[]>(observer => {
          const formattedResults = (data.search || []).map((item: any) => ({
            id: item.id,
            label: item.label,
            description: item.description || 'No description available'
          }));
          observer.next(formattedResults);
          observer.complete();
        });
      }),
      catchError(error => {
        console.error('Error in Wikidata search', error);
        return new Observable<WikidataResult[]>(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  selectTag(result: WikidataResult) {
    // Prevent duplicate tags
    if (!this.selectedTags.some(tag => tag.id === result.id)) {
      this.selectedTags.push(result);
      this.tagSearchControl.setValue('');
      this.searchResults = [];
    }
  }

  removeTag(result: WikidataResult) {
    this.selectedTags = this.selectedTags.filter(tag => tag.id !== result.id);
  }

  openMysteryObjectModal(): void {
    // Existing method remains the same
    const dialogRef = this.dialog.open(MysteryObjectModalComponent, {
      data: { mysteryObjectData: this.mysteryObject, image: this.mysteryObjectImage }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mysteryObject = result.mysteryObjectData;
        this.mysteryObjectImage = result.image;

        if (this.mysteryObjectImage) {
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreviewUrl = reader.result;
          };
          reader.readAsDataURL(this.mysteryObjectImage);
        }
      }
    });
  }

  createPost(): void {
    if (this.postForm.valid) {
      const formData = new FormData();

      // Use selected Wikidata tags instead of manual input
      const tagsArray = this.selectedTags.map(tag => tag.label);

      // Create JSON object for post data
      const postObject = {
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        tags: tagsArray,
        //wikidataTagIds: this.selectedTags.map(tag => tag.id), // Include Wikidata IDs if needed
        mysteryObject: this.mysteryObject
      };

      // Append `post` as a JSON blob
      formData.append('post', new Blob([JSON.stringify(postObject)], { type: 'application/json' }));

      const observer = {
        next: (response: any) => {
          const mysteryObjectId = response.mysteryObjectId;

          if (this.mysteryObjectImage) {
            this.uploadImage(mysteryObjectId).subscribe({
              next: () => {
                this.router.navigate(['/']); // Redirect to home page
              },
              error: (error: any) => {
                console.error('Error uploading image', error);
                this.router.navigate(['/']);
              }
            });
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error: any) => {
          console.error('Error creating post', error);
        }
      };

      // Call the service
      this.postService.createPost(formData).subscribe(observer);
    }
  }

  uploadImage(objectId: number): Observable<any> {
    const formData = new FormData();
    formData.append('image', this.mysteryObjectImage!);

    // Send the image to the /upload-image endpoint and return the observable
    return this.http.post(`${baseApiUrl}/api/mysteryObjects/${objectId}/upload-image`, formData);
  }
}
