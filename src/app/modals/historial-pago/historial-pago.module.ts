import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialPagoPageRoutingModule } from './historial-pago-routing.module';

import { HistorialPagoPage } from './historial-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialPagoPageRoutingModule
  ],
  declarations: [HistorialPagoPage]
})
export class HistorialPagoPageModule {}
