export interface Cliente{
    id?: number;
    codigoCliente: string;
    documento: string;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    email: string;
    estrato: number;
    estado: string;
    fechaRegistro: string;
}