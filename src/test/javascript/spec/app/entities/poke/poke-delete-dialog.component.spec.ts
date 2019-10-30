import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { AlecTestModule } from '../../../test.module';
import { PokeDeleteDialogComponent } from 'app/entities/poke/poke-delete-dialog.component';
import { PokeService } from 'app/entities/poke/poke.service';

describe('Component Tests', () => {
  describe('Poke Management Delete Component', () => {
    let comp: PokeDeleteDialogComponent;
    let fixture: ComponentFixture<PokeDeleteDialogComponent>;
    let service: PokeService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AlecTestModule],
        declarations: [PokeDeleteDialogComponent]
      })
        .overrideTemplate(PokeDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PokeDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PokeService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
