import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteDiarioPage } from './reporte-diario.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteDiarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteDiarioPageRoutingModule {}
