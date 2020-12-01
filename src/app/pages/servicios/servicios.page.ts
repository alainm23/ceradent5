import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { ImagenViewPage } from '../../modals/imagen-view/imagen-view.page';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {
  placa:string;
  subscription:Subscription;
  listaServicios: any;
  imagenesServicios: Map<string, Array<any | null>> = new Map<string, Array<any | null>>();
  constructor(
    public navCtrl: NavController, 
    public database: DatabaseService,
    public loadingCtrl: LoadingController,
    private socialSharing: SocialSharing,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private storage: AngularFireStorage) {
  }

  async ngOnInit(){
    if (this.route.snapshot.paramMap.get('placa')!=undefined && this.route.snapshot.paramMap.get('placa')!=null){
      this.placa=this.route.snapshot.paramMap.get('placa');
      let loading = await this.loadingCtrl.create({
        message: "Cargando...",      
      })
      
      loading.present().then(()=>{
        this.subscription=this.database.getServiciosPlaca(this.placa).subscribe((data: any)=>{
          console.log (data);

          this.listaServicios = data; 
          loading.dismiss().then(()=>{
            data.forEach (servicio=>{
              this.imagenesServicios.set (servicio.data.servicio, []);
              let partes = servicio.data.imagenes.split ("|", 10);
              for (let pa of partes){
                if (pa!=""){
                  const ref = this.storage.ref (pa+"-photo.jpg");
                  let actuales= this.imagenesServicios.get (servicio.data.servicio);
                  actuales.push(ref.getDownloadURL ());
                  this.imagenesServicios.set (servicio.data.servicio, actuales);
                }
              }          
            })
          });          
        });
      })
    }else{
      this.navCtrl.navigateRoot ("dashboard");
    }
  }

  share (item: any) {
    let message = 'Placa Ceradent - ' + item.nombre;
    this.socialSharing.share (message, '', item.data.imagenes_url, '');
  }

  onImageLoad (img: any, data: any) {
    data.data.imagenes_url = img;
  }

  async visualizar (item: any) {
    console.log (item.data.imagenes_url);
    const modal = await this.modalController.create({
      component: ImagenViewPage,
      componentProps: {
        imagen: item.data.imagenes_url._src
      }
    });

    return await modal.present ();
  }
}
