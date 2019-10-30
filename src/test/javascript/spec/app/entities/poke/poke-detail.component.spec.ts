import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AlecTestModule } from '../../../test.module';
import { PokeDetailComponent } from 'app/entities/poke/poke-detail.component';
import { Poke } from 'app/shared/model/poke.model';

describe('Component Tests', () => {
  describe('Poke Management Detail Component', () => {
    let comp: PokeDetailComponent;
    let fixture: ComponentFixture<PokeDetailComponent>;
    const route = ({ data: of({ poke: new Poke(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AlecTestModule],
        declarations: [PokeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PokeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PokeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.poke).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
