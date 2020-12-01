import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoPage } from './producto.page';

const routes: Routes = [
  {
    path: '',
    component: ProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoPageRoutingModule {}
