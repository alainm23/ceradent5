import { Component, OnInit } from '@angular/core';

import { NavController, LoadingController, AlertController } from '@ionic/angular';

import { FormControl, FormGroup, Validators} from "@angular/forms";
import { ApiService } from 'src/app/services/api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { CulqiService } from 'src/app/services/culqi.service';
import { EventsService } from 'src/app/services/events.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formulario-pago',
  templateUrl: './formulario-pago.page.html',
  styleUrls: ['./formulario-pago.page.scss'],
})
export class FormularioPagoPage implements OnInit {
  tipo_de_pago: string;
  data: any [];
  precio_total: number;
  usuario: any;
  form: FormGroup;
  puntos_usados: number;
  rol: string;
  show_alert: boolean = false;
  constructor(public navCtrl: NavController, 
              private api: ApiService,
              public loadingCtrl: LoadingController,
              private database: DatabaseService,
              private shopping_cart: ShoppingCartService,
              private culqi: CulqiService,
              private events: EventsService,
              private route: ActivatedRoute,
              public alertCtrl: AlertController) {
    this.form = new FormGroup ({
      tipo_de_pago: new FormControl (1, Validators.required),
      direccion: new FormControl ('', Validators.required),
      observacion: new FormControl (''),
      terms_conditions: new FormControl (false, Validators.compose([ Validators.required, Validators.pattern('true')]))
    });
  }

  ngOnInit () {
    this.precio_total = parseFloat (this.route.snapshot.paramMap.get ('precio_total'));
    this.data = JSON.parse (this.route.snapshot.paramMap.get ('data'));
    this.usuario = this.route.snapshot.paramMap.get ('persona');
    this.puntos_usados = parseFloat (this.route.snapshot.paramMap.get ('puntos_usados'));
    this.rol = this.route.snapshot.paramMap.get ('rol');

    if (this.precio_total < 100) {
      this.show_alert = true;
      this.precio_total = this.precio_total + 5;
    }

    console.log('precio_total', this.precio_total);
    console.log('data', this.data);
    console.log('rol', this.rol);
    console.log('usuario', this.usuario);
    console.log('puntos_usados', this.puntos_usados);

    this.culqi.initCulqi ();

    this.events.getObservable ().subscribe (async (token: string) => {
      const loading = await this.loadingCtrl.create({
        message: "Cargando..."           
      })
      
      loading.present().then(async () => {
        const request: any = {
          token: token,
          monto: this.precio_total * 100,
          correo: "alainhuntt@gmail.com",
          moneda: "PEN",
          descripcion: "Pago ceradent",
          usuario: this.usuario.nombres + ' ' + this.usuario.apellidos,
          elementos_carrito: JSON.stringify(this.data)
        };
  
        this.api.procesarpago (request).subscribe ((response: any) => {
          console.log (response);
  
          if (response.estado === 'stock') {
            loading.dismiss ();
          } else if (response.estado === 'success') {
            if (response.respuesta.outcome.type === 'venta_exitosa') {
              const value = this.form.value;
              let observaciones: string = "";
              if (value.observacion === '' || value.observacion === null || value.observacion === undefined) {
                observaciones = " ";
              } else {
                observaciones = value.observacion;
              }

              const request_2: any = {
                usuario: this.usuario.id,
                nombres: this.usuario.nombres,
                apellidos: this.usuario.apellidos,
                dni: this.usuario.dni,
                correo: this.usuario.email,
                telefono: this.usuario.telefono,
                elementos_carrito: JSON.stringify(this.data),
                idcarrito: response.idcarrito,
                tipo_de_pago: value.tipo_de_pago,
                observaciones: observaciones,
                direccion: value.direccion,
                transaction_id: response.respuesta.id
              };
              
              console.log (request_2);
  
              this.api.finalizarcompra (request_2).subscribe ((res: any) => {
                console.log ('finalizarcompra', res);
                if (res.estado === 'success') {
                  console.log ('Todo esta ok');
                  this.shopping_cart.productos = [];
                  
                  if (this.rol === 'Doctor') {
                    if (this.puntos_usados > 0) {
                      this.database.reducirPuntos (this.usuario.id, this.puntos_usados)
                      .then ((response) => {
                        this.database.updateDireccionDoctor (this.usuario.id, value.direccion)
                        .then (async () => {
                          const alert = await this.alertCtrl.create({
                            header: 'Felicitaciones!!!',
                            subHeader: 'Tu pago fue procesado con éxito',
                            message: 'Nos comunicaremos con usted para coordinar la fecha y hora de envío.',
                            buttons: ['Entendido']
                          });
                          
                          alert.present();
    
                          this.verHistorial ();
                          loading.dismiss ();
                        }, error => {
                          loading.dismiss ();
                        });
                      }, error => {
                        loading.dismiss ();
                        console.log ('Error reducirPuntos', error);
                      });
                    } else {
                      this.database.updateDireccionDoctor (this.usuario.id, value.direccion)
                        .then (async () => {
                          const alert = await this.alertCtrl.create({
                            header: 'Felicitaciones!!!',
                            subHeader: 'Tu pago fue procesado con éxito',
                            message: 'Nos comunicaremos con usted para coordinar la fecha y hora de envío.',
                            buttons: ['Entendido']
                          });
                          
                          alert.present();
    
                          this.verHistorial ();
                          loading.dismiss ();
                        }, error => {
                          loading.dismiss ();
                        });
                    }
                  } else {
                    this.database.updateDireccionCliente (this.usuario.id, value.direccion)
                      .then (async () => {
                        loading.dismiss ();

                        const alert = await this.alertCtrl.create({
                          header: 'Venta exitosa',
                          subHeader: 'Su proceson de compra fue exitoso!',
                          buttons: ['OK']
                        });
                        alert.present();
                        this.verHistorial ();
                      }, error => {
                        loading.dismiss ();
                      });
                  }
                } else {
                  loading.dismiss ();
                  console.log ('Error');
                }
              }, error => {
                loading.dismiss ();
                console.log ('Error', error);
              });
            } else {
              loading.dismiss ();
            }
          } else {
            loading.dismiss ();
          }
        }, error => {
          loading.dismiss ();
          console.log ('Error', error);
        });
      });
    });
  }

