import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPacientePageRoutingModule } from './datos-paciente-routing.module';

import { DatosPacientePage } from './datos-paciente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPacientePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DatosPacientePage]
})
export class DatosPacientePageModule {}
