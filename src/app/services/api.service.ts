import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  ROOT_API: string = "https://ceradentperu.com/api";
  
  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }

  getEspecialidades () {
    const url = this.ROOT_API + '/especialidades';
    return this.http.get (url);
  }

  getMarcas () {
    const url = this.ROOT_API + '/marcas';
    return this.http.get (url);
  }

  getProductosByEspecialidad (id: number) {
    const url = this.ROOT_API + '/mostrar-producto-por-especialidad/' + id;
    return this.http.get (url);
  }

  getProductosDetalle (id: number) {
    const url = this.ROOT_API + '/detalle-del-producto/' + id;
    return this.http.get (url);
  }

  procesarpago (request: any) {
    const url = this.ROOT_API + '/procesarpago';
    return this.http.post (url, request);
  }

  finalizarcompra (request: any) {
    const url = this.ROOT_API + '/finalizar-compra';
    return this.http.post (url, request);
  }

  historialventas (id: string) {
    const url = this.ROOT_API + '/historial-ventas/' + id;
    return this.http.get (url);
  }

  reporte_de_la_venta (id: string) {
    const url = this.ROOT_API + '/reporte-de-la-venta/' + id;
    return this.http.get (url);
  }
}
