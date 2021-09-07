import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IServicio } from 'src/model/IServicio';
import { MasInfoComponent } from './mas-info/mas-info.component';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss'],
})
export class ServicioComponent implements OnInit {

  servicio: IServicio[] = []

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.cargarServicios()
  }

  cargarServicios(){
    let servicios = JSON.parse(window.localStorage.getItem("servicios"))
    let usuarios = JSON.parse(window.localStorage.getItem("users"))     
    servicios.map((itemServicios)=>{
      usuarios.map((itemUsuarios)=>{
        if(itemServicios.idUsuario === itemUsuarios.idUsuario){
          this.servicio.push(itemServicios)
        }
      })      
    })    
  }

  async masInformacion(s) {
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
        'estado': s.estado
      }
    });
    return await modal.present();
  }
  
}
