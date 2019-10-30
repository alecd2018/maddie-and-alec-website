import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPoke } from 'app/shared/model/poke.model';

type EntityResponseType = HttpResponse<IPoke>;
type EntityArrayResponseType = HttpResponse<IPoke[]>;

@Injectable({ providedIn: 'root' })
export class Home {
  public resourceUrl = SERVER_API_URL + 'api/pokes';

  constructor(protected http: HttpClient) {}

  // create(poke: IPoke): Observable<EntityResponseType> {
  //   return this.http.post<IPoke>(this.resourceUrl, poke, { observe: 'response' });
  // }

  update(poke: IPoke): Observable<EntityResponseType> {
    return this.http.put<IPoke>(this.resourceUrl, poke, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPoke>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPoke[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
