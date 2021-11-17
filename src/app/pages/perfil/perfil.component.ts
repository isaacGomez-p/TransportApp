import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  usuario: string = "";
  cedula: string = "";
  telefono: string = "";
  correo: string = "";
  rol: string = "";

  constructor(private menuCtrl: MenuController, 
    private appComponent: AppComponent,
    private usuarioService: UsuarioService) {
    menuCtrl.enable(true, 'menuPrincipal');    
  }

  ngOnInit() {    
  }

  ionViewDidEnter(){
    console.log("entro ionViewDidEnter -- ")
    this.cargarDatos();
  }

  cargarDatos(){    
    console.log("entro -- -- - -- - - ")

    this.usuarioService.getAllUser(window.localStorage.getItem("token")).subscribe( data => {
      console.log("usuario " + JSON.stringify(data));
      this.appComponent.usuario = data[0].nombre
        this.usuario = data[0].nombre
        this.appComponent.rol = data[0].rol + ""
        this.cedula = data[0].cedula
        this.correo = data[0].correo
        this.telefono = data[0].telefono
        if(data[0].rol === 1){
          this.rol = "Conductor"
        }else{ 
          this.rol = "Usuario"
        }
    })

    /*let usuarios = JSON.parse(window.localStorage.getItem("users"))
    usuarios.map((item)=>{
      if(item.token === window.localStorage.getItem("token")){
        this.appComponent.usuario = item.nombre
        this.usuario = item.nombre
        this.appComponent.rol = item.rol
        this.cedula = item.cedula
        this.correo = item.correo
        this.telefono = item.telefono
        if(item.rol === "1"){
          this.rol = "Conductor"
        }else{
          this.rol = "Usuario"
        }
        
      }
    })*/

  }

  

}
