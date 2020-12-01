import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorPageRoutingModule } from './doctor-routing.module';

import { DoctorPage } from './doctor.page';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorPageRoutingModule,
    OrderModule
  ],
  declarations: [DoctorPage]
})
export class DoctorPageModule {}
