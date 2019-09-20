import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../shared/store.service';
import * as M from '../../app.models';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.less']
})
export class ImageViewComponent implements OnInit {

  constructor(private storeService: StoreService) { }

  selectedImage: M.Image;


  ngOnInit() {
    this.storeService.getSelectedImage()
      .subscribe(selectedImage => this.selectedImage = selectedImage);

  }
}
