import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IPoke, Poke } from 'app/shared/model/poke.model';
import { PokeService } from './poke.service';

@Component({
  selector: 'jhi-poke-update',
  templateUrl: './poke-update.component.html'
})
export class PokeUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    heartTime: [],
    mailTime: [],
    vacaTime: []
  });

  constructor(protected pokeService: PokeService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ poke }) => {
      this.updateForm(poke);
    });
  }

  updateForm(poke: IPoke) {
    this.editForm.patchValue({
      id: poke.id,
      heartTime: poke.heartTime,
      mailTime: poke.mailTime,
      vacaTime: poke.vacaTime
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const poke = this.createFromForm();
    if (poke.id !== undefined) {
      this.subscribeToSaveResponse(this.pokeService.update(poke));
    } else {
      this.subscribeToSaveResponse(this.pokeService.create(poke));
    }
  }

  private createFromForm(): IPoke {
    return {
      ...new Poke(),
      id: this.editForm.get(['id']).value,
      heartTime: this.editForm.get(['heartTime']).value,
      mailTime: this.editForm.get(['mailTime']).value,
      vacaTime: this.editForm.get(['vacaTime']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPoke>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
