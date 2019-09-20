import { Component, OnInit } from '@angular/core';
import * as M from '../../app.models';
import { ImageService } from '../../services/image/image.service';
import { StoreService } from '../../shared/store.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-images-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.less']
})
export class ImageListComponent implements OnInit {

  constructor(
    private imageService: ImageService,
    private storeService: StoreService
  ) { }

  imageList: M.Image[];

  ngOnInit() {
    this.imageService.getImageList()
      .subscribe((list: M.Image[]) => {
        this.imageList = list;
        this.watchImageHover();
      });
  }

  showImage(selectedImage): void {
    this.storeService.setSelectedImage(selectedImage);
  }

  watchImageHover() {
    const imageList$ = fromEvent(document, 'mousemove');

    imageList$
      .pipe(
        filter(event => event.target.className === 'image-list-image'),
        debounceTime(200),
        distinctUntilChanged((prev, curr) => prev.target === curr.target)
      )
      .subscribe((event: MouseEvent) => {
        console.log(event.target);
    });
  }
}
