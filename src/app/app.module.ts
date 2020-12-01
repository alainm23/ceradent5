import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

// Utils
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { IonicImageLoaderModule } from 'ionic-image-loader-v5';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { OrderModule } from 'ngx-order-pipe';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { HttpClientModule } from '@angular/common/http';
import { ApoderadosPageModule } from './modals/apoderados/apoderados.module';
import { HistorialPagoPageModule } from './modals/historial-pago/historial-pago.module';
import { HistorialClientePageModule } from './modals/historial-cliente/historial-cliente.module';
import { SeleccionarPacientePageModule } from './modals/seleccionar-paciente/seleccionar-paciente.module';
import { ImagenViewPageModule } from './modals/imagen-view/imagen-view.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot (),
    AppRoutingModule,
    AngularFireModule.initializeApp (environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot (),
    IonicImageLoaderModule,
    OrderModule,
    AngularFireStorageModule,
    HttpClientModule,
    ApoderadosPageModule,
    HistorialPagoPageModule,
    SeleccionarPacientePageModule,
    // HistorialClientePageModule,
    ImagenViewPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    WebView,
    OneSignal,
    CallNumber,
    ScreenOrientation,
    SocialSharing,
    FirebaseAuthentication,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
