import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteDiarioPopoverPageRoutingModule } from './reporte-diario-popover-routing.module';

import { ReporteDiarioPopoverPage } from './reporte-diario-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteDiarioPopoverPageRoutingModule
  ],
  declarations: [ReporteDiarioPopoverPage]
})
export class ReporteDiarioPopoverPageModule {}
