import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoctorPage } from './doctor.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorPageRoutingModule {}
