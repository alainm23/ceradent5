import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {
  codigo: string = '';
  items: any [] = [];
  constructor (
    private route: ActivatedRoute,
    private database: DatabaseService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController) {}

  async ngOnInit () {
    this.codigo = this.route.snapshot.paramMap.get ("codigo");

    let loading = await this.loadingCtrl.create({
      message: "Procesando informacion..."            
    });

    loading.present ();

    this.database.get_reservas_por_doctor (this.codigo).subscribe ((res: any []) => {
      loading.dismiss ();
      console.log (res);
      this.items = res;
    });
  }

  registrar () {
    this.navCtrl.navigateForward (['agregar-editar-reserva', this.codigo, 'null']);
  }

  ver (item: any) {
    this.navCtrl.navigateForward (['agregar-editar-reserva', this.codigo, item.id]);
  }
}
