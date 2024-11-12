import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../../services/post.service';
import { MysteryObjectModalComponent } from '../mystery-object-modal/mystery-object-modal.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {baseApiUrl} from '../../app.module';

@Component({
  selector: 'app-post-creation',
  templateUrl: './post-creation.component.html',
})
export class PostCreationComponent {
  postForm: FormGroup;
  mysteryObject: any;
  mysteryObjectImage: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

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
      tags: [''],
    });
  }

  openMysteryObjectModal(): void {
    // Open the modal and pass existing mysteryObject data, if available
    const dialogRef = this.dialog.open(MysteryObjectModalComponent, {
      data: { mysteryObjectData: this.mysteryObject, image: this.mysteryObjectImage }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mysteryObject = result.mysteryObjectData;
        this.mysteryObjectImage = result.image; // Store the image separately

        // Create an image preview if there's an image file
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

      // Split tags by commas and trim whitespace
      const tagsArray = this.postForm.value.tags.split(',').map((tag: string) => tag.trim());

      // Create JSON object for post data
      const postObject = {
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        tags: tagsArray,
        mysteryObject: this.mysteryObject
      };

      // Append `post` as a JSON blob
      formData.append('post', new Blob([JSON.stringify(postObject)], { type: 'application/json' }));

      const observer = {
        next: (response: any) => {
          console.log('Post created successfully:', response);
          const mysteryObjectId = response.mysteryObjectId;

          if (this.mysteryObjectImage) {
            this.uploadImage(mysteryObjectId).subscribe({
              next: () => {
                console.log('Image uploaded successfully');
                this.router.navigate(['/']); // Redirect to home page
              },
              error: (error: any) => {
                console.error('Error uploading image', error);
                this.router.navigate(['/']); // Redirect even if image upload fails
              }
            });
          } else {
            // No image to upload, so proceed with navigation
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
