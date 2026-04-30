import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { UsuarioService } from '../service/usuario.service';
import { RolService } from '../service/rol.service';

import { Usuario } from '../model/usuario.model';
import { Rol } from '../model/rol.model';

@Component({
    selector: 'app-usuario',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './usuario.component.html',
    styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit {

    readonly estados = ['ACTIVO', 'INACTIVO'];

    usuarios: Usuario[] = [];
    rolesDisponibles: Rol[] = [];

    filtroUsername = new FormControl('', { nonNullable: true });

    cargando = false;
    error: string | null = null;
    mensaje: string | null = null;
    editandoId: number | null = null;

    form: any;

    constructor(
        private usuarioService: UsuarioService,
        private rolService: RolService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            username: ['', Validators.required],
            passwordHash: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            nombres: ['', Validators.required],
            apellidos: ['', Validators.required],
            telefono: ['', Validators.required],
            estado: ['ACTIVO', Validators.required],
            roles: [[], Validators.required]
        });

        this.cargarUsuarios();
        this.cargarRoles();
    }

    cargarUsuarios(): void {
        this.cargando = true;
        this.usuarioService.listar().subscribe({
            next: (data) => {
                this.usuarios = data;
                this.cargando = false;
            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'No se pudieron cargar los usuarios');
                this.cargando = false;
            }
        });
    }

    cargarRoles(): void {
        this.rolService.listar().subscribe({
            next: (data) => {
                this.rolesDisponibles = data;
            },
            error: (err) => {
                console.error('Error cargando roles', err);
            }
        });
    }

    buscarPorUsername(): void {
        const username = this.filtroUsername.value.trim();

        if (!username) {
            this.cargarUsuarios();
            return;
        }

        this.usuarioService.buscarPorUsername(username).subscribe({
            next: (usuario) => {
                this.usuarios = [usuario];
            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'Usuario no encontrado');
                this.usuarios = [];
            }
        });
    }

    limpiarBusqueda(): void {
        this.filtroUsername.setValue('');
        this.cargarUsuarios();
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const rolesSeleccionados = this.rolesDisponibles.filter(rol =>
            this.form.value.roles.includes(rol.id)
        );

        const payload: Usuario = {
            ...this.form.getRawValue(),
            roles: rolesSeleccionados
        };

        if (this.editandoId !== null) {
            this.usuarioService.actualizar(this.editandoId, payload).subscribe({
                next: () => {
                    this.mensaje = 'Usuario actualizado correctamente';
                    this.cancelarEdicion();
                    this.cargarUsuarios();
                },
                error: (err: HttpErrorResponse) => {
                    this.error = this.obtenerMensajeError(err, 'No se pudo actualizar');
                }
            });
            return;
        }

        this.usuarioService.crear(payload).subscribe({
            next: () => {
                this.mensaje = 'Usuario creado correctamente';
                this.cancelarEdicion();
                this.cargarUsuarios();
            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'No se pudo crear');
            }
        });
    }

    iniciarEdicion(usuario: Usuario): void {
        this.editandoId = usuario.id ?? null;

        this.form.patchValue({
            username: usuario.username,
            passwordHash: usuario.passwordHash,
            email: usuario.email,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            telefono: usuario.telefono,
            estado: usuario.estado,
            roles: usuario.roles.map(r => r.id)
        });
    }

    cancelarEdicion(): void {
        this.editandoId = null;

        this.form.reset({
            username: '',
            passwordHash: '',
            email: '',
            nombres: '',
            apellidos: '',
            telefono: '',
            estado: 'ACTIVO',
            roles: []
        });
    }

    eliminar(id: number | undefined): void {
        if (!id) return;

        if (!globalThis.confirm('¿Seguro que deseas eliminar este usuario?')) {
            return;
        }

        this.usuarioService.eliminar(id).subscribe({
            next: () => {
                this.mensaje = 'Usuario eliminado correctamente';
                this.cargarUsuarios();
            },
            error: (err: HttpErrorResponse) => {
                this.error = this.obtenerMensajeError(err, 'No se pudo eliminar');
            }
        });
    }

    private obtenerMensajeError(err: HttpErrorResponse, mensajeDefault: string): string {
        return err.error?.mensaje || err.message || mensajeDefault;
    }
}