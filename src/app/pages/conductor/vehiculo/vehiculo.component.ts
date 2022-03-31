import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { VehiculoService } from 'src/app/services/vehiculo/vehiculo.service';

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

  constructor(private vehiculoService: VehiculoService,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    let dataUsuario = JSON.parse(window.localStorage.getItem("user"));
    if(dataUsuario){
    //this.usuarioService.getAllUser(window.localStorage.getItem("token")).subscribe(dataUsuario => {
      this.vehiculoService.getVehiculos(dataUsuario.idUsuario).subscribe(dataVehiculo => {
        this.vehiculos = dataVehiculo
      })
//    })
    }

    /*let usuarios = JSON.parse(window.localStorage.getItem("users"))
    usuarios.map((item) => {
      if (item.token === window.localStorage.getItem("token")) {
        let vehiculosA = JSON.parse(window.localStorage.getItem("vehiculos"))
        vehiculosA.map((item1) => {
          if(item1.idUsuario === item.idUsuario){
            this.vehiculos.push(
              {
                placa: item1.placa,
                capacidad: item1.capacidad,
                tipo: JSON.parse(item1.tipoVehiculo).nombre
              }
            )  
          }                  
        })
      }
    })*/
  }
}
