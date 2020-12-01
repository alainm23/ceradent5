import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-doctores',
  templateUrl: './doctores.page.html',
  styleUrls: ['./doctores.page.scss'],
})
export class DoctoresPage implements OnInit {
  subscription:Subscription;
  listaDoctores:any;
  listaDoctores_bak:any;

  constructor(
    public navCtrl: NavController, 
    public database: DatabaseService,
    public loadingCtrl: LoadingController) {
  }

  async ngOnInit(){
    let loading = await this.loadingCtrl.create({
      message: "Cargando..."            
    })
    
    loading.present().then(()=>{
      this.subscription=this.database.getDoctores ().subscribe (data=>{    
        loading.dismiss().then(()=>{
          this.listaDoctores=data;
          this.listaDoctores_bak=data; 
        })     
      }); 
    })   
  }

  onInput($event){
    this.listaDoctores = this.listaDoctores_bak;
    let q = $event.target.value;
    if (q != "") {
      this.listaDoctores = this.listaDoctores.filter ( item => {
        return (item.apellidos.toLowerCase().indexOf (q.toLowerCase()) > -1) 
      });
    }   
  }

  openHistorialDoctor(doctor:string){
    this.navCtrl.navigateForward (['doctor', doctor, 'gerente']);
  }

  ngOnDestroy(){
    if (this.subscription!=undefined && this.subscription!=null)
    this.subscription.unsubscribe();
  }
}
