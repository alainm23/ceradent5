import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatosOrdenPage } from './datos-orden.page';

describe('DatosOrdenPage', () => {
  let component: DatosOrdenPage;
  let fixture: ComponentFixture<DatosOrdenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosOrdenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosOrdenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
