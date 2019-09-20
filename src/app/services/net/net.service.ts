import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as M from '../../app.models';

@Injectable({
  providedIn: 'root'
})
export class NetService {

  constructor(private http: HttpClient) { }

  getImageList(): Observable<M.Image[]> {
    return this.http.get<M.Image[]>('https://picsum.photos/v2/list?limit=2000');
  }
}
