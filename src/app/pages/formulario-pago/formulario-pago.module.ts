import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioPagoPageRoutingModule } from './formulario-pago-routing.module';

import { FormularioPagoPage } from './formulario-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormularioPagoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FormularioPagoPage]
})
export class FormularioPagoPageModule {}
