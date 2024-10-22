import { Component, Input } from '@angular/core';
import { ItemCondition, MysteryObject } from '../../interfaces/mystery-object';
import { MysteryObjectService } from '../../services/mystery-object.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-mystery-object',
  templateUrl: './mystery-object.component.html',
  styleUrl: './mystery-object.component.css'
})
export class MysteryObjectComponent {
  selectedFile: File | null = null; // Image file

  // Initialize the form data model (excluding image)
  mysteryObject: any = {
    description: '',
    writtenText: '',
    color: '',
    shape: '',
    descriptionOfParts: '',
    location: '',
    hardness: '',
    timePeriod: '',
    smell: '',
    taste: '',
    texture: '',
    value: 0,
    originOfAcquisition: '',
    pattern: '',
    brand: '',
    print: '',
    functionality: '',
    imageLicenses: '',
    markings: '',
    handmade: false,
    oneOfAKind: false,
    sizeX: 0,
    sizeY: 0,
    sizeZ: 0,
    weight: 0,
    itemCondition: 'NEW'  // Enum value
  };

  constructor(private http: HttpClient) {}

  // Method triggered when the user selects an image
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Method to first create the MysteryObject without the image
  createMysteryObject(): void {
    const observer = {
      next: (response: any) => {
        console.log('Mystery Object created:', response);
        const objectId = response.id;  // Assume that the backend returns the created object's ID
        console.log('Object ID:', objectId);
  
        // After the object is created, upload the image
        if (this.selectedFile) {
          this.uploadImage(objectId);  // Call image upload method
        }
      },
      error: (error: any) => {
        console.error('Error creating Mystery Object', error);
      },
      complete: () => {
        console.log('Mystery Object creation process complete');
      }
    };
  
    // Perform the HTTP POST request to create the object
    this.http.post('http://localhost:8080/api/mysteryObjects', this.mysteryObject).subscribe(observer);
  }
  

  uploadImage(objectId: number): void {
    const formData = new FormData();
    formData.append('image', this.selectedFile!);
  
    const observer = {
      next: (response: any) => {
        console.log('Image uploaded successfully:', response);
      },
      error: (error: any) => {
        console.error('Error uploading image', error);
      },
      complete: () => {
        console.log('Image upload process complete');
      }
    };
  
    // Send the image to the /upload-image endpoint
    this.http.post(`http://localhost:8080/api/mysteryObjects/${objectId}/upload-image`, formData)
      .subscribe(observer);
  }  
}