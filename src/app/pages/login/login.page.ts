import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators} from "@angular/forms";
import { AlertController, NavController, LoadingController, Platform } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { EventsService } from 'src/app/services/events.service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  codigoForm: FormGroup;
  phoneForm: FormGroup;

  verificationId: string;
  alert_ctrl: any;
  onAuthStateChanged: any;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public database: DatabaseService,
    public firebaseAuthentication: FirebaseAuthentication,
    public events: EventsService,
    public platform: Platform,
    public loadingCtrl: LoadingController
    ) {
  }

  ngOnInit () {
    this.codigoForm = new FormGroup({
      'email': new FormControl("",[Validators.required, Validators.email]),
      'password':  new FormControl("",[Validators.required])
    });

    this.phoneForm = new FormGroup({
      'phoneNumber': new FormControl("",[Validators.required]),
    });
  }

  async openExplicacion(){
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

    await alert.present();
  }

  async login () {
    let loading = await this.loadingCtrl.create({
      message: "Cargando..."            
    })
    
    loading.present ();

    // if (this.platform.is ('cordova')) {
    //   this.firebaseAuthentication.verifyPhoneNumber ('+51' + this.phoneForm.value.phoneNumber, 30000).then ((verificationId: any) => {
    //     loading.dismiss ();

    //     if (typeof verificationId === "string") {
    //       this.verificationId = verificationId;
    //       const smsCode = prompt ("Enter SMS verification code");
    //       return this.firebaseAuthentication.signInWithVerificationId (verificationId, smsCode);
    //     }

    //     return verificationId;
    //   }).then((userInfo) => {
    //     if (userInfo) {
    //       alert (JSON.stringify (userInfo));
    //     }
    //   });
    // } else {
      this.database.iniciarSesionAnonimo ().then (() => {
        this.database.guardarDatosUsuarioLocal ('+51' + this.phoneForm.value.phoneNumber).then(_=> {
          loading.dismiss ();
          this.events.user_login (null);
          this.navCtrl.navigateRoot("dashboard");
        });
      }); 
    // }
  }

  // async verificarCodigo (id: string, phoneNumber: string) {
  //   this.alert_ctrl = await this.alertCtrl.create({
  //     header: 'Ingrese codigo',
  //     inputs: [
  //       {
  //         name: 'codigo',
  //         type: 'number',
  //         placeholder: 'Codigo'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           console.log('Confirm Cancel');
  //         }
  //       }, {
  //         text: 'Verificar',
  //         handler: async (data) => {
  //           // this.firebaseAuthentication.signInWithVerificationId (id, data.codigo);
  //         }
  //       }
  //     ]
  //   });

  //   await this.alert_ctrl.present ();
  // }
  
  login_phoneNumber (phoneNumber: string) {
    this.database.iniciarSesionAnonimo ().then (() => {
      this.database.guardarDatosUsuarioLocal(phoneNumber).then(_=> {
        this.events.user_login (null);
        this.navCtrl.navigateRoot("dashboard");
        this.onAuthStateChanged.unsubscribe ();
      });
    });
  }

  onSubmit (){
    const value = this.codigoForm.value;
    console.log(value)
    this.database.iniciarSesionEmail(value.email.toString().trim(), value.password.toString().trim()).then(data=>{
      console.log(data)
      // this.events.publish('user:login');
      this.navCtrl.navigateRoot("dashboard")
    }, async error =>{
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
    })
  }
}
