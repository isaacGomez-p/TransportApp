import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController, ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
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
        private toastController: ToastController,
        private usuarioService: UsuarioService) { }

    ngOnInit() { 
        //this.vehiculo()
        this.calcularPuntosMasCercanos();
    }

    getKilometros (lat1,lon1,lat2,lon2)
    {    
        var R = 6378.137; //Radio de la tierra en km
        var dLat = this.rad( lat2 - lat1 );
        var dLong = this.rad( lon2 - lon1 );
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        
        let resultado = d;
        console.log("1 --- "+ resultado)
        //return resultado;

        return d.toFixed(3); //Retorna tres decimales
    }

    rad(x){
        return x*Math.PI/180;
    }    
    
    calcularPuntosMasCercanos(){        
        let lati = 4.826796599317524
        let long = -74.35447267704565
        let latiDestino = 4.834617864188338
        let longDestino = -74.25114661928522
        this.getKilometros(lati, long, latiDestino, longDestino);
        console.log("----------------------------")    
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

        this.usuarioService.login(form.value.user.toUpperCase(), form.value.password).subscribe((data)=>{
            window.localStorage.setItem("token", data.token);
            this.menuCtrl.enable(true, 'menuPrincipal');
            this.router.navigateByUrl('/perfil');
        },
        (err) => {
            if(err.status === 409){
                // Error 409 cuando se repite el usuario y la contraseña
                console.log(" error login " + JSON.stringify(err));
                this.toastConfirmacion("Credenciales incorrectas.", "danger");
            }            
        }) 

        /*
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
        }*/       
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
