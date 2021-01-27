import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { IPoke } from 'app/shared/model/poke.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  pokes: IPoke[];
  currPoke: IPoke;
  account: Account;
  modalRef: NgbModalRef;
  authSubscription: Subscription;
  success: boolean;
  timeToHeart: any;
  timeToMail: any;
  timeToVaca: any;
  hideHeartTime: boolean;
  pollPokes: any;
  alertMessage: string;

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private eventManager: JhiEventManager,
    protected jhiAlertService: JhiAlertService
  ) {}

  ngOnInit() {
    this.accountService.identity().then(account => {
      this.account = account;
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  login() {
    this.modalRef = this.loginModalService.open();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.eventManager.destroy(this.authSubscription);
    }
  }
}
