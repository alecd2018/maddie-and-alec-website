import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { LoginModalService } from 'app/core/login/login-modal.service';

import { AccountService } from 'app/core/auth/account.service';

import { LoginService } from 'app/core/login/login.service';
// import { StateStorageService } from 'app/core/auth/state-storage.service';

@Component({
  selector: 'jhi-gate',
  templateUrl: './gate.component.html',
  styleUrls: ['gate.scss']
})
export class GateComponent implements OnInit {
  currentAccount: any;
  eventSubscriber: Subscription;
  authenticationError: boolean;
  modalRef: NgbModalRef;

  loginForm = this.fb.group({
    username: [''],
    password: [''],
    rememberMe: [false]
  });

  constructor(
    // protected testService: TestService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService,
    private loginService: LoginService,
    private loginModalService: LoginModalService,
    // private stateStorageService: StateStorageService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // eslint-disable-next-line no-console
    console.log(this.isAuthenticated());
    // this.accountService.identity().then(account => {
    //   this.currentAccount = account;
    // });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  // ngOnDestroy() {
  //   this.eventManager.destroy(this.eventSubscriber);
  // }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  login() {
    this.modalRef = this.loginModalService.open();
  }

  // register() {
  //   this.activeModal.dismiss('to state register');
  //   this.router.navigate(['/account/register']);
  // }

  // requestResetPassword() {
  //   this.activeModal.dismiss('to state requestReset');
  //   this.router.navigate(['/account/reset', 'request']);
  // }
}
