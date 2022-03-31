import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { ServiciosService } from 'src/app/services/servicios/servicios.service';
import { IServicio } from 'src/model/IServicio';
import { Coordenadas } from '../conductor/servicio/mis-servicios/en-ruta/model/coordenadas.interface';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  intervalTime: number = 2000;

  usuario: string = "";
  cedula: string = "";
  telefono: string = "";
  correo: string = "";
  rol: string = "";

  servicios : IServicio[] = [];
  serviciosRechazados : number[] = [];

  latitudUbicacion: number;
  longitudUbicacion: number;

  estadoEspera: boolean = false;
  servicio: IServicio;
  validacion: number ;
  constructor(private menuCtrl: MenuController, 
    private appComponent: AppComponent,
    private usuarioService: UsuarioService,
    public alertController: AlertController,
    public servicioService: ServiciosService) {
    menuCtrl.enable(true, 'menuPrincipal');    
  }

  ngOnInit() {    
  }

  ionViewDidEnter(){
    console.log("entro ionViewDidEnter -- ")
    this.cargarDatos();
  }

  cargarDatos(){
    let data = JSON.parse(window.localStorage.getItem("user"));
    if(data){
    //this.usuarioService.getAllUser(window.localStorage.getItem("token")).subscribe( data => {      
      this.appComponent.usuario = data.nombre
        this.usuario = data.nombre
        this.appComponent.rol = data.rol + ""
        this.cedula = data.cedula
        this.correo = data.correo
        this.telefono = data.telefono
        if(data.rol === 1){
          this.rol = "Conductor"
          this.periodic();
        }else{ 
          this.rol = "Usuario"
        }
    //})
    }

    /*let usuarios = JSON.parse(window.localStorage.getItem("users"))
    usuarios.map((item)=>{
      if(item.token === window.localStorage.getItem("token")){
        this.appComponent.usuario = item.nombre
        this.usuario = item.nombre
        this.appComponent.rol = item.rol
        this.cedula = item.cedula
        this.correo = item.correo
        this.telefono = item.telefono
        if(item.rol === "1"){
          this.rol = "Conductor"
        }else{
          this.rol = "Usuario"
        }
        
      }
    })*/

  }

  periodic(){
    interval(this.intervalTime).subscribe(x => {
      if(this.estadoEspera === false){
        this.cargarUbicacion();
        this.servicioService.getAll(0).subscribe(data => {          
          this.servicios = data;          
          this.calcularPuntosMasCercanos();
        })
      }
    })
  }

  cargarUbicacion(){
    //this.latitudUbicacion = this.usuarioService.latitud;
    this.latitudUbicacion = 4.340810395398626
    console.log("latitu: " + this.latitudUbicacion )
    //this.longitudUbicacion = this.usuarioService.longitud;
    this.longitudUbicacion = -74.36500114878433
    console.log("longitud: " + this.longitudUbicacion )
  }

  getKilometros (lat1,lon1,lat2,lon2) : string
  {    
    var R = 6378.137; //Radio de la tierra en km
    var dLat = this.rad( lat2 - lat1 );
    var dLong = this.rad( lon2 - lon1 );
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    
    let resultado = d;
    //console.log("1 --- "+ resultado)
    //return resultado;

    return d.toFixed(3); //Retorna tres decimales
  }

  rad(x){
    return x*Math.PI/180;
  }    
  
  calcularPuntosMasCercanos(){       
    let numeros = [];    
    let lati = this.latitudUbicacion
    let long = this.longitudUbicacion

    this.servicios.map(item => {    
      if(item.estado === 1){
        if(!this.serviciosRechazados.includes(item.idServicio)){      
          console.log(" no ha rechazado " + item.idServicio)
          let destino : Coordenadas = JSON.parse(item.lugarDestino)      
          if(destino !== null ){
            let latiDestino = destino.lat
            let longDestino = destino.lng
            let distancia = Number(this.getKilometros(lati, long, latiDestino, longDestino));          
            numeros.push(
              {
                servicio: item,
                distancia: distancia
              }
            )        
          }      
        }
      }
    })

    
    if(numeros.length === 0){

    }else{          
      let aux = numeros[0].distancia;      
      numeros.map(item => {              
        if(item.distancia <= aux){          
          aux = item.distancia;
          this.servicio = item.servicio
        }
      })
      if(this.servicio !== undefined){
        this.ofrecerServicio();
      }
    }    
  }

  async ofrecerServicio() {
    this.estadoEspera = true;
    console.log("servicio - " + JSON.stringify(this.servicio))
    console.log("antes - " + this.servicio.estado)
    if(this.servicio.direccion === undefined || this.servicio.direccion === null){
      this.servicio.direccion = "Pilas modificar"
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.servicio.direccion,
      subHeader: '',
      message: '¿Desea aceptar el servicio?',
      buttons: [
        {
          text: 'No',          
          cssClass: 'secondary',          
          handler: () => {
            this.rechazarServicio();
          }
        }, {
          text: 'Si',
          handler: () => {
            this.aceptarServicio();
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  aceptarServicio(){
    
  }

  rechazarServicio(){
    this.serviciosRechazados.push(this.servicio.idServicio)
    console.log("serviciosRechazados-> " + JSON.stringify(this.serviciosRechazados))
    this.estadoEspera = false;
  }

}
