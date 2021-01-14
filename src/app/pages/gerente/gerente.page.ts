import { Component, OnInit } from '@angular/core';

import { NavController, LoadingController } from '@ionic/angular';

import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-gerente',
  templateUrl: './gerente.page.html',
  styleUrls: ['./gerente.page.scss'],
})
export class GerentePage implements OnInit {
  listaSucursales:any;
  subscription:Subscription;
  subscription1:Subscription;
  anio_mostrar:any=moment().format('YYYY');
  mes_mostrar=moment().locale('es').format('MMMM');
  resumenServicios: Map<string, any> = new Map<string, any>();
  saldosSucursal: Map<string, any> = new Map<string, any>();

  constructor(
    public navCtrl: NavController, 
    public database: DatabaseService,
    public loadingCtrl: LoadingController) {
  }

  async ngOnInit(){
    let anio_actual=moment().format('YYYY');
    let mes_actual=moment().format('MM'); 
    let loading = await this.loadingCtrl.create({
      message: "Cargando..."            
    })
    
    loading.present().then(()=>{
      this.listaSucursales = this.database.getResumenSucursales(anio_actual,mes_actual);
      console.log (this.listaSucursales);

      this.subscription=this.database.getResumenSucursales(anio_actual,mes_actual).subscribe(sucursales=>{          
        loading.dismiss().then (_=>{
          sucursales.forEach (element => {
            this.database.getResumenServiciosPorSucursal(element.data.id, anio_actual, mes_actual).subscribe(list=>{
              this.resumenServicios.set(element.data.id, list);
            })
            /*this.database.getSaldosMensualesSucursal(anio_actual, mes_actual, element.data.id).subscribe(saldos=>{
              if (saldos.length>0){
                this.saldosSucursal.set(element.data.id, saldos.filter ((item) =>item.efectivo+item.tarjeta).map((item) => +item.efectivo+item.tarjeta).reduce((sum, current) => sum + current, 0));
              }else{
                this.saldosSucursal.set(element.data.id, 0);
              }
            })*/
          });

          console.log (this.resumenServicios);
        })                
      })
    });    
  }

  toggleSection(indice:string, sucursal:string) {    
    this.resumenServicios.get(sucursal)[indice].open = !this.resumenServicios.get(sucursal)[indice].open;
  }

  mostrarDetalle(sucursal){
    console.log(sucursal);
    this.navCtrl.navigateForward (["reporte-diario", sucursal]);
  }

  ngOnDestroy(){
    if (this.subscription!=undefined && this.subscription!=null)
    this.subscription.unsubscribe();
  }

  ver_servicio (servicio: any) {
    if (servicio.visible === null || servicio.visible === undefined) {
      servicio.visible = true;
      return;
    }

    servicio.visible = !servicio.visible;
  }

  ver_item (item: any) {
    if (item.visible === null || item.visible === undefined) {
      item.visible = true;
      return;
    }

    item.visible = !item.visible;
  }

  back () {
    this.navCtrl.back ();
  }
}
