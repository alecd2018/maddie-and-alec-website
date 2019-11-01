import { Routes } from '@angular/router';
import { GateComponent } from './gate.component';

export const gateRoute: Routes = [
  {
    path: 'gate',
    component: GateComponent,
    data: {
      authorities: [],
      pageTitle: 'Gate'
    }
  }
];
