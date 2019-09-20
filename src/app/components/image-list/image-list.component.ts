import { Component, OnInit } from '@angular/core';
import * as M from '../../app.models';
import { ImageService } from '../../services/image/image.service';
import { StoreService } from '../../shared/store.service';

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
      console.log(list);
      this.imageList = list;
    });
  }

  showImage(selectedImage) {
    this.storeService.setSelectedImage(selectedImage);
  }
}
