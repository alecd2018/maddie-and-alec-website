import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPoke } from 'app/shared/model/poke.model';

@Component({
  selector: 'jhi-poke-detail',
  templateUrl: './poke-detail.component.html'
})
export class PokeDetailComponent implements OnInit {
  poke: IPoke;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ poke }) => {
      this.poke = poke;
    });
  }

  previousState() {
    window.history.back();
  }
}
