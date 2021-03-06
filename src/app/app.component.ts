import { Component } from '@angular/core';

import { NavController, Platform, ToastController, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable, Subscription } from 'rxjs';

// Services
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { DatabaseService } from './services/database.service'; 
import { ImageLoaderConfigService } from 'ionic-image-loader-v5';
import { OneSignal, OSNotificationOpenedResult, OSNotification } from '@ionic-native/onesignal/ngx';
import { EventsService } from './services/events.service';
import * as moment from 'moment';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  usuario: Observable<any>;
  permisos: any={'rol': 'Visitante','isadmin':false,'isadminprincipal':false,'isdoctor':false,'iscliente':false, 'isgerente':false};
  subscription:Subscription;
  codigoUsuario:string;
  mensajes_no_leidos: number = 0;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public database: DatabaseService,
    private imageLoaderConfig: ImageLoaderConfigService,
    private oneSignal: OneSignal,
    private nav: NavController,
    private screenOrientation: ScreenOrientation,
    private events: EventsService,
    private toastCtrl: ToastController,
    private menu_controller: MenuController,
    private firebaseAuthentication: FirebaseAuthentication,
    private alertCtrl: AlertController
  ) {
    this.initializeApp ();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is ('android')) {
        this.statusBar.overlaysWebView (false);
        this.statusBar.backgroundColorByHexString ('#000000');
      }

      if (this.platform.is ('cordova')) {
        console.log (this.screenOrientation.type);
        this.screenOrientation.lock (this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
      }

      this.imageLoaderConfig.setWidth ('40vw');
      this.imageLoaderConfig.setHeight ('40vw');
      this.imageLoaderConfig.setBackgroundSize ('cover');

      moment.locale ('es');

      // Events
      this.events.get_user_login ().subscribe (() => {
        this.cargarMenu ();
      });

      this.cargarMenu ();
    });
  }

  cargarMenu () {
    if (this.database.apple_test === true) {
      this.database.existeTelefonoRegistradoObservable("+51984780642").subscribe (dataPermisos=>{
        if (dataPermisos){
          this.codigoUsuario=dataPermisos.usuario;

          if (this.platform.is ('cordova')) {
            this.oneSignal.startInit('f11aefde-f262-4dc2-9044-c790df0144dd', '320283851351');
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
            this.oneSignal.handleNotificationOpened ().subscribe ((jsonData: OSNotificationOpenedResult) => {
              console.log ('handleNotificationOpened', jsonData);
              const destino = jsonData.notification.payload.additionalData.destino;
              if (destino == "doctores") {
                this.nav.navigateRoot (['doctor', this.codigoUsuario, 'null']);
              } else if (destino == "clientes"){
                this.nav.navigateRoot (['cliente', this.codigoUsuario]);
              } else if (destino === 'mensajes') {
                this.nav.navigateForward (['mensajes', this.codigoUsuario]);
              }
            });

            this.oneSignal.handleNotificationReceived ().subscribe (async (jsonData: OSNotification) => {
              console.log ('handleNotificationReceived', jsonData);
              const destino = jsonData.payload.additionalData.destino;
              let message = '';
              if (destino == "doctores" || destino == "clientes") {
                message = 'Ceradent: Nueva placa registrada';
              } else {
                message = 'Ceradent: Nuevo Mensaje';
              }

              let alert = await this.alertCtrl.create ({
                message: message,
                buttons: [
                  {
                    text: 'Mas tarde',
                    role: 'cancel'
                  }, {
                    text: 'Revisar',
                    handler: () => {
                      if (destino == "doctores") {
                        this.nav.navigateRoot (['doctor', this.codigoUsuario, 'null']);
                      } else if (destino == "clientes") {
                        this.nav.navigateRoot (['cliente', this.codigoUsuario]);
                      } else if (destino === 'mensajes') {
                        this.nav.navigateForward (['mensajes', this.codigoUsuario]);
                      }
                    }
                  }
                ]
              });
              
              alert.present ();
            });

            //.handleNotificationReceived()
            this.oneSignal.endInit ();

            //guardamos el token en la base de datos
            this.oneSignal.getIds ().then(ids=>{
              console.log(ids);
              //this.database.registrarToken(telefono, ids.userId);
            });

            //traemos los tags para poder modificarlos
            this.oneSignal.getTags().then(data=>{
              console.log('entra a get tags');
            });
          }
          this.permisos=dataPermisos;

          //guardamos el tag usuario para cualquier envio
          this.oneSignal.sendTag (this.codigoUsuario,"true");
          //tremos la informción
          if (dataPermisos.isgerente){
            this.usuario=this.database.getAdministradorObservable(dataPermisos.usuario);
            this.permisos.rol="Gerente";
            this.oneSignal.sendTag ("Gerente","true");
          }else{
            if (dataPermisos.isdoctor){
              this.usuario=this.database.getDoctorObservable(dataPermisos.usuario);
              this.permisos.rol="Doctor";
              this.oneSignal.sendTag ("Doctor","true");
            }else{
              if (dataPermisos.iscliente){
                this.usuario=this.database.getClienteObservable(dataPermisos.usuario);
                this.permisos.rol="Cliente";
                this.oneSignal.sendTag ("Cliente","true");
              }else{
                console.log ('El usuario no tiene un rol permitido por la aplicación')
              }
            }
          }

          this.init_mensajes (this.codigoUsuario);
        }else{
          console.log('No se encuentra el telefono'); // el telefono del ususario no esta registrado en el sistema
        }
      });
    } else {
      this.database.traerDatosUsuarioLocal().then (telefono => {
        if (telefono!=null && telefono!=undefined) {
          this.database.existeTelefonoRegistradoObservable(telefono).subscribe(dataPermisos=>{
            if (dataPermisos){
              this.codigoUsuario=dataPermisos.usuario;

              if (this.platform.is('cordova')) {
                this.oneSignal.startInit('f11aefde-f262-4dc2-9044-c790df0144dd', '320283851351');
                this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
                this.oneSignal.handleNotificationOpened ().subscribe ((jsonData: OSNotificationOpenedResult) => {
                  console.log ('handleNotificationOpened', jsonData);
                  const destino = jsonData.notification.payload.additionalData.destino;
                  if (destino === "doctores") {
                    this.nav.navigateRoot (['doctor', this.codigoUsuario, 'null']);
                  } else if (destino === "clientes"){
                    this.nav.navigateRoot (['cliente', this.codigoUsuario]);
                  } else if (destino === 'mensajes') {
                    this.nav.navigateForward (['mensajes', this.codigoUsuario]);
                  }
                });

                this.oneSignal.handleNotificationReceived ().subscribe (async (jsonData: OSNotification) => {
                  console.log ('handleNotificationReceived', jsonData);
                  const destino = jsonData.payload.additionalData.destino;
                  let message = '';
                  if (destino == "doctores" || destino == "clientes") {
                    message = 'Ceradent: Nueva placa registrada';
                  } else {
                    message = 'Ceradent: Nuevo Mensaje';
                  }

                  let alert = await this.alertCtrl.create ({
                    message: message,
                    buttons: [
                      {
                        text: 'Mas tarde',
                        role: 'cancel'
                      }, {
                        text: 'Revisar',
                        handler: () => {
                          if (destino == "doctores") {
                            this.nav.navigateRoot (['doctor', this.codigoUsuario, 'null']);
                          } else if (destino == "clientes") {
                            this.nav.navigateRoot (['cliente', this.codigoUsuario]);
                          } else if (destino === 'mensajes') {
                            this.nav.navigateForward (['mensajes', this.codigoUsuario]);
                          }
                        }
                      }
                    ]
                  });
                  
                  alert.present ();
                });

                //.handleNotificationReceived()
                this.oneSignal.endInit();

                //guardamos el token en la base de datos
                this.oneSignal.getIds().then (ids => {
                  console.log(ids);
                  this.database.registrarToken (telefono, ids.userId);
                });

                //traemos los tags para poder modificarlos
                this.oneSignal.getTags().then(data=>{
                  console.log('entra a get tags');
                });
              }
              this.permisos=dataPermisos;

              //guardamos el tag usuario para cualquier envio
              this.oneSignal.sendTag(this.codigoUsuario,"true");
              //tremos la informción
              if (dataPermisos.isgerente){
                this.usuario = this.database.getAdministradorObservable(dataPermisos.usuario);
                this.permisos.rol="Gerente";
                this.oneSignal.sendTag("Gerente","true");
              } else {
                if (dataPermisos.isdoctor){
                  this.usuario = this.database.getDoctorObservable(dataPermisos.usuario);
                  this.permisos.rol="Doctor";
                  this.oneSignal.sendTag("Doctor","true");
                } else {
                  if (dataPermisos.iscliente){
                    this.usuario = this.database.getClienteObservable(dataPermisos.usuario);
                    this.permisos.rol="Cliente";
                    this.oneSignal.sendTag("Cliente","true");
                  } else {
                    console.log('El usuario no tiene un rol permitido por la aplicación')
                  }
                }
              }

              this.init_mensajes (this.codigoUsuario);
            } else{
              console.log('No se encuentra el telefono'); // el telefono del ususario no esta registrado en el sistema
            }
          })
        } else {
          console.log('no hay datos de usuario almacenado'); // se debe cerrar sesion
        }
      });
    }
  }

  init_mensajes (id: string) {
    this.database.get_historial_mensajes_todos_badge (id).subscribe ((res: any []) => {
      this.mensajes_no_leidos = 0;
      console.log (res);
      res.forEach ((mensaje: any) => {
        if (mensaje.para_todos === true) {
          if (mensaje.leidos.find (x => x === id) === undefined) {
            this.mensajes_no_leidos++;
          }
        } else {
          this.mensajes_no_leidos++;
        }
      })
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
      toast.present ();
    }else{
      let toast = await this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom',
        cssClass: "toast-error"
      });
      toast.present();
    }
  }

  logout() {
    this.database.borrarDatosUsuario ();
    this.database.cerrarSesion ();
    this.firebaseAuthentication.signOut ();
    this.nav.navigateRoot (["login"]);
  }

  openCeradent(){
    // this.nav.setRoot('CeradentPage');
  }

  openInicio(){
    this.nav.navigateRoot ('dashboard');
  }

  openDoctor(){
    this.nav.navigateRoot (['doctor', this.codigoUsuario, 'null']);
  }

  openCliente(){
    this.nav.navigateRoot (['cliente', this.codigoUsuario]);
  }

  openGerente(){
    this.nav.navigateRoot(['gerente', this.codigoUsuario ]);
  }

  openAcerca(){
    this.nav.navigateRoot('acerca');
  }

  openClientes () {
    this.nav.navigateRoot ('clientes');
  }

  openDoctores () {
    this.nav.navigateRoot ('doctores');
  }

  open_mensajes () {
    this.nav.navigateRoot (['mensajes', this.codigoUsuario]);
  }

  openTienda() {
    this.nav.navigateRoot (['tienda', this.codigoUsuario, this.permisos.rol]);
  }

  openHistorial () {
    this.nav.navigateRoot (['compras-historial', this.codigoUsuario, this.permisos.rol]);
  }

  open_reservas () {
   this.nav.navigateRoot (['reservas', this.codigoUsuario, this.permisos.rol]);
  }

  close_menu () {
    this.menu_controller.close ('menu');
  }
}
