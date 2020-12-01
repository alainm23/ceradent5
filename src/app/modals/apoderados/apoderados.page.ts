import { Component, OnInit, Input } from '@angular/core';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-apoderados',
  templateUrl: './apoderados.page.html',
  styleUrls: ['./apoderados.page.scss'],
})
export class ApoderadosPage implements OnInit {
  apoderados:any;
  subscription:Subscription;

  @Input() cliente: any;
  constructor(
    public navCtrl: NavController, 
    public loadingCtrl: LoadingController,
    public viewCtrl: ModalController,
    private database: DatabaseService) {
  }

  async ngOnInit(){
    let loading = await this.loadingCtrl.create({
      message: "Procesando informacion..."            
    })
    
    loading.present().then(_=>{
      this.subscription=this.database.getTutoresMenor(this.cliente).subscribe(data=>{
        loading.dismiss().then(_=>{
          console.log (data);
          this.apoderados=data;
        })
      })
    });
  }

  callPadre(telefono){

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
