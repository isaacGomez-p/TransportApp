import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciosService } from 'src/app/services/servicios/servicios.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-servicio-entregado',
  templateUrl: './servicio-entregado.component.html',
  styleUrls: ['./servicio-entregado.component.scss'],
})
export class ServicioEntregadoComponent implements OnInit {

  servicios: any = []

  constructor(private router: Router, 
    public alertController: AlertController,
    private serviciosService: ServiciosService,
    private usuarioService: UsuarioService) { }

  ngOnInit() {

  }

  ionViewDidEnter() {    
    this.misServicios()
  }


  misServicios(){
    this.servicios = [];
    let dataUsuario = JSON.parse(window.localStorage.getItem("user"));
    if(dataUsuario){
    //this.usuarioService.getAllUser(window.localStorage.getItem("token")).subscribe((dataUsuario)=>{
      this.serviciosService.getAll(0).subscribe((dataService)=>{
        let servicios = dataService
        if(servicios !== null){
          servicios.map((itemServicios)=>{
            if(itemServicios.idConductor === dataUsuario.idUsuario && itemServicios.estado === 3){
              this.servicios.push(itemServicios)
            }
          })
        }
      })
    //})
    }
  /*  let usuario = JSON.parse(window.localStorage.getItem("users"))
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
    })*/
  }
}
