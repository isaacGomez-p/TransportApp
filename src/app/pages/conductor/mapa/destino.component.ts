import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Coordenadas } from 'src/app/pages/conductor/servicio/mis-servicios/en-ruta/model/coordenadas.interface';
import { WayPoint } from 'src/app/pages/conductor/servicio/mis-servicios/en-ruta/model/waypoint.interface';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { UbicacionModel } from '../../usuario/ubicacion/ubicacionModel';
import { interval } from 'rxjs';
import { ServiciosService } from 'src/app/services/servicios/servicios.service';
import { IServicio } from 'src/model/IServicio';


declare var google;

@Component({
  selector: 'app-destino',
  templateUrl: './destino.component.html',
  styleUrls: ['./destino.component.scss'],
})
export class DestinoComponent implements OnInit {

  map2: any;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  origin: Coordenadas;
  validacion = true;
  location: Coordenadas;
  ubicacionValidacion = false;
  wayPoint: WayPoint[];
  destination: Coordenadas;

  ubicacion: UbicacionModel;

  marker: any;
  dato: string;

  estadoEspera: boolean = false;
  servicio: IServicio;
  servicios : IServicio[] = [];

  latitudUbicacion: number;
  longitudUbicacion: number;

  private alert: any;  

  tiempoEspera: number = 10000;

  constructor(private activatedRoute: ActivatedRoute, 
    public toastController: ToastController, 
    public alertController: AlertController,
    private router: Router,
    private usuarioService: UsuarioService,
    public servicioService: ServiciosService){     
  }

  ngOnInit() { }

  ngOnDestroy(){
    //window.location.reload();
  }

  ionViewDidEnter() {    
    this.dato = this.activatedRoute.snapshot.paramMap.get('dato');    
    this.cargarDatos();
  }

  async cargarDatos(){
  /*  if(window.localStorage.getItem("ubicacionCoordenadas")){
      this.ubicacion = JSON.parse(window.localStorage.getItem("ubicacionCoordenadas"));      
    }else{
      this.ubicacion = new UbicacionModel
    }*/
    await this.cargarUbicacion();
    this.loadMap();
    this.periodic();
  }

  async cargarUbicacion(){
    this.origin = { lat: this.usuarioService.latitud, lng: this.usuarioService.longitud }
    this.latitudUbicacion = this.origin.lat;
    this.longitudUbicacion = this.origin.lng;
    //this.latitudUbicacion = this.usuarioService.latitud;
    //this.latitudUbicacion = 4.340810395398626
    console.log("latitu: " + this.origin.lat )
    //this.longitudUbicacion = this.usuarioService.longitud;
    //this.longitudUbicacion = -74.36500114878433
    console.log("longitud: " + this.origin.lng )
  }

  loadMap() {   
    console.log("-- 1 destino ")
    //this.origin = { lat: 4.817846667527221, lng: -74.35273186860987 }
    this.destination = { lat: 4.974102347568695, lng: -74.28949783746805 }        
    if(this.origin.lat !== null && this.origin.lng !== null){      
      // create a new map by passing HTMLElement
      const mapEle: HTMLElement = document.getElementById('map2');      
      // create map
      this.map2 = new google.maps.Map(mapEle, {
        center: this.origin,
        zoom: 12
      });      
      let latLng = new google.maps.LatLng(this.origin.lat, this.origin.lng);
      this.addMarker(this.map2, latLng)            
    }else{
      this.toastConfirmacion('Por favor asegurese de tener activados los servicios de ubicación.', 'warning')
    }
  }

  addMarker(map2, position){
    let marker = new google.maps.Marker({
      map2,
      position,
      draggable: true
    })
    marker.addListener('dragend', () => {
      let location = {
        lat : marker.getPosition().lat(),
        lng : marker.getPosition().lng(),
      }
      this.marker = location;

      console.log(location)
    })
  }
  
