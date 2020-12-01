import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventsService } from './events.service';

declare var Culqi: any;

@Injectable({
  providedIn: 'root'
})
export class CulqiService {

  constructor(public http: HttpClient, private events: EventsService) {
    document.addEventListener ('payment_event', (token: any) => {
    const token_id = token.detail;
    this.events.publishSomeData (token_id);
    }, false);
  }

  initCulqi () {
    // Ingresa tu "Puclic Key" que te da Culqi aqui
    Culqi.publicKey = 'pk_live_YuRP3ASplPpSEcpT'; //
  }

  cfgFormulario (descripcion: string, cantidad: number) {
    Culqi.getOptions.style.logo = "https://www.ceradentperu.com/icono_ceradent_culqi.png";
      Culqi.settings ({
      title: 'Ceradent',
      currency: 'PEN',
      description: descripcion,
      amount: cantidad
    });
  }

  openCulqi () {
    Culqi.open ();
  }
}
