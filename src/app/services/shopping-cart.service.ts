import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  public productos: any [];
  private persona: any;
  private rol: string; 
  constructor(public toastCtrl: ToastController) {
    this.productos = [];
  }

  insertar_producto (item: any) {
    let encontrado: boolean = false;
    for (let _item of this.productos) {
      if (_item.id === item.id && _item.tipo_id === item.tipo_id && 
          _item.carac_id === item.carac_id && _item.medida_id === item.medida_id) {
            /*
            _item.cantidad++;

            if (_item.cantidad >= _item.stock) {
              _item.cantidad = _item.stock;
            }
            */

            encontrado = true;
      }
    }

    if (encontrado === false) {
      this.productos.push (item);
      this.presentToast ('El producto fue agregado al carrito');
    } else {
      this.presentToast ('El producto ya se encuentra en su carrito de compras');
    }
  }
  
  async presentToast (message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }

  removeItem (item: any) {
    let index = this.productos.indexOf (item);
    console.log (index);

    this.productos.splice(index, 1);
  }

  setPersona (item: any) {
    this.persona = item;
  }

  setRol (rol: string) {
    this.rol = rol;
  }

  getPersona () {
    return this.persona;
  }

  getRol () {
    return this.rol;
  }
}
