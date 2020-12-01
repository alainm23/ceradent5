import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GerentePageRoutingModule } from './gerente-routing.module';

import { GerentePage } from './gerente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GerentePageRoutingModule
  ],
  declarations: [GerentePage]
})
export class GerentePageModule {}
