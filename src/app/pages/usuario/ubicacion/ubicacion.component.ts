import { Component, ElementRef, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Coordenadas } from '../../conductor/servicio/mis-servicios/en-ruta/model/coordenadas.interface';
import { WayPoint } from '../../conductor/servicio/mis-servicios/en-ruta/model/waypoint.interface';
import { UbicacionModel } from './ubicacionModel';

declare var google;

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss'],
})
export class UbicacionComponent implements OnInit, OnDestroy {



  map: any;
  mapDestino: any;

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

  origen: boolean = false;
  destino: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, 
    public toastController: ToastController, 
    public alertController: AlertController,
    private router: Router){     
  }

  ngOnInit() { }

  ngOnDestroy(){
    //window.location.reload();
    //const mapEle : HTMLElement = document.getElementById('map');
    //mapEle.remove()
  }

  ionViewDidEnter() {    
    this.dato = this.activatedRoute.snapshot.paramMap.get('dato');    
    if(this.dato === 'Origen'){
      this.origen = true;
    }else{
      this.destino = true;
    }
    this.cargarDatos();
  }

  cargarDatos(){
    if(window.localStorage.getItem("ubicacionCoordenadas")){
      this.ubicacion = JSON.parse(window.localStorage.getItem("ubicacionCoordenadas"));      
    }else{
      this.ubicacion = new UbicacionModel
    }
    this.loadMap()
  }

  loadMap() {   
    this.origin = { lat: 4.817846667527221, lng: -74.35273186860987 }
    this.destination = { lat: 4.974102347568695, lng: -74.28949783746805 }        
    if(this.origin.lat !== null && this.origin.lng !== null){      
      // create a new map by passing HTMLElement      
      //if(this.dato === 'Origen'){
        const mapEle : HTMLElement = document.getElementById('map');        
        // create map
        this.map = new google.maps.Map(mapEle, {
          center: this.origin,
          zoom: 12
        });
        let latLng = new google.maps.LatLng(this.origin.lat, this.origin.lng);
        this.addMarker(this.map, latLng);
        this.addMarkerArrive(this.map, latLng);              
      /*}else{
        const mapEle : HTMLElement = document.getElementById('mapDestino');    
        console.log("-- mapDestino " + mapEle)
        // create map
        this.mapDestino = new google.maps.Map(mapEle, {
          center: this.origin,
          zoom: 12
        });
        console.log("-- mapDestino " + this.mapDestino)
        let latLng = new google.maps.LatLng(this.origin.lat, this.origin.lng);
        this.addMarker(this.mapDestino, latLng)      
        
      }              */
    }else{
      this.toastConfirmacion('Por favor asegurese de tener activados los servicios de ubicación.', 'warning')
    }
  }

  addMarkerArrive(map, position){
    const image = {
      url: '../../../assets/img/flag.jpg',
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
      this.ubicacionAlert();

      console.log("++1"+location)
    })
  }

  addMarker(map, position){
    let marker = new google.maps.Marker({
      map,
      position,
      draggable: true
    })
    marker.addListener('dragend', () => {
      let location = {
        lat : marker.getPosition().lat(),
        lng : marker.getPosition().lng(),
      }
      this.marker = location;
      window.localStorage.setItem("start", JSON.stringify(location));

      console.log("++2"+location)
    })
  }

  drawRoute(){
    console.log(" 1 ")
    console.log("ruta: " + JSON.stringify(window.localStorage.getItem("ruta")))
    let start = JSON.parse(window.localStorage.getItem("start"));
    let arrive = JSON.parse(window.localStorage.getItem("arrive"));
    console.log("-- " + JSON.stringify(start))
    console.log("--55 " + JSON.stringify(arrive))
    let coordenadasO: Coordenadas = start;
    let coordenadasD: Coordenadas = arrive;
    console.log("-- " + JSON.stringify(coordenadasD.lat))
    this.origin = { lat: coordenadasO.lat, lng: coordenadasO.lng }
    this.destination = { lat: coordenadasD.lat, lng: coordenadasD.lng }    
    if(this.origin.lat !== null && this.origin.lng !== null){
      // create a new map by passing HTMLElement
      const mapEle: HTMLElement = document.getElementById('map');    
      const indicatorsEle: HTMLElement = document.getElementById('indicators');
      // create map
      this.map = new google.maps.Map(mapEle, {
        center: this.origin,
        zoom: 12
      });
      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setPanel(indicatorsEle);
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
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
  
  async ubicacionAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación',
      message: '¿Confirmar ubicación?',
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
            this.drawRoute();   
            this.confirmarUbicacion();
          }
        }
      ]
    });

    await alert.present();
  }

  confirmarUbicacion(){
    //Valida si ya fue ingresado las coordenadas de origen
    if(JSON.parse(window.localStorage.getItem("start")) != null){
      console.log(JSON.parse(window.localStorage.getItem("start")));
    }
    if(JSON.parse(window.localStorage.getItem("start")) != null){
      console.log(JSON.parse(window.localStorage.getItem("start")));
    }
    if(this.dato === "Origen"){      
      this.ubicacion.coordenadasOrigen = {
        lat: this.marker.lat,
        lng: this.marker.lng,
      }
      this.ubicacion.origen = true;
      this.ubicacion.dato = 1;
    }else{      
      this.ubicacion.coordenadasDestino = {
        lat: this.marker.lat,
        lng: this.marker.lng,
      }
      this.ubicacion.destino = true;
      this.ubicacion.dato = 2;
    }
    window.localStorage.setItem("ubicacionCoordenadas", JSON.stringify(this.ubicacion))
    this.router.navigateByUrl('/agregarServicios/mapa');
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
