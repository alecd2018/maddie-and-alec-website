import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'poke',
        loadChildren: () => import('./poke/poke.module').then(m => m.AlecPokeModule)
      },
      {
        path: 'event',
        loadChildren: () => import('./event/event.module').then(m => m.AlecEventModule)
      },
      {
        path: 'coupon',
        loadChildren: () => import('./coupon/coupon.module').then(m => m.AlecCouponModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class AlecEntityModule {}
