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
        this.watchTripleClick();
      });
  }

  showImage(selectedImage): void {
    this.storeService.setSelectedImage(selectedImage);
  }

  watchImageHover() {
    const imageList$ = fromEvent(document, 'mousemove');

    imageList$
      .pipe(
        filter((event: MouseEvent) => {
          const el = event.target as HTMLElement;
          return el.classList.contains('image-list-image');
        }),
        debounceTime(200),
        distinctUntilChanged((prev, curr) => prev.target === curr.target)
      )
      .subscribe((event: MouseEvent) => {
        console.log(event.target);
    });
  }

  watchTripleClick() {
    const imageList$ = fromEvent(document.getElementById('imageList'), 'click');

    imageList$.subscribe((event: MouseEvent|any) => {
      if (event.detail === 3) {
        event.target.classList += ' favorite-image';
      }
    });
  }
}
