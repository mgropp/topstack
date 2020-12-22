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

    if (this.contentUris.includes(contentUri)) {
      return;
    }

    this.contentUris = [
      ...this.contentUris,
      contentUri
    ];
  }

  public addContentFromUrl(contentUrl: string): void {
    const argPos = contentUrl.indexOf('?');
    if (argPos >= 0) {
      contentUrl = contentUrl.substring(0, argPos);
    }

    const split = contentUrl.split('/');
    if (
      (split.length != 5) ||
      (split[0] != 'http:' && split[0] != 'https:') ||
      (split[1] != '') ||
      (split[2] != 'open.spotify.com') ||
      (split[3] != 'album' && split[3] != 'playlist')
    ) {
      throw new Error(`Unrecognized Spotify URL: ${contentUrl}`);
    }
    const id = split.pop();
    const type = split.pop();
    const uri = `spotify:${type}:${id}`;
    this.addContent(uri);
  }

  public removeContent(contentUri: string): void {
    this.contentUris = this.contentUris.filter(x => x != contentUri);
    console.log('new content uris:', this.contentUris);
  }
}
