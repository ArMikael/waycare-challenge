import { Component, OnInit } from '@angular/core';
import * as M from '../../app.models';
import { ImageService } from '../../services/image/image.service';
import { StoreService } from '../../shared/store.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

const favoritesKey = 'favoriteImages';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.less']
})
export class ImageListComponent implements OnInit {

  constructor(
    private imageService: ImageService,
    private storeService: StoreService,
  ) { }

  imageList: M.Image[];
  favoriteImages: string[];

  ngOnInit() {
    this.favoriteImages = [];

    this.imageService.getImageList()
      .subscribe((list: M.Image[]) => {
        this.imageList = list;

        this.getFavoriteImages();
        this.watchImageHover();
        this.watchTripleClick();
      });
  }

  showImage(selectedImage): void {
    this.storeService.setSelectedImage(selectedImage);
  }

  getFavoriteImages() {
    const localFavImages = JSON.parse(localStorage.getItem(favoritesKey));

    if (localFavImages) {
      this.favoriteImages = localFavImages;
      this.setFavoriteImages();
    }
  }

  setFavoriteImages() {
    this.favoriteImages.map(id => {
      const imageDetails = this.imageList.find(image => image.id === id);
      imageDetails.isFavorite = true;
      return imageDetails;
    });
  }

  addToFavorites(imageId) {
    const isImageFav = this.favoriteImages.find(id => id === imageId);
    if (isImageFav) { return; }

    this.favoriteImages.push(imageId);

    localStorage.setItem(favoritesKey, JSON.stringify(this.favoriteImages));
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
        this.addToFavorites(event.target.id);
      }
    });
  }
}
