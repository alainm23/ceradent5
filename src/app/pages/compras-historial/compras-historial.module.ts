import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComprasHistorialPageRoutingModule } from './compras-historial-routing.module';

import { ComprasHistorialPage } from './compras-historial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComprasHistorialPageRoutingModule
  ],
  declarations: [ComprasHistorialPage]
})
export class ComprasHistorialPageModule {}
