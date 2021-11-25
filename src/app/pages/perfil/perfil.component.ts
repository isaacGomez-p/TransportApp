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

  usuario: string = "";
  cedula: string = "";
  telefono: string = "";
  correo: string = "";
  rol: string = "";

  servicios : IServicio[] = [];

  latitudUbicacion: number;
  longitudUbicacion: number;

  estadoEspera: boolean = false;
  servicio: IServicio;

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
    this.usuarioService.getAllUser(window.localStorage.getItem("token")).subscribe( data => {
      console.log("usuario " + JSON.stringify(data));
      this.appComponent.usuario = data[0].nombre
        this.usuario = data[0].nombre
        this.appComponent.rol = data[0].rol + ""
        this.cedula = data[0].cedula
        this.correo = data[0].correo
        this.telefono = data[0].telefono
        if(data[0].rol === 1){
          this.rol = "Conductor"
          this.periodic();
        }else{ 
          this.rol = "Usuario"
        }
    })

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
    interval(2000).subscribe(x => {
      if(this.estadoEspera === false){      
        this.cargarUbicacion();
        this.servicioService.getAll(0).subscribe(data => {
          this.servicios = data;
          console.log(JSON.stringify(data) + "---" + this.servicios.length + "--" );
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
    console.log("1 --- "+ resultado)
    //return resultado;

    return d.toFixed(3); //Retorna tres decimales
  }

  rad(x){
    return x*Math.PI/180;
  }    
  
  calcularPuntosMasCercanos(){       
    let numeros = [];
    let idServi = [];
    let lati = this.latitudUbicacion
    let long = this.longitudUbicacion
    this.servicios.map(item => {
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
    })
    let aux = numeros[0].distancia;
    console.log("1 - " + aux)
    numeros.map(item => {      
      console.log("dato - " + item.distancia)
      if(item.distancia < aux){
        console.log("-- entro" + item.distancia)
        aux = item.distancia;
        this.servicio = item.servicio
      }
    })

    this.ofrecerServicio();

  }

  async ofrecerServicio() {
    console.log("antes - " + this.servicio.estado)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmando entrega',
      subHeader: '',
      message: '¿Desea aceptar el servicio?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',          
        }, {
          text: 'Si',
          handler: () => {
            
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
