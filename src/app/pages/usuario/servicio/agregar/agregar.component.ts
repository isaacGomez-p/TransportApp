import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IServicio } from 'src/model/IServicio';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.scss'],
})
export class AgregarComponent implements OnInit {

  lugarOrigen: string;
  fechaOrigen: Date;
  lugarDestino: string;
  fechaDestino: Date;
  descripcion: string;
  valor: number;
  servicio: IServicio[] = []
  constructor(private toastController: ToastController,
    private router: Router) { }

  ngOnInit() { }

  registrar(form) {
    let usuarios = JSON.parse(window.localStorage.getItem("users"))
    let idUsuario = 0;
    usuarios.map((item) => {
      if (item.token === window.localStorage.getItem("token")) {
        idUsuario = item.idUsuario
      }
    })
    if (window.localStorage.getItem("servicios")) {
      this.servicio = JSON.parse(window.localStorage.getItem("servicios"))
    }
    this.servicio.push(
      {
        idServicio: this.servicio.length + 1,
        descripcion: form.value.descripcion,
        estado: 1,
        fechaDestino: form.value.fechaDestino,
        fechaOrigen: form.value.fechaOrigen,
        idConductor: 0,        
        idUsuario: idUsuario,
        lugarDestino: form.value.lugarDestino,
        lugarOrigen: form.value.lugarOrigen,
        valor: form.value.valor
      }
    )
    window.localStorage.setItem("servicios", JSON.stringify(this.servicio));
    this.toastConfirmacion("Agregado correctamente.", "success");
    this.resetData();
    this.router.navigateByUrl('/servicios');
  }

  resetData(){
    this.lugarOrigen = null;
    this.fechaOrigen = null;
    this.lugarDestino = null;
    this.fechaDestino = null;
    this.descripcion = null;
    this.valor = null;
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