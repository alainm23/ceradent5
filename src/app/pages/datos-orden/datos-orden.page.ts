import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-datos-orden',
  templateUrl: './datos-orden.page.html',
  styleUrls: ['./datos-orden.page.scss'],
})
export class DatosOrdenPage implements OnInit {
  item_01: boolean = true;
  item_02: boolean = false;
  item_03: boolean = false;
  item_04: boolean = false;
  item_05: boolean = false;
  form: FormGroup;
  codigo: string;
  rol: string;
  paciente: any

  tomografia_volumetrica_derecho: Map <string, boolean> = new Map <string, boolean> ();
  tomografia_volumetrica_izq: Map <string, boolean> = new Map <string, boolean> ();

  radio_intra_d_01: Map <string, boolean> = new Map <string, boolean> ();
  radio_intra_d_02: Map <string, boolean> = new Map <string, boolean> ();
  radio_intra_i_01: Map <string, boolean> = new Map <string, boolean> ();
  radio_intra_i_02: Map <string, boolean> = new Map <string, boolean> ();
  constructor (
    private navController: NavController,
    private route: ActivatedRoute,
    private database: DatabaseService,
    private loadingCtrl: LoadingController) { }

  ngOnInit () {
    this.codigo = this.route.snapshot.paramMap.get ('codigo');
    this.paciente = JSON.parse (this.route.snapshot.paramMap.get ('paciente'));
    this.rol = this.route.snapshot.paramMap.get ('rol');

    console.log (this.paciente);

    this.form = new FormGroup({
      senos_maxilares: new FormControl (false),
      atm_b_abierta_b_cerrada: new FormControl (false),
      area_patologica: new FormControl (false),
      localizacion_conductos: new FormControl (false),
      tomografía_volumetrica_observacion: new FormControl (''),

      panoramica_sola: new FormControl (false),
      panoramica_con_informe: new FormControl (false),
      panoramica_informe_cd: new FormControl (false),
      panoramica_periapicales_bite_wing: new FormControl (false),
      radio_ext_orl_atm_b_abierta_b_cerrada: new FormControl (false),
      carpal: new FormControl (false),
      carpal_con_studio: new FormControl (false),
      posterio_anterior: new FormControl (false),
      radio_ext_orl_senos_maxilares: new FormControl (false),
      radio_ext_orl_otros: new FormControl (false),
      radio_ext_orl_otros_texto: new FormControl (''),
      lineal_estricta: new FormControl (false),
      lateral_7ms: new FormControl (false),

      radio_intra_tipo: new FormControl ('', [Validators.required]),
      bitewing_morales_der: new FormControl (false),
      bitewing_morales_izq: new FormControl (false),
      bitewing_premolares_der: new FormControl (false),
      bitewing_premolares_izq: new FormControl (false),
      oclusal_superior: new FormControl (false),
      oclusal_inferior: new FormControl (false),

      ricketts: new FormControl (false),
      tweed: new FormControl (false),
      u_s_p_0_unicamp: new FormControl (false),
      steiner: new FormControl (false),
      roth_jarabak: new FormControl (false),
      bjork_jarabak: new FormControl (false),
      mc_namara: new FormControl (false),
      schwarz: new FormControl (false),
      adenoides: new FormControl (false),
      down: new FormControl (false),
      vto_de_ricketts: new FormControl (false),
      vto_de_ricketts_anios: new FormControl (),

      fotos_extra_intraorales_standar: new FormControl (false),
      fotos_extra_intraorales_profesional: new FormControl (false),
      duplicado_estudio_texto: new FormControl (''),
      doc_completa_orto_pack: new FormControl ('')
    });
  }

  ver_item (value: number) {
    if (value === 1) {
      this.item_01 = !this.item_01;
    } else if (value === 2) {
      this.item_02 = !this.item_02;
    } else if (value === 3) {
      this.item_03 = !this.item_03;
    } else if (value === 4) {
      this.item_04 = !this.item_04;
    } else {
      this.item_05 = !this.item_05;
    }
  }

  select (map: Map <string, boolean>, value: string) {
    if (map.has (value)) {
      map.set (value, !map.get (value));
    } else {
      map.set (value, true);
    }
  }

  back () {
    this.navController.back ();
  }

  checkbox_change (event: any, control: string) {
    if (control === 'bitewing_morales') {
      if (event === false) {
        this.form.controls ['bitewing_morales_der'].setValue (false);
        this.form.controls ['bitewing_morales_izq'].setValue (false);
      }
    } else if (control === 'bitewing_premolares') {
      if (event === false) {
        this.form.controls ['bitewing_premolares_der'].setValue (false);
        this.form.controls ['bitewing_premolares_izq'].setValue (false);
      }
    }
  }

  async submit () {
    let loading = await this.loadingCtrl.create({
      message: "Procesando informacion..."            
    });

    loading.present ();
    
    // console.log (this.form.value);

    console.log (this.radio_intra_d_01);
    console.log (this.radio_intra_d_02);
    console.log (this.radio_intra_i_01);
    console.log (this.radio_intra_i_02);
    console.log (this.tomografia_volumetrica_derecho);
    console.log (this.tomografia_volumetrica_izq);    

    let request: any = {
      id: this.database.createId (),
      cliente_dni: this.paciente.dni,
      cliente_id: this.paciente.id,
      cliente_nombres: this.paciente.nombres + ' ' + this.paciente.apellidos,
      doctor_id: this.codigo,
      servicio: this.form.value,
      fecha_registrada: new Date ().toISOString (),
      servicio_extras: {
        radio_intra_d_01: Array.from (this.radio_intra_d_01.keys ()),
        radio_intra_d_02: Array.from (this.radio_intra_d_02.keys ()),
        radio_intra_i_01: Array.from (this.radio_intra_i_01.keys ()),
        radio_intra_i_02: Array.from (this.radio_intra_i_02.keys ()),
        tomografia_volumetrica_derecho: Array.from (this.tomografia_volumetrica_derecho.keys ()),
        tomografia_volumetrica_izq: Array.from (this.tomografia_volumetrica_izq.keys ())
      }
    };

    console.log (request);

    this.database.add_reserva (request).then (() => {
      loading.dismiss ();
      this.navController.navigateForward (['gracias', this.codigo, this.rol]);
    }).catch ((error: any) => {
      loading.dismiss ();
    });
  }
}
