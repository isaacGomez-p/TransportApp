import { Coordenadas } from "../../conductor/servicio/mis-servicios/en-ruta/model/coordenadas.interface";

export class UbicacionModel {
    
    origen: boolean;
    coordenadasOrigen: Coordenadas;
    destino: boolean;
    coordenadasDestino: Coordenadas;
    dato: number; // 1 - Indica que va añadir origen, 2 - Indica que va añadir destino
}