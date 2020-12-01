import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImagenViewPageRoutingModule } from './imagen-view-routing.module';

import { ImagenViewPage } from './imagen-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImagenViewPageRoutingModule
  ],
  declarations: [ImagenViewPage]
})
export class ImagenViewPageModule {}
