// import { Injectable } from '@angular/core';
// import { HttpResponse } from '@angular/common/http';
import { Routes } from '@angular/router'; // Resolve, ActivatedRouteSnapshot, RouterStateSnapshot,
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
// import { Observable, of } from 'rxjs';
// import { filter, map } from 'rxjs/operators';
// import { Coupon } from 'app/shared/model/coupon.model';
// import { CouponService } from './coupon.service';
import { CouponComponent } from './coupon.component';
// import { ICoupon } from 'app/shared/model/coupon.model';

// @Injectable({ providedIn: 'root' })
// export class CouponResolve implements Resolve<ICoupon> {
//   constructor(private service: CouponService) {}

//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICoupon> {
//     const id = route.params['id'];
//     if (id) {
//       return this.service.find(id).pipe(
//         filter((response: HttpResponse<Coupon>) => response.ok),
//         map((coupon: HttpResponse<Coupon>) => coupon.body)
//       );
//     }
//     return of(new Coupon());
//   }
// }

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
