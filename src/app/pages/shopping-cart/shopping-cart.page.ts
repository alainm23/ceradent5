import { Component, OnInit } from '@angular/core';

import { NavController, AlertController } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {
  rol: string;
  persona: any;
  precio_total: number;
  puntos_usados: number;
  datos_ok: boolean = false;
  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public shopping_cart: ShoppingCartService) {
  }

  ngOnInit() {
    this.precio_total = 0;
    this.puntos_usados = 0;
    this.rol = this.shopping_cart.getRol ();
    this.persona = this.shopping_cart.getPersona ();

    console.log (this.rol);
    console.log (this.persona);
    console.log (this.shopping_cart.productos);

    this.updatePrecioTotal ();
  }

  updateCantidad (item: any, type: string) {
    if (type === 'sum') {
      item.cantidad++;

      if (item.tipo_compra === 'directo') {
        if (item.cantidad >= item.stock) {
          item.cantidad = item.stock;
        }
      }
    } else {
      item.cantidad--;

      if (item.cantidad <= 1) {
        item.cantidad = 1;
      }
    }

    this.updatePrecioTotal ();
  }

  getImage (img: string) {
    return 'http://ceradent.schoolmasterapp.com/img/' + img;
  }

  async removeItem (item: any) {
    const confirm = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Esta seguro que desea eliminar este producto de su carrito de compras?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.shopping_cart.removeItem (item);
            this.updatePrecioTotal ();

            if (this.shopping_cart.productos.length <= 0) {
              this.navCtrl.pop ();
            }
          }
        }
      ]
    });

    confirm.present();
  }

  updatePrecioTotal () {
    this.precio_total = 0;
    this.puntos_usados = 0;
    for (let item of this.shopping_cart.productos) {
      if (item.tipo_pago === 'directo') {
        this.precio_total = this.precio_total + (item.precio * item.cantidad); 
      } else {
        this.puntos_usados = this.puntos_usados + (item.puntos * item.cantidad);
        this.precio_total = this.precio_total + ((item.precio * item.cantidad) - (item.puntos * item.cantidad));
      }
    }

    if (this.rol === 'Doctor') {
      if (this.puntos_usados > this.persona.puntaje) {
        this.datos_ok = false;
      } else {
        this.datos_ok = true;
      }
    } else {
      this.datos_ok = true;
    }
  }

  goFormularioPago () {
    let array_final: any = [];
    
    for (let item of this.shopping_cart.productos) {
      let tipo_compra = 1;
      if (item.tipo_compra === 'pedido') {
        tipo_compra = 2;
      }

      let pago: number = 0;
      if (item.tipo_pago === 'puntos') {
        pago = 1
      }

      let obj = {
        "cantidad": item.cantidad,
        "pago": pago,
        "tipo_compra": tipo_compra,
        "tabla": item.tabla,
        "id": item.id
      };

      array_final.push (obj);
    }

    let persona = this.persona;
    if (persona === undefined) {
      persona = 'null';
    }

    this.navCtrl.navigateForward (['formulario-pago',
      JSON.stringify (array_final),
      this.precio_total,
      JSON.stringify (persona),
      this.puntos_usados,
      this.rol
    ]);
  }

  goBack () {
    this.navCtrl.back ();
  }
}
