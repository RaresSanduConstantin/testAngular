import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentsComponent } from './components/payments/payments.component';
import { HomeComponent } from './components/home/home.component';

// in array-ul Routes setam path-ul si componentele pe care le afisam, path este folosit in routerLink pentru a naviga catre componenta specificata
const routes: Routes = [
  { path: 'paymant', component: PaymentsComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
