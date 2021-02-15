import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import { AlertController, NavController, LoadingController, Platform, ToastController, MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { EventsService } from 'src/app/services/events.service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { WindowService } from '../../services/window.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  codigoForm: FormGroup;
  phoneForm: FormGroup;

  verificationId: string;
  alert_ctrl: any = null;
  firebase_authentication: any;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public database: DatabaseService,
    public firebaseAuthentication: FirebaseAuthentication,
    public events: EventsService,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public windowService: WindowService,
    public toastCtrl: ToastController,
    public menuController: MenuController
    ) {
  }

  ngOnInit () {
    this.codigoForm = new FormGroup ({
      'email': new FormControl("",[Validators.required, Validators.email]),
      'password':  new FormControl("",[Validators.required])
    });

    this.phoneForm = new FormGroup ({
      'phoneNumber': new FormControl("",[Validators.required]),
    });
  }

  ionViewWillEnter () {
    this.menuController.enable (false, 'menu');

    this.firebase_authentication = this.firebaseAuthentication.onAuthStateChanged ().subscribe (async (user: any) => {
      if (user && this.alert_ctrl !== null) {
        this.alert_ctrl.dismiss ();

        let loading = await this.loadingCtrl.create ({
          message: "Procesando..."            
        });
        
        loading.present ();

        this.database.iniciarSesionAnonimo ().then (() => {
          this.database.guardarDatosUsuarioLocal ('+51' + this.phoneForm.value.phoneNumber).then (_=> {
            loading.dismiss ();
            this.events.user_login (null);
            this.navCtrl.navigateRoot ("dashboard");
            this.menuController.enable (true, 'menu');
          });
        }).catch ((error: any) => {
          loading.dismiss ();
          console.log (error);
        });
      }
    });
  }

  ionViewWillLeave () {
    if (this.firebase_authentication !== null && this.firebase_authentication !== undefined) {
      this.firebase_authentication.unsubscribe ();
    }
  }

  async openExplicacion () {
    let alert = await this.alertCtrl.create({
      header: "Seguridad primero",
      subHeader: "Porque debo ingresar mi numero de celular?",
      message: "<b>Para proteger su información</b>.<br><br>Porque de esta manera nos aseguramos que usted es el titular, el cual debe tener acceso.<br><br>Un mensaje de texto con un codigo será enviado a su celular, como proceso de verificación.",
      buttons: [
        {
          text: "Entendido",
          role: "cancelar"
        }
      ]
    })

    await alert.present ();
  }

  async login () {
    let phoneNumber = '+51' + this.phoneForm.value.phoneNumber;
    let loading = await this.loadingCtrl.create ({
      message: "Procesando..."            
    });
    
    loading.present ();

    if (this.platform.is ('cordova')) {
      this.firebaseAuthentication.verifyPhoneNumber (phoneNumber, 30000).then ((verificationId: any) => {
        loading.dismiss ();
        this.verificarCodigo (verificationId, phoneNumber)
      }).catch ((err: any) => {
        console.error ("phoner number verification failed", err);
        loading.dismiss ();
      });
    } else {
      this.database.iniciarSesionAnonimo ().then (() => {
        this.database.guardarDatosUsuarioLocal ('+51' + this.phoneForm.value.phoneNumber).then(_=> {
          loading.dismiss ();
          this.events.user_login (null);
          this.navCtrl.navigateRoot("dashboard");
          this.menuController.enable (true, 'menu');
        });
      });
    }
  }

  async verificarCodigo (verificationId: string, phoneNumber: string) {
    this.alert_ctrl = await this.alertCtrl.create ({
      header: 'Verificacion',
      subHeader: "ingrese el codigo de confirmación",
      message: "Un mensaje de texto se ha enviado a <b>" + phoneNumber + "</b> con el codigo de acceso.",
      inputs: [
        {
          name: 'codigo',
          type: 'number',
          placeholder: 'Codigo'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Confirmar',
          handler: async (data) => {
            let loading = await this.loadingCtrl.create ({
              message: "Procesando..."            
            });
            
            loading.present ();

            this.firebaseAuthentication.signInWithVerificationId (verificationId, data.codigo).then ((response: any) => {
              loading.dismiss ();
              this.database.iniciarSesionAnonimo ().then (() => {
                this.database.guardarDatosUsuarioLocal (phoneNumber).then (_=> {
                  loading.dismiss ();
                  this.events.user_login (null);
                  this.navCtrl.navigateRoot("dashboard");
                  this.menuController.enable (true, 'menu');
                });
              });
            }, error => {
              console.log (error);
              loading.dismiss ();
              this.presentToast ('Error de verificacion: ingreso un codigo invalido o ya expirado, intentelo nuevamente', "error");
            });
          }
        }
      ]
    });

    await this.alert_ctrl.present ();
  }

  async onSubmit () {
    let loading = await this.loadingCtrl.create ({
      message: "Procesando..."            
    });
    
    loading.present ();

    const value = this.codigoForm.value;
    this.database.iniciarSesionEmail(value.email.toString().trim(), value.password.toString().trim()).then (data => {
      loading.dismiss ();
      this.events.user_login (null);
      this.navCtrl.navigateRoot("dashboard");
      this.menuController.enable (true, 'menu');
    }, async error => {
      loading.dismiss ();
      let alert = await this.alertCtrl.create({
        header: "Error de acceso",
        message: error,
        buttons: [
          {
            text: "Entendido",
            role: "cancelar"
          }
        ]
      })

      await alert.present();
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
      toast.present ();
    }
  }
}
