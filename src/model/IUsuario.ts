export interface IUsuario {
    idUsuario: number;
    nombre: string;
    cedula: string;
    correo: string;
    telefono: string;
    estado: number; 
    fechaNacimiento: Date;
    rol: number;
    usuario: string;
    contrasenia: string;
    confirContra: string;
    token: string;
}