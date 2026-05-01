import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  servicios = [
    {
      img: 'assets/asesor-financiero.png',
      titulo: 'Consulta de factura',
      descripcion: 'Descarga tu factura en línea'
    },
    {
      img: 'assets/operador.png',
      titulo: 'PQRS',
      descripcion: 'Envía peticiones y reclamos'
    },
    {
      img: 'assets/panel-de-administrador.png',
      titulo: 'Calidad del agua',
      descripcion: 'Control y monitoreo'
    }
  ];

  noticias = [
    { img: 'assets/Blog-1-2.jpg', titulo: 'Protección de quebradas' },
    { img: 'assets/sloopng-pont-du-gard-533365.jpg', titulo: 'Uso eficiente del agua' },
    { img: 'assets/Blog-4.jpg', titulo: 'Subsidios disponibles' }
  ];
}