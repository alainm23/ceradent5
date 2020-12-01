import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImagenViewPage } from './imagen-view.page';

const routes: Routes = [
  {
    path: '',
    component: ImagenViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagenViewPageRoutingModule {}
