export interface Image {
  id: number;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
  thumbnail?: string;
  isFavorite?: boolean;
}
