import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarEditarReservaPage } from './agregar-editar-reserva.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarEditarReservaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarEditarReservaPageRoutingModule {}
