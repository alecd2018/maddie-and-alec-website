import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { AlecTestModule } from '../../../test.module';
import { PokeUpdateComponent } from 'app/entities/poke/poke-update.component';
import { PokeService } from 'app/entities/poke/poke.service';
import { Poke } from 'app/shared/model/poke.model';

describe('Component Tests', () => {
  describe('Poke Management Update Component', () => {
    let comp: PokeUpdateComponent;
    let fixture: ComponentFixture<PokeUpdateComponent>;
    let service: PokeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AlecTestModule],
        declarations: [PokeUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PokeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PokeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PokeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Poke(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Poke();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
