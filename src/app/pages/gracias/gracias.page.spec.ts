import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GraciasPage } from './gracias.page';

describe('GraciasPage', () => {
  let component: GraciasPage;
  let fixture: ComponentFixture<GraciasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraciasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GraciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
