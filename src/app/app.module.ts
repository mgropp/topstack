import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AlbumComponent } from './components/album/album.component';
import { ContentListComponent } from './components/content-list/content-list.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ContentAddComponent } from './components/content-add/content-add.component';

@NgModule({
  declarations: [
    AppComponent,
    AlbumComponent,
    ContentListComponent,
    ContentAddComponent
  ],
  imports: [
    BrowserModule,
    NgxWebstorageModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
