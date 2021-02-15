import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { ImagenViewPage } from '../../modals/imagen-view/imagen-view.page';
import { IonicImageLoaderComponent } from 'ionic-image-loader-v5';

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
  imagenes: any [] = [];
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

  async share (item: any) {
    let loading = await this.loadingCtrl.create({
      message: "Cargando...",      
    });

    loading.present ();

    let message: string = 'Placa Ceradent - ' + item.dataServicio.nombre;
    let imagenes_urls: any [] = [];
    for (let index = 0; index < this.imagenes.length; index++) {
      imagenes_urls.push (await this.convertToDataURLviaCanvas (this.imagenes [index], "image/jpeg"));
    }
    
    this.socialSharing.share (message, '', imagenes_urls, '').then (() => {
      loading.dismiss ();
    }).catch ((error: any) => {
      loading.dismiss ();
    });
  }

  convertToDataURLviaCanvas (url, outputFormat){
    return new Promise ((resolve, reject) => {
      var img = new Image ();
      img.crossOrigin = '*';
      img.onload = () => {
        let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        resolve(dataURL);
        canvas = null;
      };
      img.src = url;
    });
  }

  onImageLoad (img: IonicImageLoaderComponent, index: number) {
    this.imagenes [index] = img.src;
  }

  async visualizar (index: number) {
    console.log (this.imagenes);
    const modal = await this.modalController.create({
      component: ImagenViewPage,
      componentProps: {
        imagen: this.imagenes [index]
      }
    });

    return await modal.present ();
  }

  back () {
    this.navCtrl.back ();
  }
}
