import { Component, OnInit, Input } from '@angular/core';

import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-historial-pago',
  templateUrl: './historial-pago.page.html',
  styleUrls: ['./historial-pago.page.scss'],
})
export class HistorialPagoPage implements OnInit {
  subscription:Subscription;
  historialPagos:any;
  dataPlaca:any;

  @Input() placa: any;

  constructor(
    public navCtrl: NavController, 
    public database: DatabaseService,
    public loadingCtrl: LoadingController,
    public viewCtrl: ModalController) {
  }

  async ngOnInit(){
    console.log('placa'+this.placa);

    let loading = await this.loadingCtrl.create({
      message: "Cargando...",      
    });
    
    loading.present().then(()=>{
      this.subscription=this.database.getHistorialPago(this.placa).subscribe(data=>{
        loading.dismiss().then(_=>{
          this.historialPagos=data;
          this.dataPlaca=this.database.getPlaca(this.placa);
        })        
      })
    });
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  fecha(fecha){
    return moment(fecha).locale('es').format('DD [de] MMMM [del] YYYY, h:mm a');
  }
}
