import { Injectable } from '@angular/core';
import { Generic, SalteAuth } from '@salte-auth/salte-auth';
import { Redirect } from '@salte-auth/redirect';
import SpotifyWebApi from 'spotify-web-api-js';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private spotifyApi: SpotifyWebApi.SpotifyWebApiJs;

  constructor() {
    this.spotifyApi = new SpotifyWebApi();
    const accessToken = this.getAccessToken();
    if (accessToken) {
      this.spotifyApi.setAccessToken(accessToken);
    } else {
      console.log('No spotify access token found, logging in.');
      this.login();
    }
  }

  public getAccessToken(): string|undefined {
    const parameters = window.location.hash.substr(1).split('&').reduce(
      (res, item) => {
        const parts = item.split('=');
        res[parts[0]] = parts[1];
        return res;
      },
      {}
    );

    return parameters['access_token'];
  }

  public login(): void {
    const auth = new SalteAuth({
      providers: [
        new Generic.OAuth2({
          login() {
            return 'https://accounts.spotify.com/authorize';
          },
          url: 'https://accounts.spotify.com',
          responseType: 'token',
          scope: 'user-library-read streaming',
          clientID: '87d138c818ef487d84fa1ea91667d21a' // TODO
        })
      ],
      handlers: [
        new Redirect({
          default: true
        })
      ]
    });

    auth.login('generic.oauth2');
  }

  public getApi(): SpotifyWebApi.SpotifyWebApiJs {
    return this.spotifyApi;
  }

  public getContent(contentUri: string): Promise<SpotifyApi.SingleAlbumResponse|SpotifyApi.SinglePlaylistResponse> {
    if (contentUri.startsWith('spotify:album:')) {
      const albumId = contentUri.substring(14);
      return this.getAlbum(albumId);
    } else if (contentUri.startsWith('spotify:playlist:')) {
      const playlistId = contentUri.substring(17);
      return this.getPlaylist(playlistId);
    } else {
      throw new Error(`Unsupported URI: ${contentUri}`);
    }
  }

  public getAlbum(albumId: string): Promise<SpotifyApi.SingleAlbumResponse> {
    return new Promise((resolve, reject) => {
      this.spotifyApi.getAlbum(albumId)
        .then(resolve)
        .catch(
          (error) => {
            console.error(error);
            if (error.status == 401) {
              console.log('Unauthorized, logging in.');
              this.login();
            }
            reject(error);
          }
        )
    });
  }

  public getPlaylist(playlistId: string): Promise<SpotifyApi.SinglePlaylistResponse> {
    return new Promise((resolve, reject) => {
      this.spotifyApi.getPlaylist(playlistId)
        .then(resolve)
        .catch(
          (error) => {
            console.error(error);
            if (error.status == 401) {
              console.log('Unauthorized, logging in.');
              this.login();
            }
            reject(error);
          }
        )
    });
  }

  public play(options?: SpotifyApi.PlayParameterObject): Promise<void> {
    return new Promise((resolve, reject) => {
      this.spotifyApi.play(options)
        .then(resolve)
        .catch(
          (error) => {
            console.error(error);
            if (error.status == 401) {
              console.log('Unauthorized, logging in.');
              this.login();
            }
            reject(error);
          }
        )
    });
  }

  public handleError(error: any): void {
    console.error('Spotify error:', error);
    try {
      if (error.response) {
        const response = JSON.parse(error.response);
        if (response.error && response.error.message) {
          alert(response.error.message);
        }
      }
    }
    catch(e) {
      console.error('Error while handling error response:', e);
      alert('Error while handling error response! Oops...');
    }
  }

}
