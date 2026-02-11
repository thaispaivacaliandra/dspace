import { AsyncPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BrowseEntry } from '@dspace/core/shared/browse-entry.model';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { BrowseByMetadataComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-metadata/browse-by-metadata.component';
import { ThemedBrowseByComponent } from '../../../../../app/shared/browse-by/themed-browse-by.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { PaginationComponent } from '../../../../../app/shared/pagination/pagination.component';

@Component({
  selector: 'ds-browse-by-metadata',
  styleUrls: ['./browse-by-metadata.component.scss'],
  templateUrl: './browse-by-metadata.component.html',
  imports: [
    AsyncPipe,
    FormsModule,
    NgbDropdownModule,
    NgClass,
    PaginationComponent,
    RouterLink,
    ThemedBrowseByComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class BrowseByMetadataComponent extends BaseComponent {
  searchText = '';

  getEntryQueryParams(entry: BrowseEntry): Record<string, string | undefined> {
    return {
      value: entry.value,
      authority: entry.authority || undefined,
    };
  }

  getEntryIcon(): string {
    switch (this.browseId) {
      case 'author':
        return 'fa-user';
      case 'title':
        return 'fa-heading';
      case 'subject':
        return 'fa-tag';
      case 'subjectcategory':
        return 'fa-tags';
      case 'dateissued':
        return 'fa-calendar-alt';
      default:
        return 'fa-folder';
    }
  }

  onSearchSubmit(): void {
    const term = this.searchText.trim();
    if (term) {
      this.router.navigate([], {
        queryParams: { startsWith: term },
        queryParamsHandling: 'merge',
      });
    }
  }

  onClearFilter(): void {
    this.searchText = '';
    this.router.navigate([], {
      queryParams: { startsWith: null },
      queryParamsHandling: 'merge',
    });
  }
}
