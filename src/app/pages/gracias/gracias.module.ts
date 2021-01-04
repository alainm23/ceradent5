import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraciasPageRoutingModule } from './gracias-routing.module';

import { GraciasPage } from './gracias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraciasPageRoutingModule
  ],
  declarations: [GraciasPage]
})
export class GraciasPageModule {}
