import { Component } from '@angular/core';
import { MysteryObject } from '../../interfaces/mystery-object';
import { MysteryObjectService } from '../../services/mystery-object.service';

@Component({
  selector: 'app-mystery-object',
  templateUrl: './mystery-object.component.html',
  styleUrl: './mystery-object.component.css'
})
export class MysteryObjectComponent {
  mysteryObject: MysteryObject = {
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
    itemCondition: 'NEW'
  };

  constructor(private mysteryObjectService: MysteryObjectService) { }

    createMysteryObject() {
      const observer = {
          next: (response: any) => {
              console.log('MysteryObject created successfully', response);
          },
          error: (error: any) => {
              console.error('Error creating MysteryObject', error);
          }
      };
  
      this.mysteryObjectService.createMysteryObject(this.mysteryObject).subscribe(observer);
  }

}
