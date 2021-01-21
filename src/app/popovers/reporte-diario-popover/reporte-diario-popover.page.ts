import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-reporte-diario-popover',
  templateUrl: './reporte-diario-popover.page.html',
  styleUrls: ['./reporte-diario-popover.page.scss'],
})
export class ReporteDiarioPopoverPage implements OnInit {
  @Input () item: any;
  constructor (public popoverController: PopoverController) { }

  ngOnInit() {

  }

  action (accion: string) {
    this.popoverController.dismiss ({
      accion: accion,
      item: this.item
    }, 'ok');
  }
}
