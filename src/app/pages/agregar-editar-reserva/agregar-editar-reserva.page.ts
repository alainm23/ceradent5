import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { SeleccionarPacientePage } from '../../modals/seleccionar-paciente/seleccionar-paciente.page'
import * as moment from 'moment';

@Component({
  selector: 'app-agregar-editar-reserva',
  templateUrl: './agregar-editar-reserva.page.html',
  styleUrls: ['./agregar-editar-reserva.page.scss'],
})
export class AgregarEditarReservaPage implements OnInit {
  codigo: string = '';
  reserva_id: string = '';
  servicios_categorias: any [] = [];
  cliente: any =  null;
  servicios: Map <string, any> = new Map <string, any> ();
  constructor (
    private route: ActivatedRoute,
    private database: DatabaseService,
    private loadingCtrl: LoadingController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public navCtrl: NavController) {}

  async ngOnInit () {
    let loading = await this.loadingCtrl.create({
      message: "Procesando informacion..."            
    });

    loading.present ();

    this.codigo = this.route.snapshot.paramMap.get ("codigo");
    this.reserva_id = this.route.snapshot.paramMap.get ("reserva_id");

    if (this.reserva_id !== 'null') {
      this.database.get_reserva_by_id (this.reserva_id).subscribe ((res: any) => {
        this.cliente.nombres = res.cliente_nombres;
        this.cliente.dni = res.cliente_dni;
        this.cliente.id = res.cliente_id;

        res.servicios.forEach ((element: any) => {
          this.servicios.set (element.id, element);
        });

        this.database.get_servicios_categorias ().subscribe ((res: any []) => {
          console.log (res);
          this.servicios_categorias = res;
          loading.dismiss ();

          res.forEach ((e: any) => {
            e.servicios.forEach ((s: any) => {
              if (this.servicios.has (s.id)) {
                s.isChecked = true;
              }
            });
          })
        });
      });
    } else {
      this.database.get_servicios_categorias ().subscribe ((res: any []) => {
        console.log (res);
        this.servicios_categorias = res;
        loading.dismiss ();
      });
    }
  }

  validar_form () {
    let returned: boolean = true;

    if (this.cliente !== null && this.servicios.size > 0) {
      returned = false;
    }

    return returned;
  }

  select_servicio (item: any) {
    if (item.isChecked) {
      this.servicios.set (item.id, item);
    } else {
      if (this.servicios.has (item.id)) {
        this.servicios.delete (item.id);
      }
    }

    console.log (this.servicios);
  }

  async presentModal () {
    const modal = await this.modalController.create({
      component: SeleccionarPacientePage,
    });

    modal.onDidDismiss ().then ((response: any) => {
      if (response.role === 'ok') {
        this.cliente = response.data;
      }
    });

    return await modal.present ();
  }

  async submit () {
    let loading = await this.loadingCtrl.create({
      message: "Procesando informacion..."            
    });

    loading.present ();

    let servicios: any [] = [];
    this.servicios.forEach ((value: any) => {
      servicios.push (value);
    });

    let request: any = {
      cliente_nombres: this.cliente.nombres,
      cliente_id: this.cliente.id,
      cliente_dni: this.cliente.dni,
      servicios: servicios,
      doctor_id: this.codigo,
      fecha_creada: moment ().format ('L')
    };

    if (this.reserva_id === 'null') {
      request.id = this.database.createId ();
      this.database.add_reserva (request).then (() => {
        loading.dismiss ();
        this.presentToast ('La reserva se genero correctamente', 'exito');
        this.navCtrl.back ();
      }).catch ((error: any) => {
        console.log (error);
        loading.dismiss ();
      });
    } else {
      request.id = this.reserva_id;
      request.fecha_actualizada = moment ().format ('L');
      delete request.fecha_creada;
      
      this.database.update_reserva (request).then (() => {
        loading.dismiss ();
        this.presentToast ('La reserva se actualizo correctamente', 'exito');
        this.navCtrl.back ();
      }).catch ((error: any) => {
        console.log (error);
        loading.dismiss ();
      });
    }
  }

  async presentToast (message,type) {
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
