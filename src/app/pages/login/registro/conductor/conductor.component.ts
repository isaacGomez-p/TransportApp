import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IVehiculo } from 'src/model/IVehiculo';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.component.html',
  styleUrls: ['./conductor.component.scss'],
})
export class ConductorComponent implements OnInit {

  constructor(private toastController: ToastController, private router: Router) { }
  rol: string;
  placa: string;
  capacidad: number;
  tipoVehiculo: any[] = [
    {
      id: '1',
      nombre: 'Eje trasero de doble llanta y llantas pequeñas'
    },
    {
      id: '2',
      nombre: 'Eje trasero de doble llanta y llantas grandes'
    },
    {
      id: '3',
      nombre: 'Tres o cuatro ejes, los traseros en doble llanta.'
    },
    {
      id: '4',
      nombre: 'Cinco ejes, los traseros en doble llanta.'
    },
    {
      id: '5',
      nombre: 'Seis o más ejes, los traseros en doble llanta.'
    }
  ]

  ngOnInit() { }

  registrar(form) {
    if (this.validarDatos(form)) {
      let tipo = "";
      this.tipoVehiculo.map((item) => {
        if (item.id + "" === form.value.rol + "") {
          tipo = JSON.stringify(item)
        }
      })
      
      console.log("conductor: " + window.localStorage.getItem("registroConductor"))      
      let usuario = JSON.parse(window.localStorage.getItem("registroConductor"))
      let idUsuario = 0;
      //Registro del usuario
      if (window.localStorage.getItem("users") === null) {
        let usuarios: any = []
        usuario.idUsuario = 1;
        idUsuario = usuario.idUsuario;
        usuarios.push(usuario)
        window.localStorage.setItem("users", JSON.stringify(usuarios))
      } else {
        let usuarios = JSON.parse(window.localStorage.getItem("users"))        
        usuario.idUsuario = usuarios.length+1;
        idUsuario = usuario.idUsuario;
        usuarios.push(usuario)
        window.localStorage.setItem("users", JSON.stringify(usuarios))
      }
      //Registro del vehículo
      let vehiculo: IVehiculo = {
        capacidad: form.value.capacidad,
        placa: form.value.placa.toUpperCase(),
        tipoVehiculo: tipo,
        idUsuario: idUsuario,
        idVehiculo: 0
      }
      if (window.localStorage.getItem("vehiculos") === null) {
        let vehiculos: any = []
        vehiculo.idVehiculo = 1;        
        vehiculos.push(vehiculo)
        window.localStorage.setItem("vehiculos", JSON.stringify(vehiculos))
      } else {
        let vehiculos = JSON.parse(window.localStorage.getItem("vehiculos"))
        vehiculo.idVehiculo = vehiculos.length+1;        
        vehiculos.push(vehiculo)
        window.localStorage.setItem("vehiculos", JSON.stringify(vehiculos))
      }      
      window.localStorage.removeItem("registroConductor")
      this.toastConfirmacion("REGISTRADO.", "success");
      this.resetData();
      this.router.navigateByUrl('/login');
    }
  }

  /*
  Función para resetear los valores del formulario    
  */
  resetData() {
    this.rol = null;
    this.placa = null;
    this.capacidad = null;
  }

  /*
  Función para validar los datos del usuario al momento del registro
  */
  validarDatos(form): boolean {
    //validacion del tipo de vehiculo
    if (form.value.rol === null) {
      this.toastConfirmacion("Por favor seleccione un tipo de vehículo.", "warning");
      return false;
    }
    // Validación de la placa 
    let patronPlaca = /^([A-Z]{3}\d{3})$/; //Expresión regular, tres letras y tres números
    if (!patronPlaca.test(form.value.placa.toUpperCase())) {
      this.toastConfirmacion("Formato de placa incorrecto.", "warning");
      return false;
    }
    //validación de la capacidad de carga
    if (form.value.capacidad <= 0) {
      this.toastConfirmacion("Error, por favor ingrese una capacidad valida.", "warning");
      return false;
    }
    return true;
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
