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
    const contentUri = prompt('Enter a Spotify content URI (e.g. spotify:album:0aOupcoxV0EXjLfoHXqb2o):');
    if (contentUri) {
      this.contentService.addContent(contentUri);
    }
  }
}
