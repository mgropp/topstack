import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor() { }

  @LocalStorage('contentUris', [])
  public contentUris: Array<string>;

  public addContent(contentUri: string): void {
    if (
      !contentUri.startsWith('spotify:album:') &&
      !contentUri.startsWith('spotify:playlist:')
    ) {
      throw new Error(`Unsupported content URI: ${contentUri}`);
    }

    this.contentUris = [
      ...this.contentUris,
      contentUri
    ];
  }
}
