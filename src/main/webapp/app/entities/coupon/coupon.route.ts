import { Routes } from '@angular/router'; // Resolve, ActivatedRouteSnapshot, RouterStateSnapshot,
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { CouponComponent } from './coupon.component';

export const couponRoute: Routes = [
  {
    path: '',
    component: CouponComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Coupons'
    },
    canActivate: [UserRouteAccessService]
  }
];
