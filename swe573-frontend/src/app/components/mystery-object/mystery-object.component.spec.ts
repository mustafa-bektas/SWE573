import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysteryObjectComponent } from './mystery-object.component';

describe('MysteryObjectComponent', () => {
  let component: MysteryObjectComponent;
  let fixture: ComponentFixture<MysteryObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MysteryObjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MysteryObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
