import{ HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController, ToastController } from '@ionic/angular';
import { IUsuario } from '../../../model/IUsuario';
import { environment } from '../../../environments/environment';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private urlService: string = environment.url
  private contadorLatitud = 0;
  private contadorLongitud = 0;
  private confirmacionUbicacion = 0;
  //private urlService: string = "https://localhost:44341/api";
  private pruebas: boolean = true;
  constructor(private http: HttpClient, 
    public navCtrl: NavController,
    public geolocation: Geolocation,
    private toastController: ToastController) {      
      this.getLongitud();
      this.getLatitud();
  }

  validarLatitud(){    
    console.log("----- service: latitud -> " + this.latitud)
    if(this.latitud === 0){
      
      console.log("----- ")         
      this.contadorLatitud++;
      if(this.pruebas){
        this.toastConfirmacion("this.contadorLatitud -> " + this.contadorLatitud, "danger");
      }
      console.log("----- contador -> " + this.contadorLatitud)    
      this.getLatitud();        
    }else{
      this.validarUbicacion();
    }
  }

  validarUbicacion(){
    if(this.latitud !== 0 && this.longitud !== 0){
      this.toastConfirmacion(this.latitud + " " + this.longitud, "success");
    }
  }

  validarLongitud(){
    console.log("----- service: longitud -> " + this.longitud)    
    if(this.longitud === 0){    
      console.log("----- ")           
      this.getLongitud();        
      this.contadorLongitud++;
      if(this.pruebas){
        this.toastConfirmacion("this.contadorLongitud -> " + this.contadorLongitud, "danger");
      }
      
      console.log("----- contador -> " + this.contadorLongitud)
    }else{
      this.validarUbicacion();
    }
  }

  latitud: number = 0;
  longitud: number = 0;

  postUsuario(datos: IUsuario){
    return this.http.post(`${this.urlService}/TRS_`, datos);
  }

  login(usuario: string, clave: string): Observable<IUsuario>{
    return this.http.get<IUsuario>(`${this.urlService}/TRS_?usuario=`+usuario+`&constrasenia=`+clave);
  }

  /*putAgricultor(datos: Agricultor, id: number){
    return this.http.put(`${this.urlService}/AGD_Agricultor/`+id, datos);
  }

  
  */

  // Retorna todos los usuarios - Si envia 0 retorna todos los usuarios y si se envia el token lo busca
  getAllUser(token: string): Observable<IUsuario[]>{       
    return this.http.get<IUsuario[]>(`${this.urlService}/TRS_?token=`+token);
  }  

  getLatitud(){
    if(this.contadorLatitud === 5){              
      this.toastConfirmacion("Error con la latitud.", "danger");
    }else{    
      this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{      
        this.latitud = geoposition.coords.latitude;      
        console.log('this.latitud ' + this.latitud);
      })    
    }
  }

  getLongitud(){
    if(this.contadorLongitud === 5){              
      this.toastConfirmacion("Error con la longitud.", "danger");
    }else{   
      this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
        this.longitud = geoposition.coords.longitude;
        console.log('this.longitud ' + this.longitud);
        this.validarLongitud();
      });    
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