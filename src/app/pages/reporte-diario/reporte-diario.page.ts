import { Component, OnInit } from '@angular/core';

import { NavController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import * as moment from 'moment';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ActivatedRoute } from '@angular/router';
import { ApoderadosPage } from 'src/app/modals/apoderados/apoderados.page';
import { HistorialPagoPage } from '../../modals/historial-pago/historial-pago.page';

@Component({
  selector: 'app-reporte-diario',
  templateUrl: './reporte-diario.page.html',
  styleUrls: ['./reporte-diario.page.scss'],
})
export class ReporteDiarioPage implements OnInit {
  fechaActual=moment().format('YYYY-MM-DD');
  sucursal:string;
  public loading:any;
  listaSucursales: any;
  ventasMensuales: any;
  saldosMensuales:any;
  subscription:Subscription;
  subscription1:Subscription;
  subscription2:Subscription;
  montoVendido:any=0;
  montoSaldos:any=0;
  montoEfectivoVendido:any=0;
  montoTarjetaVendido:any=0;
  montoEfectivoSaldo:any=0;
  montoTarjetaSaldo:any=0;

  constructor(
    public navCtrl: NavController, 
    public database: DatabaseService,
    public loadingCtrl:LoadingController,
    public modalCtrl: ModalController,
    private callNumber: CallNumber,
    private route: ActivatedRoute,
    public toastCtrl: ToastController) {
  }

  async ngOnInit(){
    if (this.route.snapshot.paramMap.get("sucursal") !== undefined){
      this.sucursal = this.route.snapshot.paramMap.get ("sucursal"); 
      let loading = await this.loadingCtrl.create ({
         message: "Procesando informacion..."            
      });

      await loading.present ();

      this.listaSucursales = this.database.getSucursales ();

      this.subscription = this.database.getSucursales().subscribe (_=> {
        this.subscription1 = this.database.getVentasDiariasSucursal (this.sucursal, this.fechaActual).subscribe(ventas=>{
          this.ventasMensuales = ventas;

          this.subscription2 = this.database.getSaldosDiariosSucursal (this.fechaActual, this.sucursal).subscribe(saldos=>{
            this.saldosMensuales = saldos;
            
            if (this.ventasMensuales.length > 0){
              this.montoVendido = this.ventasMensuales.filter ((item) =>item.dataPlaca.primer_pago_efectivo+item.dataPlaca.primer_pago_tarjeta).map((item) => +item.dataPlaca.primer_pago_efectivo+item.dataPlaca.primer_pago_tarjeta).reduce((sum, current) => sum + current, 0);              
              this.montoEfectivoVendido = this.ventasMensuales.filter ((item) =>item.dataPlaca.primer_pago_efectivo).map((item) => +item.dataPlaca.primer_pago_efectivo).reduce((sum, current) => sum + current, 0);              
              this.montoTarjetaVendido = this.ventasMensuales.filter ((item) =>item.dataPlaca.primer_pago_tarjeta).map((item) => +item.dataPlaca.primer_pago_tarjeta).reduce((sum, current) => sum + current, 0);              
            }
            
            if (this.saldosMensuales.length > 0){
              this.montoSaldos = this.saldosMensuales.filter ((item) =>item.dataPlaca.efectivo+item.dataPlaca.tarjeta).map((item) => +item.dataPlaca.efectivo+item.dataPlaca.tarjeta).reduce((sum, current) => sum + current, 0);              
              this.montoEfectivoSaldo = this.saldosMensuales.filter ((item) =>item.efectivo).map((item) => +item.dataPlaca.efectivo).reduce((sum, current) => sum + current, 0);              
              this.montoTarjetaSaldo = this.saldosMensuales.filter ((item) =>item.tarjeta).map((item) => +item.dataPlaca.tarjeta).reduce((sum, current) => sum + current, 0);              
            }

            loading.dismiss ();
          });                  
        })
      });
    }
    else{
      this.navCtrl.navigateRoot ("gerente");
    }
  }

