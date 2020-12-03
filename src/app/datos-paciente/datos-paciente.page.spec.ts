import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosPacientePage } from './datos-paciente.page';

describe('DatosPacientePage', () => {
  let component: DatosPacientePage;
  let fixture: ComponentFixture<DatosPacientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosPacientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
