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
  filteredList: M.Image[];
  favoriteImages: string[];
  isFavoritesShowed: boolean;

  ngOnInit() {
    this.favoriteImages = [];
    this.isFavoritesShowed = false;

    this.imageService.getImageList()
      .subscribe((list: M.Image[]) => {
        this.imageList = list;
        this.filteredList = list;

        this.getFavoriteImages();
        this.watchImageHover();
        this.watchTripleClick();
      });
  }

  showImage(selectedImage): void {
    this.storeService.setSelectedImage(selectedImage);
  }

  toggleImageListView() {
    this.isFavoritesShowed = !this.isFavoritesShowed;

    this.filteredList = this.isFavoritesShowed ? this.imageList.filter(image => image.isFavorite === true)
      : this.imageList;
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
    this.imageList.map(image => {
      if (image.id === imageId) {
        image.isFavorite = true;
      }
    });

    localStorage.setItem(favoritesKey, JSON.stringify(this.favoriteImages));
  }

  watchImageHover() {
    const imageListHover$ = fromEvent(document.getElementById('imageList'), 'mousemove');

    imageListHover$.pipe(
        filter((event: MouseEvent) => {
          const el = event.target as HTMLElement;
          return el.classList.contains('image-list-image');
        }),
        debounceTime(200),
        distinctUntilChanged((prev, curr) => prev.target === curr.target)
      )
      .subscribe((event: MouseEvent) => console.log(event.target));
  }

  watchTripleClick() {
    const imageListClick$ = fromEvent(document.getElementById('imageList'), 'click');

    imageListClick$.subscribe((event: MouseEvent) => {
      if (event.detail === 3) {
        const target = event.target as HTMLElement;
        this.addToFavorites(target.id);
      }
    });
  }
}
