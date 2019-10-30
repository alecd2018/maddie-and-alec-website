import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { IPoke } from 'app/shared/model/poke.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { Home } from './home.service';

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
  timeToMassage: any;
  hideHeartTime: boolean;

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private eventManager: JhiEventManager,
    protected jhiAlertService: JhiAlertService,
    private homeService: Home
  ) {}

  loadAll() {
    this.homeService
      .query()
      .pipe(
        filter((res: HttpResponse<IPoke[]>) => res.ok),
        map((res: HttpResponse<IPoke[]>) => res.body)
      )
      .subscribe(
        (res: IPoke[]) => {
          this.pokes = res;
          this.currPoke = this.pokes[0];
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    // const loggedIn = this.isAuthenticated();
    // if (loggedIn){
    //   //eslint-disable-next-line no-console
    //   console.log("Hey there.");
    this.accountService.identity().then(account => {
      this.account = account;
    });
    //   this.activatePolling();
    // }

    // setInterval(() => {

    //   const prevCheck = loggedIn;
    //   loggedIn = this.isAuthenticated();

    //   if (loggedIn && (loggedIn !== prevCheck)){
    //     this.accountService.identity().then(account => {
    //       this.account = account;
    //     });
    //     this.loadAll()
    //     this.activatePolling(true);
    //   } else if (!loggedIn && (loggedIn !== prevCheck)){
    //     this.activatePolling(false);
    //   }

    // eslint-disable-next-line no-console
    // console.log(k);
    // },1000);
  }

  activatePolling() {
    function updateTimes(timeVar, wait, typeID) {
      const start = parseInt(timeVar, 10);
      const timeLeft = start + 1000 * wait;
      const distance = timeLeft - Date.now();

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        (document.getElementById(typeID + 'Button') as HTMLInputElement).disabled = false;
        document.getElementById(typeID + 'Timer').style.display = 'none';
        return 0;
      } else {
        (document.getElementById(typeID + 'Button') as HTMLInputElement).disabled = true;
        document.getElementById(typeID + 'Timer').style.display = 'block';
        return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
      }
    }

    // setInterval(() => {
    //   this.timeToHeart = updateTimes(this.currPoke.heartTime, 10, "heart");
    // }, 1000);

    // setInterval(() => {
    //   this.timeToMail = updateTimes(this.currPoke.mailTime, 15, "mail");
    // }, 1000);

    // setInterval(() => {
    //   this.timeToMassage = updateTimes(this.currPoke.massageTime, 20, "massage");
    // }, 1000);
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

  pokeClick(pokeType) {
    const time = Date.now();
    if (pokeType === 'heart') {
      this.currPoke.heartTime = time.toString();
    } else if (pokeType === 'mail') {
      this.currPoke.mailTime = time.toString();
    } else {
      this.currPoke.massageTime = time.toString();
    }

    this.homeService.update(this.currPoke).subscribe();
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
