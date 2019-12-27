import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPoke } from 'app/shared/model/poke.model';
import { AccountService } from 'app/core/auth/account.service';
import { PokeService } from './poke.service';

@Component({
  selector: 'jhi-poke',
  templateUrl: './poke.component.html'
})
export class PokeComponent implements OnInit, OnDestroy {
  pokes: IPoke[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected pokeService: PokeService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.pokeService
      .query()
      .pipe(
        filter((res: HttpResponse<IPoke[]>) => res.ok),
        map((res: HttpResponse<IPoke[]>) => res.body)
      )
      .subscribe(
        (res: IPoke[]) => {
          this.pokes = res;
          // eslint-disable-next-line no-console
          console.log(this.pokes);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInPokes();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IPoke) {
    return item.id;
  }

  registerChangeInPokes() {
    this.eventSubscriber = this.eventManager.subscribe('pokeListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
