import { Component, OnInit, ViewChild } from '@angular/core';

import { NavController, LoadingController, ToastController, IonSlides, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { HistorialClientePage } from '../../modals/historial-cliente/historial-cliente.page';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  public loading:any;
  subscription:Subscription;
  subscription1:Subscription;
  letras=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','x','y','z'];
  public showLeftButton: boolean;
  public showRightButton: boolean;
  letraSeleccionada="";
  listaClientes: any [] = [];
  listaClientes_bak: any [] = [];

  slideOpts: any = {
    slidesPerView: 6
  }

  segment_value: string = 'dni';
  dni_search: string = '';
  constructor(
    public navCtrl: NavController, 
    public database: DatabaseService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController) {
  }

  ngOnInit(){
    this.showLeftButton = false;
    this.showRightButton = this.letras.length > 6;    
  }

  public async filterData(letra: string) {
    // Handle what to do when a category is selected
    this.letraSeleccionada=letra;
    console.log(this.letraSeleccionada);
    this.loading = await this.loadingCtrl.create({
      message: "Procesando informacion..."            
    })
    this.loading.present().then(()=>{
      this.subscription=this.database.getClientesLetra (letra).subscribe(data=>{
        console.log (data);
        //this.carga=true;        
        this.listaClientes=data;
        this.listaClientes_bak=data;
        this.loading.dismiss();
      });    
    });
  }

  // Method executed when the slides are changed
  public async slideChanged()  {
    let currentIndex = await this.slides.getActiveIndex ();
    this.showLeftButton = currentIndex !== 0;
    this.showRightButton = currentIndex !== Math.ceil (await this.slides.length () / 6);
  }

  // Method that shows the next slide
  public slideNext(): void {
      this.slides.slideNext();
  }

  // Method that shows the previous slide
  public slidePrev(): void {
      this.slides.slidePrev();
  }

  /*onSubmit(){
    const value=this.phoneForm.value;
    this.loading = this.loadingCtrl.create({
      content: "Procesando informacion..."           
    })
    this.loading.present().then(_=>{
      this.database.existeTelefonoRegistrado("+51"+value.phoneNumber).then(data=>{
        if (data && data.iscliente){
          this.historialCliente=this.database.getHistorialClienteTotal(data.usuario);
          this.subscription=this.database.getHistorialClienteTotal(data.usuario).subscribe(_=>{          
            //this.database.getClienteObservable(data.usuario);          
            this.subscription1=this.database.getClienteObservableConPlacas(data.usuario).subscribe(info=>{
              this.datosCliente=info;                       
              this.loading.dismiss().then(()=>{            
                this.presentToast("Usuario encontrado con el numero de celular +51"+ value.phoneNumber,"exito");
              }) 
            })          
          })
        }else{
          this.loading.dismiss().then(()=>{ 
            this.presentToast("No hay ningun cliente registrado con el numero de telefono +51"+ value.phoneNumber,"error");
          })        
        }
      })
    });    
  }*/  

  onInput($event){
    this.listaClientes = this.listaClientes_bak;
    let q = $event.target.value;
    if (q != "") {
      this.listaClientes = this.listaClientes.filter ( item => {
        return (item.dataCliente.nombres.toLowerCase().indexOf (q.toLowerCase()) > -1) 
      });
    }   
  } 

  async seleccionarCliente (codigo:string) {
    console.log (codigo);
    this.navCtrl.navigateForward (['historial-cliente', codigo]);
  }

  async presentToast(message,type) {
    if (type=="exito"){
      let toast = await this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom',
        cssClass: "toast-success"
      });
      toast.present();
    }else{
      let toast = await this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'bottom',
        cssClass: "toast-error"
      });
      toast.present();
    }    
  }  
  
  ngOnDestroy(){
    if (this.subscription!=undefined && this.subscription!=null)
    this.subscription.unsubscribe();

    if (this.subscription1!=undefined && this.subscription1!=null)
    this.subscription1.unsubscribe();
  }

  async buscar_dni () {
    let loading = await this.loadingCtrl.create ({
      message: "Procesando informacion..."            
    });

    await loading.present ();

    this.subscription = this.database.get_clientes_by_dni (this.dni_search).subscribe ((res: any []) => {
      console.log (res);

      this.listaClientes = [];
      res.forEach ((r: any) => {
        this.listaClientes.push ({
          dataCliente: r,
          data: r
        });
      });
      this.listaClientes_bak = this.listaClientes;

      loading.dismiss();
    });
  }

  segmentChanged (event: any) {
    this.listaClientes = [];
    this.listaClientes_bak = [];
  }
}
