import { Component, OnInit } from '@angular/core';

import { NavController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ActivatedRoute } from '@angular/router';
import { ApoderadosPage } from '../../modals/apoderados/apoderados.page';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.page.html',
  styleUrls: ['./doctor.page.scss'],
})
export class DoctorPage implements OnInit {
  subscription:Subscription;
  codigoUsuario:string;
  historialDoctor: any;
  historialDoctor_bak: any;
  origen:string = '';

  constructor(
    public navCtrl: NavController, 
    public database: DatabaseService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalCtrl:ModalController,
    private route: ActivatedRoute,
    private callNumber: CallNumber) {
  }

  async ngOnInit(){
    if (this.route.snapshot.paramMap.get('codigo') !== '') {
      this.codigoUsuario = this.route.snapshot.paramMap.get ('codigo');

      if (this.route.snapshot.paramMap.get ('origen') !== 'null') {
        this.origen = this.route.snapshot.paramMap.get ('origen');
      }

      let loading = await this.loadingCtrl.create({
        message: "Cargando..."           
      });

      await loading.present ();

      console.log(this.codigoUsuario);

      if (this.origen !== '') {
        this.subscription = this.database.getHistorialDoctorTotal (this.codigoUsuario).subscribe (async (info: any) => {
          console.log (info);

          this.historialDoctor = info;
          this.historialDoctor_bak = info;

          await loading.dismiss ();
        })
      } else {
        let fecha_referencia=moment().subtract (3, 'month').format('YYYY-MM-DD');        
        this.subscription=this.database.getHistorialDoctor (this.codigoUsuario, fecha_referencia).subscribe(async info=>{          
          console.log (info);
          
          this.historialDoctor = info;
          this.historialDoctor_bak = info;

          await loading.dismiss ();
        }) 
      }
    }else {
      this.navCtrl.navigateRoot("dashboard");
    }
  }

  onInput($event){
    console.log($event.target.value);
    this.historialDoctor = this.historialDoctor_bak;
    let q = $event.target.value;
    if (q != "" && q!=undefined) {
      this.historialDoctor = this.historialDoctor.filter (item => {        
        return (item.dataPlaca.nombre_cliente.toLowerCase().indexOf (q.toLowerCase()) > -1)         
      });
    }   
  }

  ngOnDestroy(){
    if (this.subscription!=undefined && this.subscription!=null)
    this.subscription.unsubscribe();
  }

  mostrarFecha(fecha:string){
    return moment(fecha).locale("es").format('MMMM DD [del] YYYY[,] h:mm a');
  }

  mostrarPlacas(codigoPlaca){
    this.navCtrl.navigateForward(['servicios', codigoPlaca]);
  }

  callDoctor(codigo){
    this.database.getDoctorEstatic(codigo).then(info=>{
      if (info.telefono!="" && info.telefono!=undefined){
        this.callNumber.isCallSupported()
        .then(function (response) {
          if (response == true) {
            this.callNumber.callNumber(info.telefono, true);// do something
          } else {
            this.presentToast('Su dispositivo no permite realizar llamadas','error');
          }
        });
      }else{
        this.presentToast('El Doctor no tiene asociado un numero de telefono','error');
      }
    })
  }

  callCliente(codigo){
    this.database.getClienteEstatic(codigo).then(info=>{
      if (info.telefono!="" && info.telefono!=undefined){
        this.callNumber.isCallSupported()
        .then(function (response) {
            if (response == true) {
              this.callNumber.callNumber(info.telefono, true);// do something
            } else {
              this.presentToast('Su dispositivo no permite realizar llamadas','error');
            }
        });
      }else{
        this.presentToast ('El Cliente no tiene asociado un numero de telefono','error');
      }
    })
  }

  async mostrarTutores(cliente){
    console.log (cliente);

    const modal = await this.modalCtrl.create({
      component: ApoderadosPage,
      componentProps: {
        'cliente': cliente,
      }
    });
    return await modal.present();
  }

  async presentToast (message,type) {
    if (type=="exito"){
      let toast = await this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom',
        cssClass: "toast-success"
      });
      await toast.present();
    }else{
      let toast = await this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom',
        cssClass: "toast-error"
      });
      await toast.present();
    }    
  }

  back () {
    this.navCtrl.back ();
  }
}
