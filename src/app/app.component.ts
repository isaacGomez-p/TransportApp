import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  usuario: string = "";
  rol: string = ""
  constructor(private router: Router,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController) { }

  ngOnInit() {     
    //this.cargarDatos()
  }

  OnViewDidEnter(){    
    this.menuCtrl.enable(false);
    //this.cargarDatos()
  }

  cargarDatos(){   
    console.log(" entro APP ") 
    let usuarios = JSON.parse(window.localStorage.getItem("users"))
    usuarios.map((item)=>{
      if(item.token === window.localStorage.getItem("token")){        
        this.usuario = item.nombre
        this.rol = item.rol
      }
    })
  }

  //Metodo de confirmacion para cerrar sesión
  async openAlert() {    
    const alert = await this.alertCtrl.create({      
      header: '¿Desea cerrar sesión? \n\n',      
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: (data) => {            
            try{
              this.logOut();
              
            }catch(Exception){
              
            }                        
          }
        }
      ]
    });
    await alert.present();
  }

  logOut(){
    window.localStorage.removeItem("token")    
    this.menuCtrl.enable(false, 'menuPrincipal');
    this.router.navigateByUrl('/login');
  }

}
