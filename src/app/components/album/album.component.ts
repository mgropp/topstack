import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/content/content.service';
import { SpotifyService } from '../../services/spotify/spotify.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  @Input()
  public contentUri: string;

  public coverUrl: string|undefined;
  public artists: string|undefined;
  public title: string|undefined;

  constructor(
    private spotify: SpotifyService,
    private contentService: ContentService
  ) {
  }

  ngOnInit(): void {
    if (this.contentUri) {
      this.spotify.getContent(this.contentUri)
        .then(
          (content) => {
            console.log(content);
            // TODO: choose best image size
            this.coverUrl = content.images[0].url;
            if ('artists' in content) {
              this.artists = content.artists.map((artist) => artist.name).join();
            } else {
              this.artists = undefined;
            }
            this.title = content.name;
          }
        )
        .catch(this.spotify.handleError);
    }
  }

  public playClicked(): void {
    this.spotify.play({
      context_uri: this.contentUri
    })
      .catch(this.spotify.handleError);
  }

  public removeClicked(): void {
    var name = '';
    if (this.artists) {
      name += this.artists + ': ';
    }
    name += this.title;

    if (confirm(`Are you sure you want to remove ${name}?`)) {
      this.contentService.removeContent(this.contentUri);
    }
  }
}
