import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApoderadosPageRoutingModule } from './apoderados-routing.module';

import { ApoderadosPage } from './apoderados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApoderadosPageRoutingModule
  ],
  declarations: [ApoderadosPage]
})
export class ApoderadosPageModule {}
