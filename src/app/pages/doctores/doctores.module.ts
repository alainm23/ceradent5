import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctoresPageRoutingModule } from './doctores-routing.module';

import { DoctoresPage } from './doctores.page';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctoresPageRoutingModule,
    OrderModule
  ],
  declarations: [DoctoresPage]
})
export class DoctoresPageModule {}
