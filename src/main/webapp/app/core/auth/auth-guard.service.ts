import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(public accountService: AccountService, public router: Router) {}

  canActivate(): boolean {
    if (!this.accountService.isAuthenticated()) {
      this.router.navigate(['account/gate']);
      return false;
    }

    return true;
  }
}
