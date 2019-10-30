import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPoke } from 'app/shared/model/poke.model';
import { PokeService } from './poke.service';

@Component({
  selector: 'jhi-poke-delete-dialog',
  templateUrl: './poke-delete-dialog.component.html'
})
export class PokeDeleteDialogComponent {
  poke: IPoke;

  constructor(protected pokeService: PokeService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.pokeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'pokeListModification',
        content: 'Deleted an poke'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-poke-delete-popup',
  template: ''
})
export class PokeDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ poke }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(PokeDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.poke = poke;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/poke', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/poke', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
