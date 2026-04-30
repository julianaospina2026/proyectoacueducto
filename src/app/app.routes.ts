import { Routes } from '@angular/router';
import { ClienteComponent } from './cliente/clientes.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: HomeComponent },
    { path: 'clientes', component: ClienteComponent },
    { path: 'usuarios', component: UsuarioComponent },
    { path: '**', redirectTo: 'inicio' }
];