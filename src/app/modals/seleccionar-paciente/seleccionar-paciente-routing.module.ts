import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeleccionarPacientePage } from './seleccionar-paciente.page';

const routes: Routes = [
  {
    path: '',
    component: SeleccionarPacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeleccionarPacientePageRoutingModule {}
