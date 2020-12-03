import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'doctor/:codigo/:origen',
    loadChildren: () => import('./pages/doctor/doctor.module').then( m => m.DoctorPageModule)
  },
  {
    path: 'servicios/:placa',
    loadChildren: () => import('./pages/servicios/servicios.module').then( m => m.ServiciosPageModule)
  },
  {
    path: 'compras-historial/:codigo/:rol',
    loadChildren: () => import('./pages/compras-historial/compras-historial.module').then( m => m.ComprasHistorialPageModule)
  },
  {
    path: 'acerca',
    loadChildren: () => import('./pages/acerca/acerca.module').then( m => m.AcercaPageModule)
  },
  {
    path: 'cliente/:codigo',
    loadChildren: () => import('./pages/cliente/cliente.module').then( m => m.ClientePageModule)
  },
  {
    path: 'gerente/:codigo',
    loadChildren: () => import('./pages/gerente/gerente.module').then( m => m.GerentePageModule)
  },
  {
    path: 'apoderados',
    loadChildren: () => import('./modals/apoderados/apoderados.module').then( m => m.ApoderadosPageModule)
  },
  {
    path: 'doctores',
    loadChildren: () => import('./pages/doctores/doctores.module').then( m => m.DoctoresPageModule)
  },
  {
    path: 'reporte-diario/:sucursal',
    loadChildren: () => import('./pages/reporte-diario/reporte-diario.module').then( m => m.ReporteDiarioPageModule)
  },
  {
    path: 'historial-pago',
    loadChildren: () => import('./modals/historial-pago/historial-pago.module').then( m => m.HistorialPagoPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'historial-cliente/:cliente',
    loadChildren: () => import('./modals/historial-cliente/historial-cliente.module').then( m => m.HistorialClientePageModule)
  },
  {
    path: 'tienda/:codigo/:rol',
    loadChildren: () => import('./pages/tienda/tienda.module').then( m => m.TiendaPageModule)
  },
  {
    path: 'producto/:item/:especialidad/:rol',
    loadChildren: () => import('./pages/producto/producto.module').then( m => m.ProductoPageModule)
  },
  {
    path: 'shopping-cart',
    loadChildren: () => import('./pages/shopping-cart/shopping-cart.module').then( m => m.ShoppingCartPageModule)
  },
  { 
    path: 'formulario-pago/:data/:precio_total/:usuario/:puntos_usados/:rol',
    loadChildren: () => import('./pages/formulario-pago/formulario-pago.module').then( m => m.FormularioPagoPageModule)
  },
  {
    path: 'agregar-editar-reserva/:codigo/:reserva_id',
    loadChildren: () => import('./pages/agregar-editar-reserva/agregar-editar-reserva.module').then( m => m.AgregarEditarReservaPageModule)
  },
  {
    path: 'reservas/:codigo/:rol',
    loadChildren: () => import('./pages/reservas/reservas.module').then( m => m.ReservasPageModule)
  },
  {
    path: 'seleccionar-paciente',
    loadChildren: () => import('./modals/seleccionar-paciente/seleccionar-paciente.module').then( m => m.SeleccionarPacientePageModule)
  },
  {
    path: 'imagen-view',
    loadChildren: () => import('./modals/imagen-view/imagen-view.module').then( m => m.ImagenViewPageModule)
  },
  {
    path: 'range',
    loadChildren: () => import('./popovers/range/range.module').then( m => m.RangePageModule)
  },  {
    path: 'datos-paciente',
    loadChildren: () => import('./datos-paciente/datos-paciente.module').then( m => m.DatosPacientePageModule)
  },
  {
    path: 'datos-orden',
    loadChildren: () => import('./datos-orden/datos-orden.module').then( m => m.DatosOrdenPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
