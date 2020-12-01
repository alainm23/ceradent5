import { Component, OnInit, Input } from '@angular/core';

import { NavController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { ApoderadosPage } from '../apoderados/apoderados.page';

@Component({
  selector: 'app-historial-cliente',
  templateUrl: './historial-cliente.page.html',
  styleUrls: ['./historial-cliente.page.scss'],
})
export class HistorialClientePage implements OnInit {
  @Input() cliente: string;
  subscription:Subscription;
  subscription1:Subscription;
  historialCliente:any;
  datosCliente:any;

  constructor(
    public navCtrl: NavController, 
    public database: DatabaseService,
    public loadingCtrl: LoadingController,
    private callNumber: CallNumber,
    private route: ActivatedRoute,
    public modalCtrl:ModalController,
    public toastCtrl:ToastController) {
  }

  dismiss(){
    this.modalCtrl.dismiss ();
  }

  async ngOnInit(){
    //recibimos el parametro
    if (this.route.snapshot.paramMap.get('cliente')!=undefined && this.route.snapshot.paramMap.get('cliente')!=null){
      this.cliente=this.route.snapshot.paramMap.get('cliente');
      console.log('esto vaidamos:'+this.cliente);
      let loading = await this.loadingCtrl.create({
        message: "Procesando informacion..."           
      })
      loading.present ().then(_=>{        
        this.historialCliente=this.database.getHistorialClienteTotal(this.cliente);
        this.subscription=this.database.getHistorialClienteTotal(this.cliente).subscribe(_=>{          
          //this.database.getClienteObservable(data.usuario);          
          this.subscription1=this.database.getClienteObservableConPlacas(this.cliente).subscribe(info=>{                                  
            loading.dismiss().then(()=>{   
              console.log (info);         
              this.datosCliente=info; 
            }) 
          })          
        })        
      });    
    }else{
      this.dismiss ();
    }
  }

  mostrarPlacas(codigoPlaca){
    this.navCtrl.navigateForward (["servicios", codigoPlaca])
  }

  mostrarFecha(fecha:string){
    return moment(fecha).locale("es").format('MMMM DD [del] YYYY[,] h:mm a');
  }

  callDoctor(codigo){
    this.database.getDoctorEstatic(codigo).then(info=>{
      if (info.telefono!="" && info.telefono!=undefined){
        //this.callNumber.isCallSupported()
        //.then(function (response) {
            //if (response == true) {
              this.callNumber.callNumber(info.telefono, true);// do something
            //}
            //else {
              //this.presentToast('Su dispositivo no permite realizar llamadas','error');
            //}
        //});
      }else{
        this.presentToast('El Doctor no tiene asociado un numero de telefono','error');
      }
    })
  }

  callCliente(codigo){
    this.database.getClienteEstatic(codigo).then(info=>{
      if (info.telefono!="" && info.telefono!=undefined){
        //this.callNumber.isCallSupported()
        //.then(function (response) {
            //if (response == true) {
              this.callNumber.callNumber(info.telefono, true);// do something
            //}
            //else {
              //this.presentToast('Su dispositivo no permite realizar llamadas','error');
            //}
        //});
      }else{
        this.presentToast('El Cliente no tiene asociado un numero de telefono','error');
      }
    })
  }

  async mostrarTutores(cliente){
    const modal = await this.modalCtrl.create({
      component: ApoderadosPage,
      componentProps: {
        'cliente': cliente,
      }
    });

    return await modal.present ();
  }

  async presentToast(message,type) {
    if (type=="exito"){
      let toast = await this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom',
        cssClass: "toast-success"
      });
      toast.present();
    }else{
      let toast = await this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom',
        cssClass: "toast-error"
      });
      toast.present();
    }    
  }
}
