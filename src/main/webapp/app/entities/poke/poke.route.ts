import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Poke } from 'app/shared/model/poke.model';
import { PokeService } from './poke.service';
import { PokeComponent } from './poke.component';
import { PokeDetailComponent } from './poke-detail.component';
import { PokeUpdateComponent } from './poke-update.component';
import { PokeDeletePopupComponent } from './poke-delete-dialog.component';
import { IPoke } from 'app/shared/model/poke.model';

@Injectable({ providedIn: 'root' })
export class PokeResolve implements Resolve<IPoke> {
  constructor(private service: PokeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPoke> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Poke>) => response.ok),
        map((poke: HttpResponse<Poke>) => poke.body)
      );
    }
    return of(new Poke());
  }
}

export const pokeRoute: Routes = [
  {
    path: '',
    component: PokeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Pokes'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PokeDetailComponent,
    resolve: {
      poke: PokeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Pokes'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PokeUpdateComponent,
    resolve: {
      poke: PokeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Pokes'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PokeUpdateComponent,
    resolve: {
      poke: PokeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Pokes'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const pokePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PokeDeletePopupComponent,
    resolve: {
      poke: PokeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Pokes'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
