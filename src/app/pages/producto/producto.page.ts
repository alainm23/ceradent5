import { Component, OnInit, ViewChild } from '@angular/core';

// Servicios
import { NavController, IonContent, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  item: any;
  segment_value: string;
  especialidad: any;

  icon_arrow_1: string = "caret-forward";
  icon_arrow_2: string = "caret-forward";
  ver_terminos: boolean = false;
  item_detalle: any;
  visible_op_01: boolean = false;
  visible_op_02: boolean = false;
  visible_op_03: boolean = false;
  ver_detalles: boolean = false;
  IMG_URL: string;
  GAL_URL: string;
  is_loading: boolean = true;

  tipo_value: any;
  carac_value: any;
  media_value: any;
  stock: number;
  cantidad: number;
  puntos_tope: number;
  tipo_compra: string;
  producto_final: any = {
    tabla: '',
    id: ''
  }

  es_primero: boolean = true;

  caractetisticas: any [];
  medidas: any [];
  rol: string;
  constructor(public navCtrl: NavController, 
              public shopping_cart: ShoppingCartService,
              private api: ApiService,
              private route: ActivatedRoute,
              public modalCtrl: ModalController) {
  }
  
  async ngOnInit () {
    this.is_loading = true;
    this.item = {
      id: ''
    };

    this.IMG_URL = 'http://ceradent.schoolmasterapp.com/img/';
    this.GAL_URL = 'http://ceradent.schoolmasterapp.com/galeria/';
    this.cantidad = 1;
    this.tipo_compra = 'directo';

    this.item = JSON.parse (this.route.snapshot.paramMap.get ('item'));
    this.especialidad = JSON.parse (this.route.snapshot.paramMap.get ('especialidad'));
    this.rol = this.route.snapshot.paramMap.get ('rol');

    this.api.getProductosDetalle (this.item.id).subscribe ((response: any) => {
      console.log (response);

      this.item_detalle = response.detalle;

      if (response.detalle.tipos.length > 0) {
        this.visible_op_01 = true;
        
        if (response.idtipopm !== 0) {
          for (let tipo of response.detalle.tipos) {
            if (tipo.id === response.idtipopm) {
              this.tipo_value = tipo;

              if (response.idcaracteristicapm !== 0) {
                for (let carac of this.tipo_value.carac) {
                  if (carac.id === response.idcaracteristicapm) {
                    this.carac_value = carac;

                    if (response.idmedidadpm !== 0) {
                      for (let media of this.carac_value.medida) {
                        if (media.id === response.idmedidadpm) {
                          this.media_value = media;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        this.producto_final.tabla = 'producto';
        this.producto_final.id = this.item_detalle.id;
        this.visible_op_01 = false;
        this.stock = this.item_detalle.cantidad;
        this.puntos_tope = this.item_detalle.puntos;

        if (this.stock === 0) {
          this.tipo_compra = 'pedido';
        } else {
          this.tipo_compra = 'directo';
        }
      }

      // setTimeout(() => {  
      //   setTimeout(() => {
      //     this.content.resize ();
      //   }, 1 * 1000);
      // }, 1 * 1000);
    
      this.is_loading = false;
    });
  }

  buy (type: string) {
    let detalle: string = "";
    let tipo: string = "";
    let carac: string = "";
    let medida: string = "";
    
    if (this.tipo_value !== null && this.tipo_value !== undefined) {
      detalle = this.tipo_value.nombre_tipo;
      tipo = this.tipo_value.id;
    }

    if (this.carac_value !== null && this.carac_value !== undefined) {
      detalle = detalle + ' - ' + this.carac_value.nombre_carac;
      carac = this.carac_value.id;
    }

    if (this.media_value !== null && this.media_value !== undefined) {
      detalle = detalle + ' - ' + this.media_value.nombre_medida;
      medida = this.media_value.id;
    }

    this.shopping_cart.insertar_producto ({
      producto_id: this.item.id,
      nombre: this.item_detalle.nombre,
      imagen: this.item.img,
      detalle: detalle,
      cantidad: this.cantidad,
      stock: this.stock,
      puntos: this.puntos_tope,
      precio: this.item_detalle.precio_minimo,
      tipo_id: tipo,
      carac_id: carac,
      medida_id: medida,
      tipo_pago: 'directo',
      tabla: this.producto_final.tabla,
      id: this.producto_final.id,
      tipo_compra: this.tipo_compra
    });
  }

  varificarTipo (event: any) {
    console.log (event);
    this.caractetisticas = event.carac;

    if (this.caractetisticas.length > 0) {
      this.visible_op_02 = true;
      this.visible_op_03 = false;
      
      if (this.es_primero === false) {
        this.carac_value = this.caractetisticas [0];
      }
    } else {
      this.visible_op_02 = false;
      this.stock = event.cantidad;
      this.item_detalle.precio_minimo = event.precio; 
      this.puntos_tope = event.tope;
      this.producto_final.tabla = 'tipo';
      this.producto_final.id = event.id;

      if (this.stock === 0) {
        this.tipo_compra = 'pedido';
      } else {
        this.tipo_compra = 'directo';
      }

      if (this.stock > 0) {
        this.cantidad = 1;
      }

      this.es_primero = false;
    }
  }

  varificarCarac (event: any) {
    console.log ('tercero', this.es_primero);
    console.log (event);

    this.medidas = event.medida;

    if (this.medidas.length > 0) {
      this.visible_op_03 = true;

      if (this.es_primero === false) {
        this.media_value = this.medidas [0];
      }
    } else {
      this.item_detalle.precio_minimo = event.precio; 
      this.stock = event.cantidad;
      this.visible_op_03 = false;
      this.puntos_tope = event.tope;

      this.producto_final.tabla = 'carac';
      this.producto_final.id = event.id;

      if (this.stock === 0) {
        this.tipo_compra = 'pedido';
      } else {
        this.tipo_compra = 'directo';
      }

      if (this.stock > 0) {
        this.cantidad = 1;
      }

      this.es_primero = false;
    }
  }

  varificarMedidas (event: any) {
    this.item_detalle.precio_minimo = event.precio; 
    this.stock = event.cantidad;
    this.puntos_tope = event.tope;

    this.producto_final.tabla = 'medida';
    this.producto_final.id = event.id;

    if (this.stock === 0) {
      this.tipo_compra = 'pedido';
    } else {
      this.tipo_compra = 'directo';
    }

    if (this.stock > 0) {
      this.cantidad = 1;
    }

    this.es_primero = false;
  }

  goCarritoCompras () {
    this.navCtrl.navigateForward (['shopping-cart']);
  }

  getDescriptionFormat (html: string) {
    if (html === null || html === undefined) {
      return "";
    }

    return html.replace ('h1', 'h2');
  }

  getImageGaleria (img: string) {
    return this.GAL_URL + img;
  }

  getImage (img: string) {
    return this.IMG_URL + img;
  }

  get_stock (c: number) {
    if (c === null || c === undefined) {
      return 'Stock no disponible';
    }

    return c;
  }

  updateCant (type: string) {
    if (type === 'sum') {
      this.cantidad++;

      if (this.tipo_compra === 'directo') {
        if (this.cantidad >= this.stock) {
          this.cantidad = this.stock;
        }
      }
    } else {
      this.cantidad--;
      if (this.cantidad <= 1) {
        this.cantidad = 1;
      } 
    }
  }

  ver_detalle_button () {
    if (this.ver_detalles === true) {
      this.ver_detalles = false;
      this.icon_arrow_1 = "caret-forward"; 
    } else {
      this.ver_detalles = true;
      this.icon_arrow_1 = "caret-down";
    }
  }

  ver_terminos_button () {
    if (this.ver_terminos === true) {
      this.ver_terminos = false;
      this.icon_arrow_2 = "caret-forward";
    } else {
      this.ver_terminos = true;
      this.icon_arrow_2 = "caret-down";
    }
  }
}
