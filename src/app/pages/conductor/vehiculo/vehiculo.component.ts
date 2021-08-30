import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.scss'],
})
export class VehiculoComponent implements OnInit {

  placa: string = "";
  capacidad: string = "";
  tipo: string = "";

  vehiculos: any[] = []

  constructor() { }

  ngOnInit() {
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    let usuarios = JSON.parse(window.localStorage.getItem("users"))
    usuarios.map((item) => {
      if (item.token === window.localStorage.getItem("token")) {
        let vehiculosA = JSON.parse(window.localStorage.getItem("vehiculos"))
        vehiculosA.map((item) => {
          this.vehiculos.push(
            {
              placa: item.placa,
              capacidad: item.capacidad,
              tipo: JSON.parse(item.tipoVehiculo).nombre
            }
          )          
        })
      }
    })
  }
}
