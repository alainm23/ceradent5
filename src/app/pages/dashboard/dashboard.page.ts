import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  isCliente:boolean = false;
  isDoctor:boolean = false;
  isGerente:boolean = false;
  codigoUsuario:string;
  auxiliar:string;

  list: any [] = [];
  constructor(
    public navCtrl: NavController,
    public database: DatabaseService,
    public events: EventsService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
  }

  ngOnInit () {
    this.events.get_user_login ().subscribe (() => {
      this.cargar ();
    });

    this.cargar ();
  }

  cargar () {
    if (this.database.apple_test === true) {
      this.database.estaLogueado ().then (async (data)=>{
        if (!data) this.navCtrl.navigateRoot("login");
        else{
          let loading = await this.loadingCtrl.create({
            message: "Cargando..."
          });

          loading.present ().then(()=>{
                this.database.existeTelefonoRegistradoObservable("+51984780642").subscribe(dataUsuario=>{
                  if (dataUsuario){
                    //verificamos que tenga roles
                    loading.dismiss ().then (_=> {
                      this.codigoUsuario = dataUsuario.usuario;
                      this.isDoctor = dataUsuario.isdoctor;
                      this.isCliente = dataUsuario.iscliente;
                      this.isGerente = dataUsuario.isgerente;
                    })
                  }else{
                    loading.dismiss().then(async _=>{
                      let alert = await this.alertCtrl.create({
                        header: "Opssss!",
                        subHeader: "No encontramos información relacionada al celular ",//+telefono,
                        message: "Si usted esta registrado en el sistema de CERADENT, por favor comuniquese con ellos y verifique si su numero de celular es el correcto.",
                        buttons: [
                          {
                            text: "Entendido",
                            role: "cancelar",
                            handler: () => {
                              this.navCtrl.navigateRoot ("login");
                            }
                          }
                        ]
                      });

                      await alert.present ();
                    })
                  }
                })
          })
        }
      });
    } else {
      this.database.estaLogueado ().then (async (data) => {
        if (!data) {
          this.navCtrl.navigateRoot ("login");
        } else {
          let load = await this.loadingCtrl.create({
            message: "Cargando..."
          });

          await load.present ();

          this.database.traerDatosUsuarioLocal ().then (telefono => {
            console.log ('Telefono: ' + telefono);
            if (telefono != null && telefono != undefined) {
              this.database.existeTelefonoRegistradoObservable (telefono).subscribe (async (dataUsuario: any) => {
                if (dataUsuario) {
                  console.log ('dataUsuario', dataUsuario);
                  load.dismiss ();

                  //verificamos que tenga roles
                  this.codigoUsuario = dataUsuario.usuario;
                  this.isDoctor = dataUsuario.isdoctor;
                  this.isCliente = dataUsuario.iscliente;
                  this.isGerente = dataUsuario.isgerente;

                  let alert = await this.alertCtrl.create ({
                    header: 'Permisos',
                    message: 'Doctor: ' + dataUsuario.isdoctor + 'Cliente: ' + dataUsuario.iscliente + 'Gerente: ' + dataUsuario.isgerente
                  });

                  await alert.present ();
                } else {
                  load.dismiss().then(async _=>{
                    let alert = await this.alertCtrl.create ({
                      header: "Opssss!",
                      backdropDismiss: false,
                      subHeader: "No encontramos información relacionada al celular "+telefono,
                      message: "Si usted esta registrado en el sistema de CERADENT, por favor comuniquese con ellos y verifique si su numero de celular es el correcto.",
                      buttons: [
                        {
                          text: "Entendido",
                          role: "cancelar",
                          handler: () => {
                            this.navCtrl.navigateRoot ("login");
                          }
                        }
                      ]
                    });

                    await alert.present ();
                  })
                }
              })
            } else {
              load.dismiss ().then(async _=>{
                console.log('debe cerrar sesion porque no hay codigo')
                //this.database.cerrarSesion();
                let alert = await this.alertCtrl.create({
                  header: "Opssss!",
                  backdropDismiss: false,
                  subHeader: "No se guardo tu numero de celular",
                  message: "Si usted esta registrado en el sistema de CERADENT, por favor comuniquese con ellos y verifique si su numero de celular es el correcto.",
                  buttons: [
                    {
                      text: "Entendido",
                      role: "cancelar",
                      handler: () => {
                        this.navCtrl.navigateRoot ("login");
                      }
                    }
                  ]
                });

                await alert.present ();
              })
            }
          });
        }
      });
    }
  }

  navegarDoctor(){
    this.navCtrl.navigateRoot(['doctor', this.codigoUsuario, 'null']);
  }

  navegarCliente(){
    this.navCtrl.navigateRoot (['cliente', this.codigoUsuario]);
  }

  navegarGerencia(){
    this.navCtrl.navigateRoot (['gerente', this.codigoUsuario]);
  }

  async buscar () {
    let loading = await this.loadingCtrl.create({
      message: "Cargando..."
    });

    loading.present ();   

    let u = this.database.get_Telefonos_Usuarios ().subscribe ((res: any []) => {
      u.unsubscribe ();

      this.list = res;
      loading.dismiss ();
      console.log (this.list);
    });
  }

  limpiar_db () {
    const wordsPerLine = Math.ceil(this.list.length / 20)
    const result = [[], [], [], [], [],
                    [], [], [], [], [],
                    [], [], [], [], [],
                    [], [], [], [], []]

    for (let line = 0; line < 20; line++) {
      for (let i = 0; i < wordsPerLine; i++) {
        const value = this.list[i + line * wordsPerLine]
        if (!value) continue //avoid adding "undefined" values
        result[line].push(value)
      }
    }

    console.log (result);

    result.forEach ((list) => {
      this.database.limpiar_tel (list).then (() => {
        console.log ('finalizado')
      }).catch ((error: any) => {
        console.log (error);
      });
    });
  }
}
