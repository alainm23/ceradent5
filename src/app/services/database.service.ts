import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

// Services
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
// import { combineLatest } from 'rxjs/observable/combineLatest';

import { first, map } from 'rxjs/operators';
import { of, combineLatest } from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  usuario: Observable<any>;
  apple_test: boolean = false;
  constructor(
    private db: AngularFirestore,
    // public events: Events,
    private afAuth: AngularFireAuth,
    private storage: Storage,
    private fb: FirebaseApp,
    ) {
      this.db.collection ('Tipo_ingreso').doc ('valor').valueChanges ().subscribe ((valor: any) => {
        this.apple_test = valor.valor;
      });
  }

  createId () {
    return this.db.createId ();
  }

  /*INICIO funciones para guardar localmente la informacion*/
  guardarDatosUsuarioLocal(telefono:string){
    return this.storage.set ('telefonousuario',telefono);
  }

  iniciarSesionEmail (email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword (email, password);
  }

  traerDatosUsuarioLocal(){
    return this.storage.get('telefonousuario');
  }

  borrarDatosUsuario(){
    this.storage.clear();
  }
  /*FIN funciones para guardar localmente la informacion*/

  /*INICIO funciones para la autentificacion*/
  iniciarSesionAnonimo (){
    return this.afAuth.signInAnonymously ();
  }

  async cerrarSesion(): Promise<any> {
    await this.afAuth.signOut ();
  }

  async estaLogueado() {
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  estaLogueadoObservable(){
    return this.afAuth.authState;
  }
  /*FIN funciones para la autentificacion*/

  async existeTelefonoRegistrado(telefono:string):Promise<any>{
    const doc = await this.db.collection('Telefonos_Usuarios').doc(telefono).valueChanges().pipe(first()).toPromise()
    if (doc) {
        return doc;
    } else {
        return false
    }
  }

  existeTelefonoRegistradoObservable(telefono:string):Observable<any>{
    return this.db.collection('Telefonos_Usuarios').doc(telefono).valueChanges();
  }

  getDoctorObservable(doctor):any{
    return this.db.collection('Doctores').doc(doctor).valueChanges();
  }

  getClienteObservable(cliente):any{
    return this.db.collection('Clientes').doc(cliente).valueChanges();
  }

  async addCliente (data: any) {
    let batch = this.db.firestore.batch ();

    batch.set (this.db.collection ('Clientes').doc (data.id).ref, data);
    batch.set (this.db.collection ('Telefonos_Usuarios').doc (data.dni).ref, {id: data.dni});

    return await batch.commit ();
  }

  is_valid_dni (dni: string) {
    return this.db.collection ('Telefonos_Usuarios').doc (dni).valueChanges ().pipe(first()).toPromise();
  }

  updateDireccionDoctor (doctor: string, direccion: string) {
    return this.db.collection('Doctores').doc(doctor).update ({
      direccion: direccion
    });
  }

  getDoctorEstatic(doctor):Promise<any>{
    return this.db.collection('Doctores').doc(doctor).valueChanges().pipe(first()).toPromise()
  }

  getClienteEstatic(cliente):Promise<any>{
    return this.db.collection('Clientes').doc(cliente).valueChanges().pipe(first()).toPromise()
  }

  updateDireccionCliente (cliente: string, direccion: string) {
    return this.db.collection ('Clientes').doc (cliente).update ({
      'direccion': direccion
    });
  }

  getAdministradorObservable(gerente):any{
    return this.db.collection('Administradores').doc(gerente).valueChanges();
  }

  getPlaca(placa: string):any{
    return this.db.collection('Placas').doc(placa).valueChanges();
  }

  getHistorialCliente(cliente:string, fecha:string){
    const collection= this.db.collection('Clientes_Placas').doc(cliente).collection('Placas',ref=>ref.where('fecha','>=',fecha));
    //const doc =  this.db.collection('Telefonos_Usuarios').doc(telefono).valueChanges().pipe(first()).toPromise()
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            return this.getPlaca(data.placa).pipe(map(dataPlaca=> Object.assign({},{data, dataPlaca})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return combineLatest(of([]));
    })
  }

  getPlacasMenor(cliente:string, fecha:string):Observable<any>{
    const collection= this.db.collection('Menores_Tutor').doc(cliente).collection('Menores');
    //const doc =  this.db.collection('Telefonos_Usuarios').doc(telefono).valueChanges().pipe(first()).toPromise()
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length > 0) {
        return refReferencias.map(refReferencia => {
          const dataMenor:any = refReferencia.payload.doc.data();
          //console.log(data);
          let collectionPlacasMenor = this.db.collection('Clientes_Placas').doc(dataMenor.usuario).collection('Placas',ref=>ref.where('fecha','>=',fecha));
          return collectionPlacasMenor.snapshotChanges().pipe(map(refPlacas=>{
            if (refPlacas.length>0){
              return refPlacas.map(refPlaca=>{
                const data:any=refPlaca.payload.doc.data();
                //console.log(dataPlacaRef);
                return this.getPlaca(data.placa).pipe(map(dataPlaca=> Object.assign({},{data, dataPlaca})));
              })
            }
          })).mergeMap(observables =>{
            if (observables) return combineLatest(observables); else return combineLatest(of([]));
          })
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return combineLatest(of([]));
    })
  }

  getTutoresMenor(menor:string){
    const collection = this.db.collection('Tutores_Menor').doc(menor).collection('Tutores');
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            return this.getDatosClienteObservable(data.usuario).pipe(map(dataCliente=> Object.assign({},{data, dataCliente})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return of([]);
    })
  }

  getHistorialPago(placa:string){
    return this.db.collection('Placas').doc(placa).collection('Pagos').valueChanges();
  }

  getHistorialClienteTotal(cliente:string){
    const collection= this.db.collection('Clientes_Placas').doc(cliente).collection('Placas');
    //const doc =  this.db.collection('Telefonos_Usuarios').doc(telefono).valueChanges().pipe(first()).toPromise()
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            return this.getPlaca(data.placa).pipe(map(dataPlaca=> Object.assign({},{data, dataPlaca})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return of([]);
    })
  }

  getServicio(servicio){
    return this.db.collection('Servicios').doc(servicio).valueChanges();
  }

  getServiciosPlaca(placa:string){
    const collection = this.db.collection("Placas").doc(placa).collection("Servicios");
    return collection.snapshotChanges().pipe(map(refReferencias=>{
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            return this.getServicio(data.servicio).pipe(map(dataServicio=> Object.assign({},{data, dataServicio})));
        })
    })).mergeMap(observables => combineLatest(observables));
  }

  getHistorialDoctor(doctor:string, fecha:string){
    const collection= this.db.collection('Doctor_Placas').doc(doctor).collection('Placas',ref=>ref.where('fecha','>=',fecha));
    //const doc =  this.db.collection('Telefonos_Usuarios').doc(telefono).valueChanges().pipe(first()).toPromise()
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            return this.getPlaca(data.placa).pipe(map(dataPlaca=> Object.assign({},{data, dataPlaca})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return of([]);
    })
  }

  getHistorialDoctorTotal(doctor:string){
    const collection= this.db.collection('Doctor_Placas').doc(doctor).collection('Placas');
    //const doc =  this.db.collection('Telefonos_Usuarios').doc(telefono).valueChanges().pipe(first()).toPromise()
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            return this.getPlaca (data.placa).pipe(map(dataPlaca=> Object.assign({},{data, dataPlaca})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return of([]);
    })
  }

  getResumenSucursal(sucursal:string, anio:string, mes:string):any{
    return this.db.collection('Ventas_Mensuales').doc(sucursal).collection('Anios').doc(anio).collection('Meses').doc(mes).valueChanges();
  }

  getResumenSucursales(anio:string, mes:string):any{
    const collection= this.db.collection('Sucursales');
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            data.id=refReferencia.payload.doc.id;
            return this.getResumenSucursal(data.id,anio,mes).pipe(map(dataResumen=> Object.assign({},{data, dataResumen})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return of([]);
    })
  }

  getResumenServiciosPorSucursal(sucursal:string, anio:string, mes:string){
    const collection= this.db.collection('Ventas_Mensuales').doc(sucursal).collection('Anios').doc(anio).collection('Meses').doc(mes).collection('Servicios');
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            data.id=refReferencia.payload.doc.id;
            return this.getServicio(data.id).pipe(map(dataServicio=> Object.assign({},{data, dataServicio})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return of([]);
    })
  }

  getSucursales(){
    return this.db.collection('Sucursales').snapshotChanges().map(sucursales => {
      return sucursales.map(sucursal => {
        const data = sucursal.payload.doc.data();
        const id = sucursal.payload.doc.id;
        return { id, data };
      });
    })
  }

  getVentasDiariasSucursal(sucursal:string, fecha:string):Observable<any>{
    const collection = this.db.collection("Ventas_Diarias").doc(sucursal).collection("Placas").doc(fecha).collection("Placas");
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            return this.getPlaca(data.placa).pipe(map(dataPlaca=> Object.assign({},{data, dataPlaca})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return of([]);
    })
  }

  getNumeroPlacasCliente(cliente:string){
    return this.db.collection('Clientes_Placas').doc(cliente).valueChanges();
  }

  getClienteObservableConPlacas(cliente){
    //return this.db.collection('Clientes').doc(cliente).valueChanges();
    const collection= this.db.collection('Clientes').doc(cliente);
    return collection.snapshotChanges().map(refReferencia=>{
      const data:any = refReferencia.payload.data();
      data.id= refReferencia.payload.id;
      return this.getNumeroPlacasCliente(data.id).pipe(map(dataNumero=> Object.assign({},{dataNumero, data})));
    }).mergeMap(observables => combineLatest(observables));
  }

  getNumeroPlacasDoctor(doctor:string){
    return this.db.collection('Doctor_Placas').doc(doctor).valueChanges();
  }

  getDoctores () {
    const collection= this.db.collection('Doctores');
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      return refReferencias.map(refReferencia=>{
          const data:any = refReferencia.payload.doc.data();
          data.id= refReferencia.payload.doc.id;
          return this.getNumeroPlacasDoctor(data.id).pipe(map(dataNumero=> Object.assign({},{dataNumero, data})));
      })
    })).mergeMap(observables => combineLatest(observables));
  }

  async limpiar_doctores_inutiles (list: any []) {
    let batch = this.db.firestore.batch ();

    list.forEach ((data) => {
      batch.delete (this.db.collection ('Doctores').doc (data.id).ref);
      batch.delete (this.db.collection ('Doctor_Placas').doc (data.id).ref);
      batch.delete (this.db.collection ('Telefonos_Usuarios').doc (data.telefono).ref);
    });

    return await batch.commit ();
  }

  async limpiar_tel (list: any []) {
    let batch = this.db.firestore.batch ();

    list.forEach ((data) => {
      batch.delete (this.db.collection ('Telefonos_Usuarios').doc (data.id).ref);
    });

    return await batch.commit ();
  }

  get_Telefonos_Usuarios () {
    let collection = this.db.collection ('Telefonos_Usuarios', ref => ref.where ('isadmin', '==', false).where ('isadminprincipal', '==', false).where ('iscliente', '==', true).where ('isdoctor', '==', false).where ('isgerente', '==', false));

    return collection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, data };
      }))
    );
  }

  get_t () {
    return this.db.collection ('Telefonos_Usuarios').valueChanges ();
  }

  getDatosClienteObservable(cliente){
    return this.db.collection('Clientes').doc(cliente).valueChanges();
  }

  getClientesLetra(letra:string){
    const collection= this.db.collection('Clientes_Letra').doc(letra).collection('Clientes');
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            //data.id= refReferencia.payload.doc.id;
            return this.getDatosClienteObservable (data.usuario).pipe(map(dataCliente=> Object.assign({},{data, dataCliente})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return of([]);
    })
  }

  getClientesDNI (dni:string){
    return this.db.collection('Clientes', ref => ref.where ('dni', '==', dni)).valueChanges ();
  }

  getSaldosDiariosSucursal(fecha:string, sucursal:string){
    const collection = this.db.collection('Saldos_Diarios').doc(sucursal).collection('Saldos').doc(fecha).collection('Saldos');
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            return this.getPlaca(data.placa).pipe(map(dataPlaca=> Object.assign({},{dataPlaca, data})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return of([]);
    })
  }

  getSaldosMensualesSucursal(anio:string, mes:string, sucursal:string){
    const collection = this.db.collection('Saldos_Mensuales').doc(sucursal).collection('Saldos').doc(anio+'-'+mes).collection('Saldos');
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            return this.getPlaca(data.placa).pipe(map(dataPlaca=> Object.assign({},{dataPlaca, data})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return of([]);
    })
  };

  registrarToken(telefono:string, token:string){
    return this.db.collection('Telefonos_Usuarios').doc(telefono).update({token:token});
  }

  /*Funciones para la tienda */
  reducirPuntos (doctor: string, cant: number) {
    const doc = this.db.collection('Doctores').doc(doctor).ref;
    return this.fb.firestore ().runTransaction ((transaction: any) => {
      return transaction.get (doc).then ((item: any) => {
        const newPuntaje = item.data ().puntaje - cant;
        transaction.update (doc, { puntaje: newPuntaje })
      });
    });
  }


  get_servicios_categorias () {
    const collection = this.db.collection ('Servicios_Categorias');
    return collection.snapshotChanges().pipe(map(refReferencias=>{
      if (refReferencias.length>0){
        return refReferencias.map(refReferencia=>{
            const data:any = refReferencia.payload.doc.data();
            return this.get_servicios_por_categoria (data.id).pipe(map(servicios=> Object.assign({},{servicios, data})));
        })
      }
    })).mergeMap(observables =>{
      if (observables) return combineLatest(observables); else return of([]);
    })
  }

  get_servicios_por_categoria (id: string) {
    return this.db.collection ('Servicios', ref => ref.where ('categoria_id', '==', id)).snapshotChanges ().pipe (
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  add_reserva (data: any) {
    return this.db.collection ('Doctor_Reservas').doc (data.id).set (data);
  }

  update_reserva (data: any) {
    return this.db.collection ('Doctor_Reservas').doc (data.id).update (data);
  }

  get_reservas_por_doctor (id: string) {
    return this.db.collection ('Doctor_Reservas', ref => ref.where ('doctor_id', '==', id)).valueChanges ();
  }

  get_reserva_by_id (id: string) {
    return this.db.collection ('Doctor_Reservas').doc (id).valueChanges ();
  }

  get_clientes_by_dni (dni: string) {
    return this.db.collection('Clientes', ref => ref.where ('dni', '==', dni)).snapshotChanges ().pipe (
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  registrar_cliente (data: any) {
    
  }

  get_mensajes_todos () {
    return this.db.collection ('Mensajes_Todos').valueChanges ();
  }

  update_mensaje_todos (id: string, data: any) {
    return this.db.collection ('Mensajes_Todos').doc (id).update (data);
  }
  
  get_historial_mensajes (doctor_id: string) {
    return this.db.collection ('Doctores').doc (doctor_id).collection ('Mensajes', ref => ref.orderBy ('fecha', 'desc')).valueChanges ();
  }

  get_historial_mensajes_todos (doctor_id: string) {
    const fooPosts = this.db.collection ('Doctores').doc (doctor_id).collection ('Mensajes', ref => ref.orderBy ('fecha', 'desc')).valueChanges ();
    const barPosts = this.db.collection ('Mensajes_Todos').valueChanges ();

    return combineLatest<any[]>(fooPosts, barPosts).pipe (
      map(arr => arr.reduce((acc, cur) => acc.concat(cur) ) ),
    );
  }

  get_historial_mensajes_todos_badge (doctor_id: string) {
    const fooPosts = this.db.collection ('Doctores').doc (doctor_id).collection ('Mensajes', ref => ref.where ('leido', '==', false)).valueChanges ();
    const barPosts = this.db.collection ('Mensajes_Todos').valueChanges ();

    return combineLatest<any[]>(fooPosts, barPosts).pipe (
      map(arr => arr.reduce((acc, cur) => acc.concat(cur) ) ),
    );
  }

  update_mensaje (doctor_id: string, mensaje_id: string, object: any) {
    return this.db.collection ('Doctores').doc (doctor_id).collection ('Mensajes').doc (mensaje_id).update (object);
  }
}
