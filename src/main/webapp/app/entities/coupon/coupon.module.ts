import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AlecSharedModule } from 'app/shared/shared.module';
import { CouponComponent } from './coupon.component';
import { couponRoute } from './coupon.route';

const ENTITY_STATES = [...couponRoute];

@NgModule({
  imports: [AlecSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [CouponComponent]
})
export class AlecCouponModule {}
