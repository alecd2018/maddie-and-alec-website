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
  pollPokes: any;
  alertMessage: string;

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

  updateTimes(timeVar, wait, typeID) {
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

  ngOnInit() {
    this.accountService.identity().then(account => {
      this.account = account;
    });
    this.loadAll();

    this.pollPokes = setInterval(() => {
      this.timeToHeart = this.updateTimes(this.currPoke.heartTime, 10, 'heart');
      this.timeToMail = this.updateTimes(this.currPoke.mailTime, 60 * 60 * 24 * 30, 'mail'); // every 30 days
      this.timeToMassage = this.updateTimes(this.currPoke.massageTime, 60 * 60 * 24 * 14, 'massage'); // every 14 days
    }, 500);
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
    clearInterval(this.pollPokes);
  }

  pokeClick(pokeType) {
    const time = Date.now();
    let pokeTypeMsg;
    if (pokeType === 'heart') {
      this.currPoke.heartTime = time.toString();
      pokeTypeMsg = 'Bother';
      this.alertMessage = 'Alec has been notified that you want to bother him.';
    } else if (pokeType === 'mail') {
      this.currPoke.mailTime = time.toString();
      pokeTypeMsg = 'Mail';
      this.alertMessage = 'Alec has been notified that you want mail.';
    } else {
      this.currPoke.massageTime = time.toString();
      pokeTypeMsg = 'Massage';
      this.alertMessage = 'Alec has been notified that you want a massage.';
    }

    this.homeService.send(pokeTypeMsg).subscribe(
      res => {
        $('#poke-success')
          .fadeIn()
          .delay(3000)
          .fadeOut();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );

    this.homeService.update(this.currPoke).subscribe(
      res => {
        // eslint-disable-next-line no-console
        console.log('Success');
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  protected onError(errorMessage: string) {
    $('#poke-failure')
      .fadeIn()
      .delay(3000)
      .fadeOut();
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
