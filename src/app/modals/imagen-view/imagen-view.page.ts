import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { RangePage } from '../../popovers/range/range.page';
import { EventsService } from '../../services/events.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-imagen-view',
  templateUrl: './imagen-view.page.html',
  styleUrls: ['./imagen-view.page.scss'],
})
export class ImagenViewPage implements OnInit {
  @Input() imagen: any;
  slideOpts = {
    zoom: {
      maxRatio: 5,
    }
  };

  brightness: number = 1;
  contrast: number = 1;
  constructor (private mnodal: ModalController,
      public popoverController: PopoverController,
      private screenOrientation: ScreenOrientation,
      public events: EventsService) { }

  ngOnInit() {
    this.screenOrientation.unlock ();
    this.events.get_range_changed ().subscribe ((data: any) => {
      if (data.tipo === "sunny") {
        this.brightness = data.value;
      } else {
        this.contrast = data.value;
      }

      console.log ('brightness:', this.brightness);
      console.log ('contrast:', this.contrast);
    });
  }

  close () {
    this.mnodal.dismiss ();
  }

  ionViewDidLeave () {
    this.screenOrientation.lock (this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
  }

  async present_popover (ev: any, tipo: string) {
    let value = this.brightness;
    let icon = 'sunny';
    if (tipo === 'contrast') {
      value = this.contrast;
      icon = 'contrast';
    }

    const popover = await this.popoverController.create({
      component: RangePage,
      event: ev,
      showBackdrop: false,
      componentProps: {
        value: value,
        icon: icon
      }
    });

    return await popover.present();
  }

  reset () {
    this.brightness = 1;
    this.contrast = 1;
  }
}