  async alertCancelar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación',
      message: '¿Desea terminar el servicio?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.terminarServicio();
          }
        }
      ]
    });

    await alert.present();
  }

  terminarServicio(){
    this.servicio.estado = 3;
    this.servicio.fechaEntrega = new Date();
    this.servicioService.putServicio(this.servicio, this.servicio.idServicio).subscribe((data)=>{
      this.toastConfirmacion('Se entrego correctamente servicio', 'success')
      //Se habilita para mas servicios
      this.estadoEspera = false;
    })
    this.router.navigateByUrl('/misServicios');
  }

  async toastConfirmacion(mensaje, colorT) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: colorT,
      duration: 2000
    });
    toast.present();
  }

  periodic(){    
    interval(this.tiempoEspera).subscribe(x => {
      console.log("estadoEspera -> " + this.estadoEspera)
      if(this.estadoEspera === false){      
        this.cargarUbicacion();
        this.servicioService.getAll(0).subscribe(data => {
          this.servicios = data;
          if(this.servicios !== undefined){
            if(this.servicios.length !== 0){              
              this.calcularPuntosMasCercanos();
            }
          }          
        })
      }else{
        this.cargarUbicacion();
        this.addMarkerArrive(this.map2, this.origin);
      }
    })
  }


  //Añadir marcador de ubicacion actual del taxista
  addMarkerArrive(map, position){
    const image = {
      url: '../../../assets/img/taxi.png',
      size: {
        width: 24,
        height: 24
      }
    };

    let marker = new google.maps.Marker({
      map,
      position,
      draggable: true,
      animation: 'DROP',
      icon: image
    })
    marker.addListener('dragend', () => {
      let location = {
        lat : marker.getPosition().lat(),
        lng : marker.getPosition().lng(),
      }
      this.marker = location;
      window.localStorage.setItem("arrive", JSON.stringify(location));
      

      console.log("++1"+location)
    })
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
      if(item.estado === 1){

        console.log("1---------- " + item.lugarDestino)
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
          console.log("2----------")
        }      
      }
    })
    if(numeros.length !== 0){    
      let aux = numeros[0].distancia;
      this.servicio = numeros[0].servicio;
      console.log("1 - " + aux)
      numeros.map(item => {      
        console.log("dato - " + item.distancia)
        if(item.distancia < aux){
          console.log("-- entro" + item.distancia)
          aux = item.distancia;
          this.servicio = item.servicio //se guarda todo el objeto de servicio
        }
      })      
      this.ofrecerServicio(this.servicio);
    }
  }

  ofrecerServicio(servicio : IServicio){
    this.estadoEspera = true;
    this.alertService(servicio);
  }

  async alertService(servicio : IServicio) {
    console.log("alertService -> " + JSON.stringify(servicio))
    if(this.estadoEspera){    
      this.alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Servicio nuevo',
        message: 'Origen: ' + servicio.lugarOrigen + ' - Destino: ' + servicio.lugarDestino,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              this.estadoEspera = false;
            }
          }, {
            text: 'Aceptar',
            handler: () => {
              this.confirmarServicio(servicio);
            }
          }
        ]
      });
      await this.alert.present();
    }
  }

  private cerrarAlert() {
    this.alert.dismiss();
}

  confirmarServicio(servicio : IServicio){
    //Se busca en la BD el servicio con el id
    this.servicioService.getAll(servicio.idUsuario).subscribe((dataS)=>{
      let ser = dataS;
      ser.map((i)=>{
        if(i.idServicio === servicio.idServicio){
          console.log("confirmarServicio -> Id: " + servicio.idServicio + " - " + JSON.stringify(i))
          //Se valida que el servicio siga disponibe
          if(i.estado === 1){ // 1 - Significa disponible
            //Se consulta en la BD al usuario logueado con el token
            this.usuarioService.getAllUser(window.localStorage.getItem("token")).subscribe((dataU)=>{
              i.estado = 2;
              i.idConductor = dataU[0].idUsuario
              //Se modifica en la BD al servicio
              this.servicioService.putServicio(i, i.idServicio).subscribe((data)=>{
                this.toastConfirmacion('Se asigno correctamente el servicio', 'success')    
                this.cerrarAlert();
                this.pintarMapa(i);
              } ,
              (err) => {
                  if(err.status === 500){
                      // Error 500 Error en el servicio
                    this.toastConfirmacion("¡Ups! Hubo un error en el servidor.", "danger");
                    this.router.navigateByUrl('/perfil');
                  }else{
                    this.toastConfirmacion("Por favor revise su conexión a internet.", "danger");  
                  }            
              }) 
            })
          }else{
            this.toastConfirmacion('Lo sentimos, el servicio ya fue asignado', 'warning')
          }
        }
      })
    })        
  }
  //Se pinta el mapa con las coordenadas del servicio
  pintarMapa(servicio){
    console.log("pintarMapa ----- " + JSON.stringify(servicio));
    this.servicio = servicio;   
    console.log(" 1 ")    
    let coordenadasO: Coordenadas = JSON.parse(servicio.lugarOrigen);
    let coordenadasD: Coordenadas = JSON.parse(servicio.lugarDestino);
    console.log("-- " + JSON.stringify(coordenadasD.lat))
    this.origin = { lat: coordenadasO.lat, lng: coordenadasO.lng }
    this.destination = { lat: coordenadasD.lat, lng: coordenadasD.lng }    
    if(this.origin.lat !== null && this.origin.lng !== null){
      // create a new map by passing HTMLElement
      const mapEle: HTMLElement = document.getElementById('map2');    
      const indicatorsEle: HTMLElement = document.getElementById('indicators');
      // create map
      this.map2 = new google.maps.Map(mapEle, {
        center: this.origin,
        zoom: 12
      });
      this.directionsDisplay.setMap(this.map2);
      this.directionsDisplay.setPanel(indicatorsEle);
      google.maps.event.addListenerOnce(this.map2, 'idle', () => {
        mapEle.classList.add('show-map');
        this.calculateRoute();        
      });      
    }else{
      this.toastConfirmacion('Por favor asegurese de tener activados los servicios de ubicación.', 'warning')
    }
  }

  private calculateRoute() {
    console.log(" 7 ")
    this.directionsService.route({
      origin: this.ubicacionValidacion === false ?
              this.origin :
              this.location,
      destination: this.destination,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,      
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

}
