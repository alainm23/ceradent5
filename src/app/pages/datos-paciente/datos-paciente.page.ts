import { ConstantPool } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-datos-paciente',
  templateUrl: './datos-paciente.page.html',
  styleUrls: ['./datos-paciente.page.scss'],
})
export class DatosPacientePage implements OnInit {
  form: FormGroup;
  codigo: string; 

  dni_search: string = '';
  pacientes: any [] = [];

  status: number = 0;
  paciente: any = null;
  constructor (private navController: NavController,
              private route: ActivatedRoute,
              private database: DatabaseService,
              public alertController: AlertController,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.codigo = this.route.snapshot.paramMap.get('codigo');

    this.form = new FormGroup({
      apellidos: new FormControl ('',[Validators.required]),
      nombres: new FormControl ('', [Validators.required]),
      dni:  new FormControl ('', [Validators.required])
    });
  }

  onSubmit () {
    console.log (this.form.value);
    this.navController.navigateForward (['datos-orden', this.codigo, JSON.stringify (this.form.value)]);
  }

  ionViewWillEnter () {
    this.reset ();
  }
  
  async submit () {
    let loading = await this.loadingCtrl.create({
      message: "Procesando informacion..."            
    });

    await loading.present ();

    if (this.status === 0) {
      console.log (this.dni_search);
      this.database.get_clientes_by_dni (this.dni_search).subscribe (async (res: any []) => {
        console.log (res);
        this.pacientes = res;
        loading.dismiss ();

        if (res.length > 0) {
          this.status = 1; // Seleccionar un paciente
        } else {
          const alert = await this.alertController.create({
            header: 'Ningun paciente encontrado',
            message: 'No se encontro ningun paciente con el DNI',
            buttons: [
              {
                text: 'Ok',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                  this.dni_search = '';
                  this.status = 0; // Verificar con DNI
                }
              }, {
                text: 'Registrar',
                handler: () => {
                  this.form.controls ['dni'].setValue (this.dni_search);
                  this.status = 2; // Rellenar informacion del paciente
                }
              }
            ]
          });
      
          await alert.present();
        }
      });
    } else if (this.status === 1) {
      console.log (this.paciente);
      this.navController.navigateForward (['datos-orden', this.codigo, JSON.stringify (this.paciente)]);
      loading.dismiss ();
    } else if (this.status === 2) {
      let request: any = {
        id: this.database.createId (),
        apellidos: this.form.value.apellidos,
        dni: this.form.value.dni,
        email: '',
        fecha_nacimiento: '',
        nombres: this.form.value.nombres,
        telefono: '',
        tipo: 'adulto'
      };

      this.database.addCliente (request).then (() => {
        loading.dismiss ();
        this.navController.navigateForward (['datos-orden', this.codigo, JSON.stringify (request)]);
      }).catch ((error: any) => {
        console.log (error);
      });
    }
  }

  valid_button () {
    let returned: boolean = true;

    if (this.status === 0) {
      returned = this.dni_search === '';
    } else if (this.status === 1) {
      returned = this.paciente === null;
    } else if (this.status === 2) {
      returned = this.form.invalid;
    }

    return returned;
  }

  changed (event: any) {
    this.status = 0;
    this.pacientes = [];
  }

  reset () {
    this.status = 0;
    this.pacientes = [];
    this.dni_search = '';
  }
}
