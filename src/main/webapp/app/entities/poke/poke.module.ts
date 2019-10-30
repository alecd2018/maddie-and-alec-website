import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AlecSharedModule } from 'app/shared/shared.module';
import { PokeComponent } from './poke.component';
import { PokeDetailComponent } from './poke-detail.component';
import { PokeUpdateComponent } from './poke-update.component';
import { PokeDeletePopupComponent, PokeDeleteDialogComponent } from './poke-delete-dialog.component';
import { pokeRoute, pokePopupRoute } from './poke.route';

const ENTITY_STATES = [...pokeRoute, ...pokePopupRoute];

@NgModule({
  imports: [AlecSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [PokeComponent, PokeDetailComponent, PokeUpdateComponent, PokeDeleteDialogComponent, PokeDeletePopupComponent],
  entryComponents: [PokeDeleteDialogComponent]
})
export class AlecPokeModule {}
