import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-gracias',
  templateUrl: './gracias.page.html',
  styleUrls: ['./gracias.page.scss'],
})
export class GraciasPage implements OnInit {
  codigo: string;
  rol: string;
  constructor (private navController: NavController, private route: ActivatedRoute) { }

  ngOnInit() {
    this.codigo = this.route.snapshot.paramMap.get ("codigo");
    this.rol = this.route.snapshot.paramMap.get ("rol");
  }

  back () {
    this.navController.navigateBack (['reservas', this.codigo, this.rol]);
  }
}
