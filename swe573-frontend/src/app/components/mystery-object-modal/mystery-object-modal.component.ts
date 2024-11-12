import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-mystery-object-modal',
  templateUrl: './mystery-object-modal.component.html',
})
export class MysteryObjectModalComponent {
  mysteryObjectForm: FormGroup;
  selectedImage: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MysteryObjectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mysteryObjectForm = this.fb.group({
      description: [data?.mysteryObjectData?.description || ''],
      writtenText: [data?.mysteryObjectData?.writtenText || ''],
      color: [data?.mysteryObjectData?.color || ''],
      shape: [data?.mysteryObjectData?.shape || ''],
      descriptionOfParts: [data?.mysteryObjectData?.descriptionOfParts || ''],
      location: [data?.mysteryObjectData?.location || ''],
      hardness: [data?.mysteryObjectData?.hardness || ''],
      timePeriod: [data?.mysteryObjectData?.timePeriod || ''],
      smell: [data?.mysteryObjectData?.smell || ''],
      taste: [data?.mysteryObjectData?.taste || ''],
      texture: [data?.mysteryObjectData?.texture || ''],
      value: [data?.mysteryObjectData?.value || null],
      originOfAcquisition: [data?.mysteryObjectData?.originOfAcquisition || ''],
      pattern: [data?.mysteryObjectData?.pattern || ''],
      brand: [data?.mysteryObjectData?.brand || ''],
      print: [data?.mysteryObjectData?.print || ''],
      functionality: [data?.mysteryObjectData?.functionality || ''],
      imageLicenses: [data?.mysteryObjectData?.imageLicenses || ''],
      markings: [data?.mysteryObjectData?.markings || ''],
      handmade: [data?.mysteryObjectData?.handmade || false],
      oneOfAKind: [data?.mysteryObjectData?.oneOfAKind || false],
      sizeX: [data?.mysteryObjectData?.sizeX || null],
      sizeY: [data?.mysteryObjectData?.sizeY || null],
      sizeZ: [data?.mysteryObjectData?.sizeZ || null],
      weight: [data?.mysteryObjectData?.weight || null],
      itemCondition: [data?.mysteryObjectData?.itemCondition || 'NEW']
    });

    this.selectedImage = data?.image || null;
  }

  // Method triggered when the user selects an image
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  save(): void {
    if (this.mysteryObjectForm.valid) {
      const mysteryObjectData = {
        ...this.mysteryObjectForm.value
      };
      this.dialogRef.close({ mysteryObjectData, image: this.selectedImage });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
