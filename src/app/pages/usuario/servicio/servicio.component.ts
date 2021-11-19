import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ServiciosService } from 'src/app/services/servicios/servicios.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { IServicio } from 'src/model/IServicio';
import { MasInfoComponent } from './mas-info/mas-info.component';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss'],
})
export class ServicioComponent implements OnInit {

  servicio: IServicio[] = []
  opcion: String = '1';
  rol: String = "";

  serviciosFiltro: any = [];

  constructor(private modalController: ModalController, 
    private router: Router, 
    public alertController: AlertController,
    private usuarioService: UsuarioService,
    private serviciosService: ServiciosService) { }

  ngOnInit() {    
    
  }

  ionViewDidEnter() {
    this.cargarServicios()
  }
  
  ionViewDidChange(){

  }

  cargarServicios() {
    this.servicio = [];
    //let servicios = JSON.parse(window.localStorage.getItem("servicios"))
    //let usuarios = JSON.parse(window.localStorage.getItem("users"))

    this.usuarioService.getAllUser(window.localStorage.getItem("token")).subscribe((data)=>{
      this.rol = data[0].rol + "";
      this.serviciosService.getAll(data[0].idUsuario).subscribe((dataService)=>{
        if(this.opcion === '6'){
          this.servicio = dataService;
        }else{
          this.serviciosFiltro = dataService;
          this.serviciosFiltro.map((item)=>{
            if(item.estado+"" === this.opcion)  {
              this.servicio.push(item)
            }
          })
        }                
      })
    })

    /*usuarios.map((item)=>{
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
    })*/

    console.log("opp"+this.opcion);
    //Agrega los servicios que corresponden al usuario
    
  }

  async alertCancelarServicio(s) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación',
      message: '¿Desea eliminar?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.cambiarEstadoServicio(s, 4);
          }
        }
      ]
    });
    await alert.present();
  }

  async alertPonerEnEsperaServicio(s) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación',
      message: '¿Desea poner en espera el servicio?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.cambiarEstadoServicio(s, 5);
          }
        }
      ]
    });
    await alert.present();
  }

  async alertHabilitarServicio(s) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación',
      message: '¿Desea habilitar el servicio?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.cambiarEstadoServicio(s, 1);
          }
        }
      ]
    });
    await alert.present();
  }

  cambiarEstadoServicio(s, estado){
    s.estado = estado;
    console.log(" - -- - " + JSON.stringify(s))
    this.serviciosService.putServicio(s, s.idServicio).subscribe((data)=>{

    })
    /*this.servicio.map((i)=>{      
      if(i.idServicio === s.idServicio){                
        i.estado = estado;
      }
    })    
    window.localStorage.setItem("servicios", JSON.stringify(this.servicio));*/
    this.cargarServicios();
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
