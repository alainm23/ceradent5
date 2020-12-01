import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarEditarReservaPageRoutingModule } from './agregar-editar-reserva-routing.module';

import { AgregarEditarReservaPage } from './agregar-editar-reserva.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarEditarReservaPageRoutingModule
  ],
  declarations: [AgregarEditarReservaPage]
})
export class AgregarEditarReservaPageModule {}
