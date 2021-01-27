import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICoupon } from 'app/shared/model/coupon.model';
import { IPoke } from 'app/shared/model/poke.model';
import { AccountService } from 'app/core/auth/account.service';
import { CouponService } from './coupon.service';

@Component({
  selector: 'jhi-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['coupon.scss']
})
export class CouponComponent implements OnInit, OnDestroy {
  coupons: ICoupon[];
  currentAccount: any;
  eventSubscriber: Subscription;
  pokes: IPoke[];
  currPoke: IPoke;
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
    private eventManager: JhiEventManager,
    protected jhiAlertService: JhiAlertService,
    private homeService: CouponService
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
          // eslint-disable-next-line no-console
          console.log(this.currPoke);
        },
        (res: HttpErrorResponse) => {
          this.onError(res.message);
        }
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
    this.loadAll();

    this.pollPokes = setInterval(() => {
      this.timeToHeart = this.updateTimes(this.currPoke.heartTime, 10, 'heart');
      this.timeToMail = this.updateTimes(this.currPoke.mailTime, 60 * 60 * 24 * 30, 'mail'); // every 30 days
      this.timeToVaca = this.updateTimes(this.currPoke.vacaTime, 60 * 60 * 24 * 120, 'vaca'); // every 4 months
    }, 500);
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
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
      this.currPoke.vacaTime = time.toString();
      pokeTypeMsg = 'Vaca';
      this.alertMessage = 'Alec has been notified that you want a vacation.';
    }

    this.homeService.send(pokeTypeMsg).subscribe(
      res => {
        $('#poke-success')
          .fadeIn()
          .delay(4000)
          .fadeOut();
        // eslint-disable-next-line no-console
        console.log(res);
        this.homeService.update(this.currPoke).subscribe(
          upRes => {
            // eslint-disable-next-line no-console
            console.log('Success');
          },
          (upRes: HttpErrorResponse) => this.onError(upRes.message)
        );
      },
      (res: HttpErrorResponse) => {
        // eslint-disable-next-line no-console
        console.log(res.message);
        this.onError(res.message);
      }
    );
  }

  protected onError(errorMessage: string) {
    $('#poke-failure')
      .fadeIn()
      .delay(4000)
      .fadeOut();
    this.jhiAlertService.error(errorMessage, null, null);
    // eslint-disable-next-line no-console
    console.log(errorMessage);
  }
}
