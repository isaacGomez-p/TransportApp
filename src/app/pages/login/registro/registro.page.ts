import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IRol } from 'src/model/IRol';
import { IUsuario } from 'src/model/IUsuario';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';


@Component({
    selector: 'app-registro',
    templateUrl: 'registro.page.html',
    styleUrls: ['registro.page.scss']
})
export class RegistroPage implements OnInit {    

    nombre: string;
    correo: string;
    contrasenia: string;
    usuario: string;
    confirContra: string;
    telefono: number;
    cedula: number;
    registro: IUsuario;
    fecha: Date;
    rol: number;

    listaRoles: IRol[] = []

    constructor(private toastController: ToastController, private router: Router, private usuarioService: UsuarioService) { }

    ngOnInit() {
        this.listaRoles.push(
            {
                idRol: 1,
                nombre: "Conductor"
            },
            {
                idRol: 2,
                nombre: "Usuario"
            }
        )
    }

    registrar(form) {
        if (this.validarDatos(form)) {
            let usuario : IUsuario = {
                cedula: form.value.cedula,
                confirContra: '',
                contrasenia: form.value.contrasenia,
                correo: form.value.correo.toUpperCase(),
                estado: 1,
                fechaNacimiento: form.value.fecha,
                idUsuario: null,
                nombre: form.value.nombre.toUpperCase(),
                rol: form.value.rol,
                //rol: 2,
                telefono: form.value.telefono,
                token: this.generaCodigo(),
                usuario: form.value.usuario.toUpperCase()
            }

            this.usuarioService.postUsuario(usuario).subscribe(data => {
                //Rol 1 es conductor
                console.log(" data " + JSON.stringify(data));
                if(form.value.rol === "1"){
                    window.localStorage.setItem("registroConductor", JSON.stringify(data))
                    this.router.navigateByUrl('/conductor'); 
                }else{
                    //Rol 2 es usuario
                    this.toastConfirmacion("Registrado correctamente.", "success");
                    this.resetData();
                    this.router.navigateByUrl('/login');
                }
            },
            (err) => {
                // Error 409 cuando se repite el usuario y la contraseña
                console.log(" error Usuario " + JSON.stringify(err));
                this.toastConfirmacion("Por favor comprueba tu conexión a internet", "danger");
            }) 
            //Rol 1 es conductor
            /*if(form.value.rol === "1"){                                
                if(window.localStorage.getItem("users") !== null){
                    let usuarios = JSON.parse(window.localStorage.getItem("users"))
                    usuarios.map((item)=>{
                        if(item.cedula === usuario.cedula || item.usuario === usuario.usuario){
                            //this.toastConfirmacion("Cédula o usuario ya registrada.", "warning");
                            return;
                        }
                    })
                }
                //window.localStorage.setItem("registroConductor", JSON.stringify(usuario))
                //this.router.navigateByUrl('/conductor');
            }else{ // 2 Es usuario               
                if(window.localStorage.getItem("users") === null){
                    let usuarios: any = []
                    usuario.idUsuario = 1;
                    usuarios.push(usuario)
                    window.localStorage.setItem("users", JSON.stringify(usuarios))
                }else{
                    let usuarios = JSON.parse(window.localStorage.getItem("users"))                    
                    
                    usuarios.map((item)=>{
                        console.log(" ----- " + item.cedula + "  " + usuario.cedula + " - " + item.usuario + " " + usuario.usuario)
                        if(item.cedula === usuario.cedula || item.usuario === usuario.usuario){
                            //this.toastConfirmacion("Cédula o usuario ya registrada.", "warning");
                            return;
                        }
                    })
                    usuario.idUsuario = usuarios.length+1;
                    usuarios.push(usuario)
                    window.localStorage.setItem("users", JSON.stringify(usuarios))
                }                
                this.toastConfirmacion("Registrado correctamente.", "success");
                this.resetData();
                this.router.navigateByUrl('/login');                
               
            } */
            /*this.usuarioService.postUsuario(usuario).subscribe((data) => {
                
            },
            (err) => {
                this.toastConfirmacion("Por favor comprueba tu conexión a internet", "danger");
            })          
            */
        }
    }

    /*
    Función para resetear los valores del formulario    
    */
    resetData(){
        this.nombre = null;                
        this.correo = null;
        this.contrasenia = null;
        this.usuario = null;
        this.confirContra = null;
        this.telefono = null;
        this.cedula = null;
        this.registro = null;
        this.fecha = null;
        this.rol = null;
    }    

    /*
    Función para validar los datos del usuario al momento del registro
    */
    validarDatos(form): boolean {
        let clave: String
        let claveConfirmacion: String
        clave = form.value.contrasenia;
        claveConfirmacion = form.value.confirContra;
        if (clave !== claveConfirmacion) {
            this.toastConfirmacion("Las claves no coinciden.", "warning");
            return false;
        }

        let posicionArroba = form.value.correo.lastIndexOf('@');
        let posicionPunto = form.value.correo.lastIndexOf('.');
        if (!(posicionArroba < posicionPunto && posicionArroba > 0 && form.value.correo.indexOf('@@') === -1 && posicionPunto > 2 && (form.value.correo.length - posicionPunto) > 2)) {
            this.toastConfirmacion("Por favor, ingrese un correo válido.", "warning");
            return false;
        }

        if (form.value.telefono > 9999999999) {
            this.toastConfirmacion("Celular incorrecto.", "warning");
            return false;
        }

        if (form.value.telefono < 999999999) {
            this.toastConfirmacion("Celular incorrecto.", "warning");
            return false;
        }

        if (form.value.cedula > 99999999999) {
            this.toastConfirmacion("Cédula incorrecta.", "warning");
            return false;
        }

        if (form.value.cedula < 9999999) {
            this.toastConfirmacion("Cédula incorrecta.", "warning");
            return false;
        }

        let fecha = new Date(form.value.fecha)
        let fechaActual = new Date();

        if ((fecha.getFullYear() - fechaActual.getFullYear()) * -1 < 18) {
            this.toastConfirmacion("Error, tiene que ser mayor de edad.", "warning");
            return false;
        } else {            
            if (fecha.getFullYear() - fechaActual.getFullYear() === -18) {
                if ((fecha.getMonth() - fechaActual.getMonth()) > 0) {
                    this.toastConfirmacion("Error, tiene que ser mayor de edad.", "warning");
                    return false;
                } else {                    
                    if ((fecha.getDate() - fechaActual.getDate()) > 0) {
                        this.toastConfirmacion("Error, tiene que ser mayor de edad.", "warning");
                        return false;
                    }
                }
            }
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

    /*
    Función que retorna un código en una cadena de texto
    */
    generaCodigo(): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+ABCDEFGHIJKLMNOPQRSTUVXYZ';    
        for (let i = 0; i < 7; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      }

}
