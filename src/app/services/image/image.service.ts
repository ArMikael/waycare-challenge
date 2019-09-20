import { Injectable } from '@angular/core';
import { NetService } from '../net/net.service';
import { Observable } from 'rxjs';
import * as M from '../../app.models';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private netService: NetService) { }

  getImageList(): Observable<M.Image[]> {
    return this.netService.getImageList();
  }
}
