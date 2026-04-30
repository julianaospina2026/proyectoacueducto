import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../model/clientes.model';
import { environment } from '../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private readonly baseUrl = `${environment.apiUrl}/clientes`;

    constructor(private http: HttpClient) {}

    listar(estado?: string, busqueda?: string, page: number = 0, size: number = 10): Observable<any> {
        let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

        if (estado) params = params.set('estado', estado);
        if (busqueda) params = params.set('busqueda', busqueda);

        return this.http.get<any>(this.baseUrl, { params });
    }

    obtenerPorId(id: number): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
    }

    crear(cliente: Cliente): Observable<Cliente> {
        return this.http.post<Cliente>(this.baseUrl, cliente);
    }

    actualizar(id: number, cliente: Cliente): Observable<Cliente> {
        return this.http.put<Cliente>(`${this.baseUrl}/${id}`, cliente);
    }

    cambiarEstado(id: number, estado: string): Observable<Cliente> {
        return this.http.patch<Cliente>(`${this.baseUrl}/${id}/estado`, null, {
            params: new HttpParams().set('estado', estado)
        });
    }

    desactivar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}