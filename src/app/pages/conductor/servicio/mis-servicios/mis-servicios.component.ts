import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mis-servicios',
  templateUrl: './mis-servicios.component.html',
  styleUrls: ['./mis-servicios.component.scss'],
})
export class MisServiciosComponent implements OnInit {

  servicios: any = []

  constructor() { }

  ngOnInit() {
    this.misServicios()
  }

  misServicios(){
    let usuario = JSON.parse(window.localStorage.getItem("users"))
    usuario.map((item)=>{
      if(item.token === window.localStorage.getItem("token")){
        let servicios = JSON.parse(window.localStorage.getItem("servicios"))
        if(servicios !== null){
          servicios.map((itemServicios)=>{
            if(itemServicios.idConductor === item.idUsuario){
              this.servicios.push(itemServicios)
            }
          })
        }
      }
    })
  }

  detalles(servicio){

  }

}
