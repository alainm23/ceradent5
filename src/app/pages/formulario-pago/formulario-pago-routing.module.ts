import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormularioPagoPage } from './formulario-pago.page';

const routes: Routes = [
  {
    path: '',
    component: FormularioPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioPagoPageRoutingModule {}
