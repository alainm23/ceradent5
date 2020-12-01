import { Component, OnInit } from '@angular/core';

import { NavController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.page.html',
  styleUrls: ['./tienda.page.scss'],
})
export class TiendaPage implements OnInit {
  especialidades: any [];
  marcas: any [];
  productos: any [];
  productos_backup: any [];
  especialidad: any;
  marcas_selected: any;
  IMG_URL: string;
  is_loading: boolean = true;
  
  subscribe_01: any;
  subscribe_02: any;
  subscribe_03: any;
  subscribe_04: any;

  rol: string;
  constructor(public navCtrl: NavController, 
              private api: ApiService,
              private database: DatabaseService,
              public shopping_cart: ShoppingCartService,
              private route: ActivatedRoute,
              public loadingCtrl: LoadingController) {
  }

  async ngOnInit () {
    this.is_loading = true;
    this.shopping_cart.setRol (this.route.snapshot.paramMap.get ('rol'));
    this.rol = this.route.snapshot.paramMap.get ('rol');
    this.IMG_URL = "http://ceradent.schoolmasterapp.com/img/";
    this.marcas_selected = 0;
    
    const loading = await this.loadingCtrl.create({
      message: "Cargando..."           
    })
    
    loading.present().then(async () => {
      if (this.route.snapshot.paramMap.get ('rol') === 'Doctor') {
        this.subscribe_01 = await this.database.getDoctorObservable(this.route.snapshot.paramMap.get ('codigo')).subscribe ((response: any) => {
          
          response.id = this.route.snapshot.paramMap.get ('codigo');
          this.shopping_cart.setPersona (response);
          console.log (response);
          loading.dismiss ();
        });
      } else if (this.route.snapshot.paramMap.get ('rol') === 'Cliente') {
        this.subscribe_01 = await this.database.getClienteObservable(this.route.snapshot.paramMap.get ('codigo')).subscribe ((response: any) => {
          response.id = this.route.snapshot.paramMap.get ('codigo');
          this.shopping_cart.setPersona (response);
          console.log (response);
          loading.dismiss ();
        });
      } else {
        loading.dismiss ();
      }

      this.subscribe_02 =await this.api.getEspecialidades ().subscribe ((response: any) => {
        this.especialidades = response.especialidades;
        this.especialidad = response.especialidades [0];
        
        this.onSelectChange (this.especialidad);
      });
    
      this.subscribe_03 = await this.api.getMarcas ().subscribe ((response: any) => {
        this.marcas = response.marcas;
      });
    });
  }

  ngOnDestroy () {
    if (this.subscribe_01 !== undefined && this.subscribe_01 !== null) {
      this.subscribe_01.unsubscribe();
    }
    
    if (this.subscribe_02 !== undefined && this.subscribe_02 !== null) {
      this.subscribe_02.unsubscribe();
    }

    if (this.subscribe_03 !== undefined && this.subscribe_03 !== null) {
      this.subscribe_03.unsubscribe();
    }

    if (this.subscribe_04 !== undefined && this.subscribe_04 !== null) {
      this.subscribe_04.unsubscribe();
    }
  }

  verProducto (item: any) {
    this.navCtrl.navigateForward (['producto', JSON.stringify (item), JSON.stringify (this.especialidad), this.rol]);
  }

  goCarritoCompras () {
    this.navCtrl.navigateForward (['shopping-cart']);
  }

  onSelectChange (item: any) {
    this.subscribe_04 = this.api.getProductosByEspecialidad (item.id).subscribe ((response: any) => {
      this.productos = response.productos;
      this.productos_backup = response.productos;
      console.log (response);

      this.is_loading = false;
    }, error => {
      this.is_loading = false;
      console.log ('getProductosByEspecialidad', error)
    });
  }

  getImage (img: string) {
    return this.IMG_URL + img;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.productos = this.productos_backup;

    // set val to the value of the searchbar
    const val = ev.target.value;

    if (val && val.trim() != '') {
      this.productos = this.productos.filter ((item: any) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  changeMarcas (ev: any) {
    this.productos = this.productos_backup;
    if (ev.length > 0) {
      if (ev.includes (0) === false) {
        this.productos = this.productos.filter ((item: any) => {
          for (let marca of item.producto_marcas) {
            return ev.includes (Number(marca.marca_id));
          }
  
          return false;
        });
      } else {
        this.marcas_selected = 0;
      }
    } else {
      this.marcas_selected = 0;
    }
  }
}
