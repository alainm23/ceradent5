import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-datos-paciente',
  templateUrl: './datos-paciente.page.html',
  styleUrls: ['./datos-paciente.page.scss'],
})
export class DatosPacientePage implements OnInit {
  form: FormGroup;
  codigo: string; 
  constructor (private navController: NavController, private route: ActivatedRoute) { }

  ngOnInit() {
    this.codigo = this.route.snapshot.paramMap.get('codigo');

    this.form = new FormGroup({
      nombres: new FormControl("",[Validators.required]),
      dni:  new FormControl("",[Validators.required])
    });
  }

  onSubmit () {
    console.log (this.form.value);
    this.navController.navigateForward (['datos-orden', this.codigo, JSON.stringify (this.form.value)]);
  }
}
