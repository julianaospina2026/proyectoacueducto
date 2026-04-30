import { Rol } from './rol.model';

export interface Usuario {
    id?: number;
    username: string;
    passwordHash: string;
    email: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    estado: string;
    roles: Rol[];
}