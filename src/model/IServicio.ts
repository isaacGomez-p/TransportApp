export interface IServicio {
    idServicio: number;
    idUsuario: number;
    lugarOrigen: string;
    fechaOrigen: Date;
    lugarDestino: string;
    fechaDestino: Date;
    idConductor: number;
    estado: number; // 1 - Disponible  2 - Asignado   3 - Entregado   4 - Cancelado
    descripcion: string;
    valor: string;    
    rol: number;
    fechaEntrega: Date;
}