  async openCulqi () {
    const value = this.form.value;

    if (value.tipo_de_pago === 1) {
      this.culqi.cfgFormulario ('asdfghj', this.precio_total * 100);
      this.culqi.openCulqi ();
    } else {
      const loading = await this.loadingCtrl.create({
        message: "Cargando..."           
      })
      
      loading.present().then(async () => {
        let observaciones: string = "";
        if (value.observacion === '' || value.observacion === null || value.observacion === undefined) {
          observaciones = " ";
        } else {
          observaciones = value.observacion;
        }

        const request: any = {
          usuario: this.usuario.id,
          nombres: this.usuario.nombres,
          apellidos: this.usuario.apellidos,
          dni: this.usuario.dni,
          correo: this.usuario.email,
          telefono: this.usuario.telefono,
          elementos_carrito: JSON.stringify(this.data),
          tipo_de_pago: value.tipo_de_pago,
          observaciones: observaciones,
          direccion: value.direccion
        }
        
        console.log (request);
  
        this.api.finalizarcompra (request).subscribe ((res: any) => {
          console.log (res);
          loading.dismiss ();

          if (res.estado === 'success') {
            this.shopping_cart.productos = [];
            if (this.rol === 'Doctor') {
              if (this.puntos_usados > 0) {
                this.database.reducirPuntos (this.usuario.id, this.puntos_usados)
                .then ((response) => {
                  console.log ('Puntos reducidos todo ok');
                  this.database.updateDireccionDoctor (this.usuario.id, value.direccion)
                  .then (async () => {
                    const alert = await this.alertCtrl.create({
                      header: 'Felicitaciones!!!',
                      subHeader: 'Su pedido a sido procesado con éxito',
                      message: 'Nos comunicaremos con usted para coordinar la fecha y hora de envío.',
                      buttons: ['Entendido']
                    });
                    
                    alert.present();
    
                    this.verHistorial ();
                    loading.dismiss ();
                  }, error => {
                    loading.dismiss ();
                  });
                }, error => {
                  loading.dismiss ();
                  console.log ('Error reducirPuntos', error);
                });
              } else {
                this.database.updateDireccionDoctor (this.usuario.id, value.direccion)
                  .then (async () => {
                    const alert = await this.alertCtrl.create({
                      header: 'Venta exitosa',
                      subHeader: 'Su pedido fue procesado con exito',
                      buttons: ['OK']
                    });
                    
                    alert.present();
    
                    this.verHistorial ();
                    loading.dismiss ();
                  }, error => {
                    loading.dismiss ();
                  });
              }
            } else {
              this.database.updateDireccionCliente (this.usuario.id, value.direccion)
                .then (async () => {
                  const alert = await this.alertCtrl.create({
                    header: 'Felicitaciones!!!',
                    subHeader: 'Su pedido a sido procesado con éxito',
                    message: 'Nos comunicaremos con usted para coordinar la fecha y hora de envío.',
                    buttons: ['Entendido']
                  });
    
                  alert.present();
                  this.verHistorial ();
                  loading.dismiss ();
                }, error => {
                  loading.dismiss ();
                });
            }
          } else {
            console.log ('Todo esta mal');
            loading.dismiss ();
          }
        }, error => {
          loading.dismiss ();
          console.log ('Error', error);
        });
      });
    }
  }

  ngOnDestroy () {
    this.events.getObservable ().unsubscribe ()
  }

  checkForm (val: any) {
  }

  verHistorial () {
    this.navCtrl.navigateRoot (['compras-historialPage', this.usuario.id]);
  }

  openURL () {
    window.open('https://www.culqi.com/', '_system');
  }

  openTerminos () {
    window.open('https://www.ceradentperu.com/terminos-condiciones', '_system');
  }
}
