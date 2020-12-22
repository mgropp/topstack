import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/content/content.service';

@Component({
  selector: 'app-content-add',
  templateUrl: './content-add.component.html',
  styleUrls: ['./content-add.component.scss']
})
export class ContentAddComponent implements OnInit {

  constructor(public contentService: ContentService) { }

  ngOnInit(): void {
  }

  public addContent() {
    try {
      const content = prompt('Enter a Spotify content URI (e.g. spotify:album:0aOupcoxV0EXjLfoHXqb2o) or URL (e.g. https://open.spotify.com/playlist/7yav381wuvVrg1hhEzUhYe):');
      if (content) {
        if (content.startsWith('spotify:')) {
          this.contentService.addContent(content);
        } else if (
          content.startsWith('https://open.spotify.com/') ||
          content.startsWith('http://open.spotify.com/')
        ) {
          this.contentService.addContentFromUrl(content);
        }
      }
    }
    catch (e) {
      console.error(e);
      alert(e);
    }
  }
}
