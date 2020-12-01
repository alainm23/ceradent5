import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-compras-historial',
  templateUrl: './compras-historial.page.html',
  styleUrls: ['./compras-historial.page.scss'],
})
export class ComprasHistorialPage implements OnInit {
  historial: any [];
  is_loading: boolean = true;

  codigo: string;
  rol: string;
  constructor(public navCtrl: NavController, 
              private api: ApiService,
              private route: ActivatedRoute, 
              public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.codigo = this.route.snapshot.paramMap.get('codigo');
    this.rol = this.route.snapshot.paramMap.get('rol');
    
    this.api.historialventas (this.codigo).subscribe ((response: any) => {
      console.log (response);
      this.historial = response.historial;
      this.is_loading = false;
    }, error => {
      console.log (error);
    });
  }

  verDetalle (item: any) {
    this.navCtrl.navigateForward (['CompraDetallePage', item.id]);
  }

  goShop () {
    this.navCtrl.navigateRoot (['tienda', this.codigo, this.rol]);
  }
}
