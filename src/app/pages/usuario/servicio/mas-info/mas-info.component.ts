import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-mas-info',
  templateUrl: './mas-info.component.html',
  styleUrls: ['./mas-info.component.scss'],
})
export class MasInfoComponent implements OnInit {

  @Input() fechaOrigen: string;
  @Input() fechaDestino: string;
  @Input() valor: string;
  @Input() descripcion: string;
  @Input() lugarDestino: string;
  @Input() lugarOrigen: string;
  @Input() idConductor: number;
  @Input() estado: number;
  @Input() rol: number;

  prueba: boolean = false;

  fechaOrigenDate: Date
  fechaDestinoDate: Date
  constructor(private modalController: ModalController) {        
  }

  ngOnInit() {
    this.fechaOrigenDate = new Date(this.fechaOrigen)
    this.fechaDestinoDate = new Date(this.fechaDestino)
    console.log("conductor: " + this.rol) 
  }

  dismissModal() {    
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  aceptarServicio(idConductor:number){
    console.log('log'+idConductor);
  }


}
