import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { AlecTestModule } from '../../../test.module';
import { PokeComponent } from 'app/entities/poke/poke.component';
import { PokeService } from 'app/entities/poke/poke.service';
import { Poke } from 'app/shared/model/poke.model';

describe('Component Tests', () => {
  describe('Poke Management Component', () => {
    let comp: PokeComponent;
    let fixture: ComponentFixture<PokeComponent>;
    let service: PokeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AlecTestModule],
        declarations: [PokeComponent],
        providers: []
      })
        .overrideTemplate(PokeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PokeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PokeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Poke(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.pokes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
