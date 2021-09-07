import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController, ToastController } from '@ionic/angular';
import { IUsuario } from 'src/model/IUsuario';
import { IVehiculo } from 'src/model/IVehiculo';
import { PerfilComponent } from '../perfil/perfil.component';


@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit{

    account: { email: string, password: string } = {
        email: null,
        password: null
    };
    usuario: any = [];
    
    vehiculoDato: any = {
        id: '1',
        nombre: 'Eje trasero de doble llanta y llantas pequeñas'
    }

    constructor(private menuCtrl: MenuController, 
        public navCtrl: NavController, 
        private router: Router, 
        private toastController: ToastController) { }

    ngOnInit() { 
        this.vehiculo()
    }

    valores(){
        let usuarios = JSON.parse(window.localStorage.getItem("users"))
        let cont = 1;
        usuarios.map((item)=>{
            item.idUsuario = cont;
            cont++;
        })        
        window.localStorage.setItem("users", JSON.stringify(usuarios))
    }

    vehiculo(){        
        let vehiculo: IVehiculo[] = [
            {
                capacidad: '200-Kg',
                idUsuario: 3,
                idVehiculo: 1,
                placa: 'ASD123',
                tipoVehiculo: JSON.stringify(this.vehiculoDato)
            }
        ]
        window.localStorage.setItem("vehiculos", JSON.stringify(vehiculo))
    }

    login(form) {
        let usuarios = JSON.parse(window.localStorage.getItem("users"))
        let validacion = false;
        if(usuarios == null){            
            this.toastConfirmacion("Credenciales incorrectas.", "danger");        
        }else{
            usuarios.map((item) => {
                if (item.usuario.toUpperCase() === form.value.user.toUpperCase() && item.contrasenia === form.value.password) {
                    this.toastConfirmacion("Bienvenido " + item.nombre, "success");
                    validacion = true;
                    //this.usuario.nombre = item.nombre;
                    //this.usuario.contrasenia
                    this.usuario.push(
                        {
                            usuario: item.nombre,
                            rol: item.rol
                        }
                    )              
                    window.localStorage.setItem("token", item.token);
                    this.menuCtrl.enable(true, 'menuPrincipal');                
                    this.router.navigateByUrl('/perfil');
                }
            })
            if (validacion === false) {
                this.toastConfirmacion("Credenciales incorrectas.", "danger");
            }
        }        
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
