import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-servicio-entregado',
  templateUrl: './servicio-entregado.component.html',
  styleUrls: ['./servicio-entregado.component.scss'],
})
export class ServicioEntregadoComponent implements OnInit {

  servicios: any = []

  constructor(private router: Router, public alertController: AlertController) { }

  ngOnInit() {

  }

  ionViewDidEnter() {    
    this.misServicios()
  }


  misServicios(){
    this.servicios = [];
    let usuario = JSON.parse(window.localStorage.getItem("users"))
    usuario.map((item)=>{
      if(item.token === window.localStorage.getItem("token")){
        let servicios = JSON.parse(window.localStorage.getItem("servicios"))
        if(servicios !== null){
          servicios.map((itemServicios)=>{
            if(itemServicios.idConductor === item.idUsuario && itemServicios.estado === 3){
              this.servicios.push(itemServicios)
            }
          })
        }
      }
    })
  }
}
