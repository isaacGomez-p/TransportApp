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
        this.addMarker(this.map, latLng)              
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

      console.log(location)
    })
  }
  
  async ubicacionAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación',
      message: '¿La ubicación es correcta?',
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
            this.confirmarUbicacion();
          }
        }
      ]
    });

    await alert.present();
  }

  confirmarUbicacion(){
    //Valida si ya fue ingresado las coordenadas de origen
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
