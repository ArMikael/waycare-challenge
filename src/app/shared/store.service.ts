import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as M from '../app.models';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() { }
  private selectedImage = new BehaviorSubject(null);

  getSelectedImage(): Observable<M.Image> {
    return this.selectedImage.asObservable();
  }

  setSelectedImage(newImage): void {
    this.selectedImage.next(newImage);
  }
}
