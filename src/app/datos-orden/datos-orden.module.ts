import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosOrdenPageRoutingModule } from './datos-orden-routing.module';

import { DatosOrdenPage } from './datos-orden.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosOrdenPageRoutingModule
  ],
  declarations: [DatosOrdenPage]
})
export class DatosOrdenPageModule {}
