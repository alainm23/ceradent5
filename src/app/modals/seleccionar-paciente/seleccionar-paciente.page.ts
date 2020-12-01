import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-seleccionar-paciente',
  templateUrl: './seleccionar-paciente.page.html',
  styleUrls: ['./seleccionar-paciente.page.scss'],
})
export class SeleccionarPacientePage implements OnInit {
  search_text: string = '';
  items: any [] = [];
  constructor (
    private viewCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private database: DatabaseService,
    public alertController: AlertController,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  dismiss () {
    this.viewCtrl.dismiss ();
  }

  async search () {
    if (this.search_text.trim () !== '') {
      let loading = await this.loadingCtrl.create({
        message: "Procesando informacion..."            
      });
  
      loading.present ();

      this.database.getClientesDNI (this.search_text.toLowerCase ()).subscribe ((res: any[]) => {
        console.log (res);
        loading.dismiss ();
        this.items = res;
      }, error => {
        console.log (error);
      });
    }
  }

  select (item: any) {
    this.viewCtrl.dismiss (item, 'ok');
  }

  async registrar () {
    const alert = await this.alertController.create({
      header: 'Registrar',
      message: 'Ingrese los nommbres y numero de DNI del nuevo cliente',
      inputs: [
        {
          name: 'nombres',
          type: 'text',
          placeholder: 'Nombres'
        },
        {
          name: 'dni',
          type: 'text',
          placeholder: 'DNI'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Registrar',
          handler: (data) => {
            this.registrar_cliente (data);
          }
        }
      ]
    });

    await alert.present();
  }

  async registrar_cliente (data: any) {
    if (data.nombres.trim () !== '' && data.dni.trim () !== '') {
      let loading = await this.loadingCtrl.create({
        message: "Procesando informacion..."            
      });
  
      loading.present ();

      let dni_valid = await this.database.is_valid_dni (data.dni.trim ());
      console.log ('dni_valid', dni_valid);
      
      if (dni_valid === undefined) {
        let cliente: any = {
          id: this.database.createId (),
          nombres: data.nombres,
          dni: data.dni
        };

        this.database.addCliente (cliente).then (() => {
          loading.dismiss ();
          this.viewCtrl.dismiss (cliente, 'ok');
          this.presentToast ('El cliente se registro correctamente', 'exito');
        }, error => {
          console.log (error);
          loading.dismiss ();
          this.presentToast ('Algo paso, error', 'error');
        });
      } else {
        loading.dismiss ();
        this.presentToast ('El numero de DNI ya se encuentra registrado', 'error');
      }
    } else {
      this.presentToast ('Ingrese los datos correctamente', 'error');
    }
  }

  async presentToast(message,type) {
    if (type =="exito"){
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
}
