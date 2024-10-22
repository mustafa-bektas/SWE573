import { TestBed } from '@angular/core/testing';

import { MysteryObjectService } from './mystery-object.service';

describe('MysteryObjectService', () => {
  let service: MysteryObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MysteryObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
