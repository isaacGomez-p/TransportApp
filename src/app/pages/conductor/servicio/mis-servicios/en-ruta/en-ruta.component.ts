import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Coordenadas } from './model/coordenadas.interface';
import { WayPoint } from './model/waypoint.interface';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { interval } from 'rxjs';
declare var google;

@Component({
  selector: 'app-en-ruta',
  templateUrl: './en-ruta.component.html',
  styleUrls: ['./en-ruta.component.scss'],
})
export class EnRutaComponent implements OnInit {

  map: any;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  origin: Coordenadas;
  ubicacionActual: Coordenadas;
  location: Coordenadas;
  validacion = true;
 
  ubicacionValidacion = false;
  wayPoint: WayPoint[];
  destination: Coordenadas;

  latitudUbicacion: number;
  longitudUbicacion: number;

  interval: any;

  chat: boolean = false;

  constructor(public toastController: ToastController,
  private usuarioService: UsuarioService,
  public alertController: AlertController) { }

  ngOnInit() {
    this.loadMap();
  }

 ngOnDestroy(){
    //window.location.reload();
    this.interval.unsubscribe();
    clearInterval(this.interval);
  }

  loadMap() {
    console.log(" ruta ---------- ")
    console.log("ruta: " + JSON.stringify(window.localStorage.getItem("ruta")))
    let servicio = JSON.parse(window.localStorage.getItem("ruta"))
    console.log("--lugarOrigen ->  " + JSON.stringify(servicio.lugarOrigen))
    console.log("--lugarDestino -> " + JSON.stringify(servicio.lugarDestino))
    let coordenadasO: Coordenadas = JSON.parse(servicio.lugarOrigen);
    let coordenadasD: Coordenadas = JSON.parse(servicio.lugarDestino);
    console.log("-- " + coordenadasD.lng)
    this.origin = coordenadasO
    this.destination = coordenadasD    
    this.cargarCoordenadas();
    console.log(" 2 ")
    if(this.origin.lat !== null && this.origin.lng !== null){
      console.log(" 3 ")
      // create a new map by passing HTMLElement
      const mapEle: HTMLElement = document.getElementById('map');    
      const indicatorsEle: HTMLElement = document.getElementById('indicators');
      console.log(" 3 - 2 ")
      // create map
      this.map = new google.maps.Map(mapEle, {
        center: this.ubicacionActual,
        zoom: 12
      });
      console.log(" 4 ")
      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setPanel(indicatorsEle);
      console.log(" 5 ")
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
        if(this.validacion === true){
          console.log(" 6 ")
          this.calculateRoute();      
        }else{
          this.calculateRouteWayPoints();
        }        
        this.cargarUbicacion();
      });      
    }else{
      this.toastConfirmacion('Por favor asegurese de tener activados los servicios de ubicación.', 'warning')
    }
  //  window.localStorage.removeItem("ruta")
  }

  private calculateRouteWayPoints() {
    this.directionsService.route({      
      origin: this.ubicacionValidacion === false ?
              this.origin :
              this.location,
      //origin: this.origin,
      destination: this.origin,
      waypoints : this.wayPoint,
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

  async toastConfirmacion(mensaje, colorT) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: colorT,
      duration: 2000
    });
    toast.present();
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

  abrirChat(){
    this.chat = !this.chat;
  }

  async cargarUbicacion(){
    this.interval = interval(5000).subscribe(x => {
      //console.log("idInterval -> " + JSON.stringify(this.interval))
      console.log("calculando ubicacion --- en ruta")
      this.cargarCoordenadas();
      this.addMarkerArrive(this.map, this.ubicacionActual)
    });
  }

  async terminarRecorrido() {
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
            console.log("terminar --- ");
            clearInterval(this.interval);
          }
        }
      ]
    });

    await alert.present();
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
      //this.marker = location;
      //window.localStorage.setItem("arrive", JSON.stringify(location));
      

      console.log("++1"+location)
    })
  }

  async cargarCoordenadas(){
    this.ubicacionActual = { lat: this.usuarioService.latitud, lng: this.usuarioService.longitud }
    this.latitudUbicacion = this.origin.lat;
    this.longitudUbicacion = this.origin.lng;
    //this.latitudUbicacion = this.usuarioService.latitud;
    //this.latitudUbicacion = 4.340810395398626
    console.log("latitu: " + this.origin.lat )
    //this.longitudUbicacion = this.usuarioService.longitud;
    //this.longitudUbicacion = -74.36500114878433
    console.log("longitud: " + this.origin.lng )
  }

}
