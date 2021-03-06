import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Coordenadas } from './model/coordenadas.interface';
import { WayPoint } from './model/waypoint.interface';

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
  validacion = true;
  location: Coordenadas;
  ubicacionValidacion = false;
  wayPoint: WayPoint[];
  destination: Coordenadas;

  constructor(public toastController: ToastController) { }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    console.log(" 1 ")
    console.log("ruta: " + JSON.stringify(window.localStorage.getItem("ruta")))
    let servicio = JSON.parse(window.localStorage.getItem("ruta"))
    console.log("-- " + JSON.stringify(servicio.lugarOrigen))
    let coordenadasO: Coordenadas = servicio.lugarOrigen;
    let coordenadasD: Coordenadas = servicio.lugarDestino;
    console.log("-- " + JSON.stringify(coordenadasD.lat))
    this.origin = { lat: coordenadasO.lat, lng: coordenadasO.lng }
    this.destination = { lat: coordenadasD.lat, lng: coordenadasD.lng }    
    console.log(" 2 ")
    if(this.origin.lat !== null && this.origin.lng !== null){
      console.log(" 3 ")
      // create a new map by passing HTMLElement
      const mapEle: HTMLElement = document.getElementById('map');    
      const indicatorsEle: HTMLElement = document.getElementById('indicators');
      // create map
      this.map = new google.maps.Map(mapEle, {
        center: this.origin,
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
      });      
    }else{
      this.toastConfirmacion('Por favor asegurese de tener activados los servicios de ubicaci??n.', 'warning')
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

}
