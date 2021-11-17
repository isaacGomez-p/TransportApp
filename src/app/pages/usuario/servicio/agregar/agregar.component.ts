import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServiciosService } from 'src/app/services/servicios/servicios.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
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

  constructor(private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private router: Router,
    private servicioService: ServiciosService,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    
  }

  ionViewDidEnter() {   
    if(this.activatedRoute.snapshot.paramMap.get('origen') === "mapa"){
      this.toastConfirmacion("Seleccionado correctamente", "success")
      let ubicacion = JSON.parse(window.localStorage.getItem("ubicacionCoordenadas"));
      if(ubicacion.dato === 1){
        this.lugarOrigen = JSON.stringify(ubicacion.coordenadasOrigen);
      }else{
        this.lugarDestino = JSON.stringify(ubicacion.coordenadasDestino);
      }
    }
  }


  registrar(form) {
    //let usuarios = JSON.parse(window.localStorage.getItem("users"))
    let idUsuario = 0;
    /*usuarios.map((item) => {
      if (item.token === window.localStorage.getItem("token")) {
        idUsuario = item.idUsuario
      }
    })*/
    this.usuarioService.getAllUser(window.localStorage.getItem("token")).subscribe((data)=>{
      idUsuario = data[0].idUsuario
      let servicio = {
        idServicio: this.servicio.length + 1,
        descripcion: form.value.descripcion,
        estado: 1,
        fechaDestino: form.value.fechaDestino,
        fechaOrigen: form.value.fechaOrigen,
        idConductor: 0,
        idUsuario: idUsuario,
        lugarDestino: form.value.lugarDestino,
        lugarOrigen: form.value.lugarOrigen,
        valor: form.value.valor,
        rol: -1,
        fechaEntrega: null
      }
      this.servicioService.postServicios(servicio).subscribe(res => {
        this.toastConfirmacion("Agregado correctamente.", "success");
        this.resetData();
        this.router.navigateByUrl('/servicios');
      })
    })
    /*if (window.localStorage.getItem("servicios")) {
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
        valor: form.value.valor,
        rol: -1,
        fechaEntrega: null
      }
    )
    window.localStorage.setItem("servicios", JSON.stringify(this.servicio));
    this.toastConfirmacion("Agregado correctamente.", "success");
    this.resetData();
    this.router.navigateByUrl('/servicios');*/
  }

  resetData() {
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
