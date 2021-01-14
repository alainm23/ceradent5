import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../services/database.service';

declare var require: any;
const algoliasearch = require ('algoliasearch');

@Component({
  selector: 'app-doctores',
  templateUrl: './doctores.page.html',
  styleUrls: ['./doctores.page.scss'],
})
export class DoctoresPage implements OnInit {
  subscription:Subscription;
  listaDoctores:any;
  listaDoctores_bak:any;

  client: any;
  index: any;
  constructor(
    public navCtrl: NavController, 
    public database: DatabaseService,
    public loadingCtrl: LoadingController) {
  }

  async ngOnInit() {
    this.client = algoliasearch ("S9Z0BUVW9R", "34d4989ee34f43acce877f2d15c61611");
    this.index = this.client.initIndex ("Doctores");

    // let loading = await this.loadingCtrl.create ({
    //   message: "Cargando..."            
    // })
    
    // loading.present().then(()=>{
    //   this.subscription=this.database.getDoctores ().subscribe (data=>{    
    //     loading.dismiss().then(()=>{
    //       this.listaDoctores=data;
    //       this.listaDoctores_bak=data; 
    //     })     
    //   }); 
    // });
  }

  onInput ($event){
    let q = $event.target.value;
    if (q != "") {
      this.index
      .search(q)
      .then(({ hits }) => {
        console.log (hits);
        this.listaDoctores = hits;
      })
      .catch(err => {
        console.log (err);
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
