import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mis-servicios',
  templateUrl: './mis-servicios.component.html',
  styleUrls: ['./mis-servicios.component.scss'],
})
export class MisServiciosComponent implements OnInit {

  servicios: any = []

  constructor(private router: Router, public alertController: AlertController) { }

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

  navigate(){
    this.router.navigateByUrl('/en-ruta');
  }

  async entrega(servicio) {    
    console.log("antes - " + servicio.estado)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmando entrega',
      subHeader: this.horaLocalCO().toString(),
      message: '¿Desea confirmar en este momento la entrega?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',          
        }, {
          text: 'Si',
          handler: () => {
            this.confirmar(servicio)
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  horaLocalCO(): Date {
    let HoraInicio = new Date();
    HoraInicio.setUTCFullYear(HoraInicio.getFullYear());
    HoraInicio.setUTCMonth(HoraInicio.getMonth());
    HoraInicio.setUTCDate(HoraInicio.getUTCDay());
    HoraInicio.setUTCHours(HoraInicio.getUTCHours());
    HoraInicio.setUTCMinutes(HoraInicio.getUTCMinutes());
    HoraInicio.setUTCSeconds(HoraInicio.getUTCSeconds());
    return HoraInicio;
  }

  confirmar(s){
    console.log("entro - " + s.estado)
    let servicio = JSON.parse(window.localStorage.getItem("servicios"));
    servicio.map((item)=>{
      if(item.idServicio === s.idServicio){
        item.estado = 3;
        console.log(" si ")
      }
    })
    window.localStorage.setItem("servicios", JSON.stringify(servicio));
  }

}
