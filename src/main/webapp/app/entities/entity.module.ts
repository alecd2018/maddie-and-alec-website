import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GateComponent } from './gate/gate.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'poke',
        loadChildren: () => import('./poke/poke.module').then(m => m.AlecPokeModule)
      },
      {
        path: 'gate',
        loadChildren: () => import('./gate/gate.module').then(m => m.AlecGateModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [GateComponent]
})
export class AlecEntityModule {}