  async openHistorial (placa:string) {
    const modal = await this.modalCtrl.create({
      component: HistorialPagoPage,
      componentProps: {
        'placa': placa,
      }
    });

    return await modal.present ();
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

  mostrarFecha(fecha:string){
    return moment(fecha).locale("es").format('MMMM DD [del] YYYY[,] h:mm a');
  }

  mostrarPlacas(codigoPlaca){
    this.navCtrl.navigateForward (["servicios", codigoPlaca]);
  }

  async onSelectSucursal () {
    this.montoVendido=0;
    this.montoSaldos=0;
    this.montoEfectivoVendido=0;
    this.montoTarjetaVendido=0;
    this.montoEfectivoSaldo=0;
    this.montoTarjetaSaldo=0;
    this.loading = await this.loadingCtrl.create({
      message: "Procesando informacion..."            
    })
    this.loading.present().then(async ()=>{     
      this.subscription1=this.database.getVentasDiariasSucursal(this.sucursal, this.fechaActual).subscribe(ventas=>{
        this.ventasMensuales=ventas;        
        this.subscription2=this.database.getSaldosDiariosSucursal(this.fechaActual, this.sucursal).subscribe(saldos=>{
          this.saldosMensuales=saldos;          
          this.loading.dismiss().then(_=>{                               
            if (this.ventasMensuales.length>0){
              this.montoVendido = this.ventasMensuales.filter ((item) =>item.dataPlaca.primer_pago_efectivo+item.dataPlaca.primer_pago_tarjeta).map((item) => +item.dataPlaca.primer_pago_efectivo+item.dataPlaca.primer_pago_tarjeta).reduce((sum, current) => sum + current, 0);              
              this.montoEfectivoVendido = this.ventasMensuales.filter ((item) =>item.dataPlaca.primer_pago_efectivo).map((item) => +item.dataPlaca.primer_pago_efectivo).reduce((sum, current) => sum + current, 0);              
              this.montoTarjetaVendido = this.ventasMensuales.filter ((item) =>item.dataPlaca.primer_pago_tarjeta).map((item) => +item.dataPlaca.primer_pago_tarjeta).reduce((sum, current) => sum + current, 0);              
            }
            if (this.saldosMensuales.length>0){
              this.montoSaldos = this.saldosMensuales.filter ((item) =>item.dataPlaca.efectivo+item.dataPlaca.tarjeta).map((item) => +item.dataPlacaefectivo+item.dataPlaca.tarjeta).reduce((sum, current) => sum + current, 0);              
              this.montoEfectivoSaldo = this.saldosMensuales.filter ((item) =>item.dataPlaca.efectivo).map((item) => +item.dataPlaca.efectivo).reduce((sum, current) => sum + current, 0);              
              this.montoTarjetaSaldo = this.saldosMensuales.filter ((item) =>item.dataPlaca.tarjeta).map((item) => +item.dataPlaca.tarjeta).reduce((sum, current) => sum + current, 0);              
            }
          })
        })           
      })      
    })    
  }

  async onSelectDate () {
    let fechaActual=moment (this.fechaActual).subtract(1, 'month').format('YYYY-MM-DD');
    this.montoVendido=0;
    this.montoSaldos=0;
    this.montoEfectivoVendido=0;
    this.montoTarjetaVendido=0;
    this.montoEfectivoSaldo=0;
    this.montoTarjetaSaldo=0;
    this.loading = await this.loadingCtrl.create({
      message: "Procesando informacion..."            
    })
    this.loading.present().then(()=>{
      this.subscription1=this.database.getVentasDiariasSucursal(this.sucursal, fechaActual).subscribe(ventas=>{
        this.ventasMensuales=ventas;        
        this.subscription2=this.database.getSaldosDiariosSucursal(fechaActual, this.sucursal).subscribe(saldos=>{
          this.saldosMensuales=saldos;          
          this.loading.dismiss().then(_=>{                               
            if (this.ventasMensuales.length>0){
              console.log('tiene ventas');
              this.montoVendido = this.ventasMensuales.filter ((item) =>item.dataPlaca.primer_pago_efectivo+item.dataPlaca.primer_pago_tarjeta).map((item) => +item.dataPlaca.primer_pago_efectivo+item.dataPlaca.primer_pago_tarjeta).reduce((sum, current) => sum + current, 0);              
              this.montoEfectivoVendido = this.ventasMensuales.filter ((item) =>item.dataPlaca.primer_pago_efectivo).map((item) => +item.dataPlaca.primer_pago_efectivo).reduce((sum, current) => sum + current, 0);              
              this.montoTarjetaVendido = this.ventasMensuales.filter ((item) =>item.dataPlaca.primer_pago_tarjeta).map((item) => +item.dataPlaca.primer_pago_tarjeta).reduce((sum, current) => sum + current, 0);              
            }
            if (this.saldosMensuales.length>0){
              this.montoSaldos = this.saldosMensuales.filter ((item) =>item.dataPlaca.efectivo+item.dataPlaca.tarjeta).map((item) => +item.dataPlaca.efectivo+item.dataPlaca.tarjeta).reduce((sum, current) => sum + current, 0);              
              this.montoEfectivoSaldo = this.saldosMensuales.filter ((item) =>item.dataPlaca.efectivo).map((item) => +item.dataPlaca.efectivo).reduce((sum, current) => sum + current, 0);              
              this.montoTarjetaSaldo = this.saldosMensuales.filter ((item) =>item.dataPlaca.tarjeta).map((item) => +item.dataPlaca.tarjeta).reduce((sum, current) => sum + current, 0);              
              
            }
          })
        })            
      })    
    });
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

  back () {
    this.navCtrl.back ();
  }
}
