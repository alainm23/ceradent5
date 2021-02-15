import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import * as moment from 'moment';
@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.page.html',
  styleUrls: ['./mensajes.page.scss'],
})
export class MensajesPage implements OnInit {
  doctor_id: string;
  mensajes: any [] = [];
  constructor (
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private database: DatabaseService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    if (this.route.snapshot.paramMap.get ('id') !== '') {
      let loading = await this.loadingCtrl.create({
        message: "Cargando..."           
      });

      await loading.present ();

      this.doctor_id = this.route.snapshot.paramMap.get ('id');
      console.log (this.doctor_id);

      this.database.get_historial_mensajes_todos (this.doctor_id).subscribe ((res: any) => {
        console.log (res);
        this.mensajes = res;
        loading.dismiss ();
      }, error => {
        loading.dismiss ();
      });
    } else {
      this.navCtrl.navigateRoot("dashboard");
    }
  }

  mostrarFecha(fecha:string){
    return moment(fecha).locale("es").format('MMMM DD [del] YYYY[,] h:mm a');
  }

  async ver_mensaje (item: any) {
    console.log (item);
    if (item.para_todos) {
      if (item.leidos === undefined) {
        item.leidos = [this.doctor_id];
      } else {
        if (item.leidos.find (x => x === this.doctor_id) === undefined) {
          item.leidos.push (this.doctor_id);
          this.database.update_mensaje_todos (item.id, item);
        }
      }
    } else {
      this.database.update_mensaje (this.doctor_id, item.id, { leido: true });
    }

    const alert = await this.alertController.create ({
      header: item.asunto,
      message: item.mensaje,
      buttons: ['OK'],
      mode: 'ios'
    });

    await alert.present ();
  }

  validar_leido (item: any) {
    let returned: boolean = false;
    if (item.para_todos === true) {
      if (item.leidos === undefined) {
        returned = true;
      } else {  
        if (item.leidos.find (x => x === this.doctor_id) === undefined) {
          returned = true;
        } else {
          returned = false;
        }
      }
    } else {
      returned = item.leido === false;
    }

    return returned;
  }

  back () {
    this.navCtrl.back ();
  }
}
