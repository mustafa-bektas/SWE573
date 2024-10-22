export interface MysteryObject {
    id?: number;
    description: string;
    writtenText: string;
    color: string;
    shape: string;
    descriptionOfParts: string;
    location: string;
    hardness: string;
    timePeriod: string;
    smell: string;
    taste: string;
    texture: string;
    value: number;
    originOfAcquisition: string;
    pattern: string;
    brand: string;
    print: string;
    functionality: string;
    imageLicenses: string;
    markings: string;
    handmade: boolean;
    oneOfAKind: boolean;
    sizeX: number;
    sizeY: number;
    sizeZ: number;
    weight: number;
    itemCondition: string;  // Enum: NEW, LIKE_NEW, USED, DAMAGED, ANTIQUE
  }
  