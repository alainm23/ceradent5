import { Component, OnInit } from '@angular/core';

import { NavController, LoadingController } from '@ionic/angular';
import * as moment from 'moment';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { combineLatest } from "rxjs/index";
import { map } from 'rxjs/operators';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  codigoUsuario:string;
  historialCliente: any [];
  subscription:Subscription;
  subscription1:Subscription;

  constructor(
    public navCtrl: NavController, 
    public database: DatabaseService,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController) {
  }

  async ngOnInit(){  
    if (this.route.snapshot.paramMap.get('codigo')!=undefined && this.route.snapshot.paramMap.get('codigo')!=null){
      let loading = await this.loadingCtrl.create({
        message: "Cargando..."           
      })
      
      loading.present().then(()=>{
        this.codigoUsuario=this.route.snapshot.paramMap.get('codigo');
        let fecha_referencia=moment().subtract(3, 'month').format('YYYY-MM-DD');
        //this.historialCliente=this.database.getHistorialCliente(this.codigoUsuario, fecha_referencia);        
        this.subscription = this.database.getHistorialCliente(this.codigoUsuario, fecha_referencia).subscribe((dd: any []) =>{
          this.subscription1 = this.database.getPlacasMenor(this.codigoUsuario, fecha_referencia).subscribe((info: any []) =>{            
            console.log('dd', dd);
            console.log('info', info);
            
            this.historialCliente = dd.concat (info [0]);
            loading.dismiss()
            //this.historialCliente = combineLatest<any[]>(info, dd).pipe(map(arr => arr.reduce((acc, cur) => acc.concat(cur) ) ),) 
          });         
        })
      })
    }else{
      this.navCtrl.navigateRoot ('dashboard');
    }    
  }

  ngOnDestroy(){
    if (this.subscription!=undefined && this.subscription!=null)
    this.subscription.unsubscribe();
    if (this.subscription1!=undefined && this.subscription1!=null)
    this.subscription1.unsubscribe();
  }

  mostrarFecha(fecha:string){
    console.log(fecha);
    return moment(fecha).locale("es").format('MMMM DD [del] YYYY[,] h:mm a');
  }

  mostrarPlacas(codigoPlaca){
    this.navCtrl.navigateForward("servicios", codigoPlaca);
  }
}
