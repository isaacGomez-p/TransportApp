import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, NavController, ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { IVehiculo } from 'src/model/IVehiculo';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { ServiciosService } from 'src/app/services/servicios/servicios.service';
import { AnyMxRecord } from 'dns';


@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit{

  count: any;
  a: number = 0;

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
        private usuarioService: UsuarioService,
        public alertController: AlertController,
        public servicioService: ServiciosService) { }

    ngOnInit() { 
        //this.vehiculo()
        this.calcularPuntosMasCercanos();
        this.periodic();
    }

    periodic(){

      const numbers = interval(1000);
      
 
      const takeFourNumbers = numbers.pipe(take(4));
      interval(1000).subscribe(x => {
        this.servicioService.getAll(0).subscribe(servicios => {
          this.count = JSON.stringify(servicios).length;
          this.a++;
          console.log(JSON.stringify(servicios) + "---" + this.count + "--" + this.a);
        })
      })
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
            console.log("data login: " + JSON.stringify(data))            
            /*if(data[1].rol === 1){
                this.presentAlertRadio();
            }else{*/
                window.localStorage.setItem("token", data[0].token);
                this.menuCtrl.enable(true, 'menuPrincipal');
                this.router.navigateByUrl('/perfil');
            //}
            
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

    async presentAlertRadio() {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Radio',
          inputs: [
            {
              name: 'radio1',
              type: 'radio',
              label: 'Radio 1',
              value: 'value1',
              handler: () => {
                console.log('Radio 1 selected');
              },
              checked: true
            },
            {
              name: 'radio2',
              type: 'radio',
              label: 'Radio 2',
              value: 'value2',
              handler: () => {
                console.log('Radio 2 selected');
              }
            },
            {
              name: 'radio3',
              type: 'radio',
              label: 'Radio 3',
              value: 'value3',
              handler: () => {
                console.log('Radio 3 selected');
              }
            },
            {
              name: 'radio4',
              type: 'radio',
              label: 'Radio 4',
              value: 'value4',
              handler: () => {
                console.log('Radio 4 selected');
              }
            },
            {
              name: 'radio5',
              type: 'radio',
              label: 'Radio 5',
              value: 'value5',
              handler: () => {
                console.log('Radio 5 selected');
              }
            },
            {
              name: 'radio6',
              type: 'radio',
              label: 'Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 Radio 6 ',
              value: 'value6',
              handler: () => {
                console.log('Radio 6 selected');
              }
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Ok',
              handler: () => {
                console.log('Confirm Ok');
              }
            }
          ]
        });
    
        await alert.present();
      }

      async presentAlertCheckbox() {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Checkbox',
          inputs: [
            {
              name: 'checkbox1',
              type: 'checkbox',
              label: 'Checkbox 1',
              value: 'value1',
              handler: () => {
                console.log('Checkbox 1 selected');
              },
              checked: true
            },
    
            {
              name: 'checkbox2',
              type: 'checkbox',
              label: 'Checkbox 2',
              value: 'value2',
              handler: () => {
                console.log('Checkbox 2 selected');
              }
            },
    
            {
              name: 'checkbox3',
              type: 'checkbox',
              label: 'Checkbox 3',
              value: 'value3',
              handler: () => {
                console.log('Checkbox 3 selected');
              }
            },
    
            {
              name: 'checkbox4',
              type: 'checkbox',
              label: 'Checkbox 4',
              value: 'value4',
              handler: () => {
                console.log('Checkbox 4 selected');
              }
            },
    
            {
              name: 'checkbox5',
              type: 'checkbox',
              label: 'Checkbox 5',
              value: 'value5',
              handler: () => {
                console.log('Checkbox 5 selected');
              }
            },
    
            {
              name: 'checkbox6',
              type: 'checkbox',
              label: 'Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6 Checkbox 6',
              value: 'value6',
              handler: () => {
                console.log('Checkbox 6 selected');
              }
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Ok',
              handler: () => {
                console.log('Confirm Ok');
              }
            }
          ]
        });
    
        await alert.present();
      }

}
