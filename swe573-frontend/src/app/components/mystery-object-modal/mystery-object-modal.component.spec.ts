import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysteryObjectModalComponent } from './mystery-object-modal.component';

describe('MysteryObjectModalComponent', () => {
  let component: MysteryObjectModalComponent;
  let fixture: ComponentFixture<MysteryObjectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MysteryObjectModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MysteryObjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
