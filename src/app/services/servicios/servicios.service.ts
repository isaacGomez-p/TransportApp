import{ HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { IServicio } from 'src/model/IServicio';

@Injectable({
  providedIn: 'root'
})

export class ServiciosService {

  private urlService: string = environment.url

  //private urlService: string = "https://localhost:44341/api";
  
  constructor(private http: HttpClient, public navCtrl: NavController) {    
  }

  postServicios(datos: IServicio){
    return this.http.post(`${this.urlService}/TRS_?idSer=0`, datos);
  }  

  putServicio(datos: IServicio, id: number){
    return this.http.put(`${this.urlService}/TRS_/`+id, datos);
  }

  // Retorna todos los servicios - Si envia 0 retorna todos los servicios y si se envia el id busca todos los servicios del usuario
  getAll(id: number): Observable<IServicio[]>{       
    return this.http.get<IServicio[]>(`${this.urlService}/TRS_?idSer=`+id);
  }  

}