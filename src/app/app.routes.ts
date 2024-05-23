import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ContratosComponent } from './pages/contratos/contratos.component';
import { PagosComponent } from './pages/pagos/pagos.component';
import { ObituariosComponent } from './pages/obituarios/obituarios.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RecuperarComponent } from './pages/recuperar/recuperar.component';
import { TokenComponent } from './pages/recuperar/token/token.component';
import { AuthGuard } from './guards/auth.guard';
import { PrimerintentoComponent } from './pages/login/primerintento/primerintento.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { NotFoudComponent } from './pages/not-foud/not-foud.component';

export const routes: Routes = [
    {
    path: '', component: MainPageComponent, children:[
      {
        path: '', component: ContratosComponent
      },
      {
        path: 'contratos', component: ContratosComponent
      },
      {
        path: 'obituario', component: ObituariosComponent
      },
      {
        path: 'pagos', component: PagosComponent
      },
      {
        path: 'user/perfil', component: PerfilComponent,
      },
    ],
    canActivate:[AuthGuard],
  },
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'login/primer-intento', component: PrimerintentoComponent,
  },
  {
    path: 'recuperar', component: RecuperarComponent
  },
  {
    path: 'recuperar/:token', component: TokenComponent,
  },
  { path: 'not-found', component: NotFoudComponent },

];
