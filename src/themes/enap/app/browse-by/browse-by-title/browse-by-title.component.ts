import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { BrowseByTitleComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-title/browse-by-title.component';
import { ThemedBrowseByComponent } from '../../../../../app/shared/browse-by/themed-browse-by.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';

@Component({
  selector: 'ds-browse-by-title',
  styleUrls: ['./browse-by-title.component.scss'],
  templateUrl: './browse-by-title.component.html',
  imports: [
    AsyncPipe,
    ThemedBrowseByComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class BrowseByTitleComponent extends BaseComponent {
}
