import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ServiciosService } from 'src/app/services/servicios/servicios.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-mas-info',
  templateUrl: './mas-info.component.html',
  styleUrls: ['./mas-info.component.scss'],
})
export class MasInfoComponent implements OnInit {

  fechaOrigen: string;
  fechaDestino: string;
  valor: string;
  descripcion: string;
  lugarDestino: string;
  lugarOrigen: string;
  estado: number;
  rol: number;
  idServicio: number;
  prueba: boolean = false;

  //Datos Conductor
  nombreConductor: String;
  telefonoConductor: String;
  correoConductor: String;

  constructor(private alertCtrl: AlertController, 
    private toastController: ToastController, 
    private router: Router,
    private usuarioService: UsuarioService,
    private servicioService: ServiciosService) {
  }

  ngOnInit() {
    let servicio = JSON.parse(window.localStorage.getItem("servicioInfo"));
    this.fechaOrigen = servicio.fechaOrigen;
    this.fechaDestino = servicio.fechaDestino;
    this.lugarDestino = servicio.lugarDestino;
    this.lugarOrigen = servicio.lugarOrigen;
    this.descripcion = servicio.descripcion;
    this.idServicio = servicio.idServicio;
    this.estado = servicio.estado;    
    this.valor = servicio.valor;
    window.localStorage.removeItem("servicioInfo")
    this.datosUsuario();
    if(this.estado !== 1){
      this.datosConductor(servicio.idConductor)
    }
  }

  datosConductor(conductor){
    let usuarios = JSON.parse(window.localStorage.getItem("users"))
    usuarios.map((item)=>{
      if(item.idUsuario === conductor){
        this.nombreConductor = item.nombre
        this.telefonoConductor = item.telefono
        this.correoConductor = item.correo
      }
    })
  }


  datosUsuario() {
    let data = JSON.parse(window.localStorage.getItem("user"));
    if(data){
    //this.usuarioService.getAllUser(window.localStorage.getItem("token")).subscribe((data)=>{
      this.rol = data.rol
    //});
    }
    /*let usuario = JSON.parse(window.localStorage.getItem("users"));
    usuario.map((item) => {
      if (item.token === window.localStorage.getItem("token")) {
        this.rol = Number.parseInt(item.rol)
      }
    })*/
  }

  asignarServicio() {
    let data = JSON.parse(window.localStorage.getItem("user"));
    if(data){
    //this.usuarioService.getAllUser(window.localStorage.getItem("token")).subscribe(data => {
      this.servicioService.getAll(0).subscribe((dataService) => {
        let servicios = dataService;
        servicios.map((itemServicios) => {
          if (itemServicios.idServicio === this.idServicio) {
            itemServicios.idConductor = data.idUsuario
            itemServicios.estado = 2
            console.log("servicio: " + JSON.stringify(itemServicios))
            this.servicioService.putServicio(itemServicios, itemServicios.idServicio).subscribe(res => {
              this.toastConfirmacion("Asignado correctamente.", "success");
              this.router.navigateByUrl('/misServicios');
            })            
          }
        })
      })
    //})
    }

   /* let usuarios = JSON.parse(window.localStorage.getItem("users"));
    usuarios.map((item) => {
      //Busca el usuario que correspone al token
      if (item.token === window.localStorage.getItem("token")) {
        let servicios = JSON.parse(window.localStorage.getItem("servicios"));
        servicios.map((itemServicios) => {
          if (itemServicios.idServicio === this.idServicio) {
            itemServicios.idConductor = item.idUsuario
            itemServicios.estado = 2
            this.toastConfirmacion("Asignado correctamente.", "success");
            this.router.navigateByUrl('/misServicios');
          }
        })
        window.localStorage.setItem("servicios", JSON.stringify(servicios))
      }
    })
  */
  }

  //Metodo de confirmacion para asignar el servicio
  async openAlert() {
    const alert = await this.alertCtrl.create({
      header: '¿Desea aceptar el servicio? \n\n',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: (data) => {
            try {
              this.asignarServicio();
            } catch (Exception) {
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async toastConfirmacion(mensaje, colorT) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: colorT,
      duration: 2000
    });
    toast.present();
  }

}
