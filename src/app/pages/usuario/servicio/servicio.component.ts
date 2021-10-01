import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  opcion: String = '2';

  rol: String = "";

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() {    
    
  }

  ionViewDidEnter() {
    this.cargarServicios()
  }
  
  ionViewDidChange(){

  }

  cargarServicios() {
    this.servicio = [];
    let servicios = JSON.parse(window.localStorage.getItem("servicios"))
    let usuarios = JSON.parse(window.localStorage.getItem("users"))

    usuarios.map((item)=>{
      if(item.token === window.localStorage.getItem("token")){
        this.rol = item.rol;
        if (servicios !== null) {
          servicios.map((itemServicios) => {
              if (itemServicios.idUsuario === item.idUsuario && itemServicios.estado+"" === this.opcion) {
                this.servicio.push(itemServicios)                        
              }
            })
        }
      }
    })
    console.log("opp"+this.opcion);
    //Agrega los servicios que corresponden al usuario
    
  }

  async masInformacion(s) {
    s.rol = 2;
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
        "rol": 2
      }
    });
    return await modal.present();*/
  }

  filtro(){
    this.cargarServicios();
  }
}
