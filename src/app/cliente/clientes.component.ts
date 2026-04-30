import { Component, OnInit, inject } from '@angular/core';
import { ClienteService } from '../service/clientes.service';
import { Cliente } from '../model/clientes.model';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    Validators,
    ReactiveFormsModule,
    FormControl,
    FormsModule
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-cliente',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

    clientes: Cliente[] = [];
    cargando = false;
    error = '';
    mensaje = '';
    editandoId: number | null = null;

    filtroDocumento = new FormControl('', { nonNullable: true });

    private readonly fb = inject(FormBuilder);
    private readonly clienteService = inject(ClienteService);

    readonly form = this.fb.nonNullable.group({
        codigoCliente: ['', Validators.required],
        documento: ['', Validators.required],
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        direccion: [''],
        telefono: [''],
        email: ['', [Validators.email]],
        estrato: [1, [Validators.min(1), Validators.max(6)]],
        estado: ['ACTIVO']
    });

    constructor() { }

ngOnInit(): void {
    this.cargarClientes();
}

cargarClientes(): void {
    this.cargando = true;
    this.error = '';

    this.clienteService.listar().subscribe({
        next: (data) => {
        this.clientes = data.content || data;
        this.cargando = false;
},
error: (err: HttpErrorResponse) => {
        this.error = this.obtenerMensajeError(err, 'No se pudo listar clientes');
        this.cargando = false;
    }
    });
}

buscarPorDocumento(): void {
    const documento = this.filtroDocumento.value.trim();

    if (!documento) {
        this.cargarClientes();
        return;
    }

    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    this.clienteService.listar(undefined, documento).subscribe({
        next: (data) => {
        this.clientes = data.content || data;
        this.cargando = false;
    },
    error: (err: HttpErrorResponse) => {
        this.error = this.obtenerMensajeError(err, 'No se pudo buscar cliente por documento');
        this.clientes = [];
        this.cargando = false;
    }
    });
}

limpiarBusqueda(): void {
    this.filtroDocumento.setValue('');
    this.cargarClientes();
}

guardar(): void {
    if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
    }

    this.error = '';
    this.mensaje = '';
    const payload = this.form.getRawValue() as Cliente;

    if (this.editandoId !== null) {
        this.clienteService.actualizar(this.editandoId, payload).subscribe({
        next: () => {
            this.mensaje = 'Cliente actualizado correctamente';
            this.cancelarEdicion();
            this.cargarClientes();
        },
        error: (err: HttpErrorResponse) => {
            this.error = this.obtenerMensajeError(err, 'No se pudo actualizar el cliente');
        }
    });
    return;
    }

    this.clienteService.crear(payload).subscribe({
        next: () => {
        this.mensaje = 'Cliente creado correctamente';
        this.form.reset({
            codigoCliente: '',
            documento: '',
            nombre: '',
            apellido: '',
            direccion: '',
            telefono: '',
            email: '',
            estrato: 1,
            estado: 'ACTIVO'
        });
        this.cargarClientes();
    },
    error: (err: HttpErrorResponse) => {
        this.error = this.obtenerMensajeError(err, 'No se pudo crear cliente');
    }
    });
}

iniciarEdicion(cliente: Cliente): void {
    this.editandoId = cliente.id ?? null;

    this.form.patchValue({
        codigoCliente: cliente.codigoCliente,
        documento: cliente.documento,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        email: cliente.email,
        estrato: cliente.estrato
    });
}

cancelarEdicion(): void {
    this.editandoId = null;

    this.form.reset({
        codigoCliente: '',
        documento: '',
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        email: '',
        estrato: 1,
        estado: 'ACTIVO'
    });
}

eliminar(id: number | undefined): void {
    if (id === undefined) {
        console.error('ID no válido');
        return;
    }

    const confirmar = globalThis.confirm('¿Seguro que deseas eliminar este cliente?');
    if (!confirmar) {
        return;
    }

    this.error = '';
    this.mensaje = '';

    this.clienteService.desactivar(id).subscribe({
        next: () => {
        this.mensaje = 'Cliente eliminado correctamente';
        this.cargarClientes();
    },
    error: (err: HttpErrorResponse) => {
        this.error = this.obtenerMensajeError(err, 'No se pudo eliminar cliente');
    }
    });
}

private obtenerMensajeError(err: HttpErrorResponse, fallback: string): string {
    return err.error?.message || fallback;
}
}