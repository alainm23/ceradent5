import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeleccionarPacientePageRoutingModule } from './seleccionar-paciente-routing.module';

import { SeleccionarPacientePage } from './seleccionar-paciente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeleccionarPacientePageRoutingModule
  ],
  declarations: [SeleccionarPacientePage]
})
export class SeleccionarPacientePageModule {}
