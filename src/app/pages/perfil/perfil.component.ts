import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';

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

  constructor(private menuCtrl: MenuController, private appComponent: AppComponent) {         
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
    let usuarios = JSON.parse(window.localStorage.getItem("users"))
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
    })
  }

  

}
