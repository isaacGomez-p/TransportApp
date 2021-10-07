import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { IServicio } from 'src/model/IServicio';
import { MasInfoComponent } from '../../usuario/servicio/mas-info/mas-info.component';
import { Coordenadas } from './mis-servicios/en-ruta/model/coordenadas.interface';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss'],
})
export class ServicioComponent implements OnInit {

  servicios: IServicio[] = []

  coordenadas: Coordenadas[] = [
    {
      lat: 4.8201714386873755, 
      lng: -74.35533787558882
    },
    {
      lat: 4.828955444542574,
      lng: -74.35463279599456
    },
    {
      lat: 4.823583280019521,
      lng: -74.35654291912465
    }    
  ]

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() {
    this.cargarServiciosDisponibles()    
  }
  
  cargarServiciosDisponibles(){
    let data = JSON.parse(window.localStorage.getItem("servicios"))
    data.map((itemServicios) => {
      if(itemServicios.estado === 1){
        this.servicios.push(itemServicios)
      }
    })    
  }

  async detalles(s) {
    s.rol = 1;
    window.localStorage.setItem("servicioInfo", JSON.stringify(s));
    this.router.navigateByUrl('/infoServicio');
    /*const modal = await this.modalController.create({
      component: MasInfoComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'fechaOrigen': s.fechaOrigen,
        'fechaDestino': s.fechaDestino,
        'valor': s.valor,
        'descripcion': s.descripcion,
        'lugarDestino': s.lugarDestino,
        'lugarOrigen': s.lugarOrigen,
        'idConductor': s.idConductor,
        'estado': s.estado,
        'rol': 1
      }
    });
    return await modal.present();*/
  }  

}
