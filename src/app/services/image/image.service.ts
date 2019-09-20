import { Injectable } from '@angular/core';
import { NetService } from '../net/net.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as M from '../../app.models';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private netService: NetService) { }
  thumbnailWidth = 200;
  thumbnailHeight = 100;

  getImageList(): Observable<M.Image[]> {
    return this.netService.getImageList()
      .pipe(
        map((imageList: M.Image[]) => {
          imageList.map((image: any) => {
            const url = image.download_url.split('/');
            url.splice(url.length - 2, 2);
            image.thumbnail = `${url.join('/')}/${this.thumbnailWidth}/${this.thumbnailHeight}`;
            return image;
          });
          return imageList;
        })
      );
  }
}
