import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IServicio } from 'src/model/IServicio';
import { MasInfoComponent } from '../../usuario/servicio/mas-info/mas-info.component';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss'],
})
export class ServicioComponent implements OnInit {

  servicios: IServicio[] = []

  constructor(private modalController: ModalController) { }

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
    const modal = await this.modalController.create({
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
    return await modal.present();
  }  

}
