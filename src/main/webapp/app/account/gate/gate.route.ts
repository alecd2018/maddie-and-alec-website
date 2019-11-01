import { Route } from '@angular/router';

import { GateComponent } from './gate.component';

export const gateRoute: Route = {
  path: 'gate',
  component: GateComponent,
  data: {
    authorities: [],
    pageTitle: 'Gate'
  }
};
