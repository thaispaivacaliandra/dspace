import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DSpaceObjectType } from '@dspace/core/shared/dspace-object-type.model';
import { Item } from '@dspace/core/shared/item.model';
import { toDSpaceObjectListRD } from '@dspace/core/shared/operators';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { TranslateModule } from '@ngx-translate/core';

import { RecentItemListComponent as BaseComponent } from '../../../../../app/home-page/recent-item-list/recent-item-list.component';
import { ErrorComponent } from '../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { SearchService } from '../../../../../app/shared/search/search.service';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';

@Component({
  selector: 'ds-enap-recent-item-list',
  templateUrl: './recent-item-list.component.html',
  styleUrls: ['./recent-item-list.component.scss'],
  imports: [
    AsyncPipe,
    ErrorComponent,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class RecentItemListComponent extends BaseComponent implements OnInit {
  private searchServiceLocal = inject(SearchService);

  private badgeColors: Record<string, string> = {
    'artigo': '#007D7A',
    'article': '#007D7A',
    'tcc': '#E8654A',
    'trabalho de conclusão': '#E8654A',
    'dissertação': '#8B5CF6',
    'dissertation': '#8B5CF6',
    'tese': '#8B5CF6',
    'thesis': '#8B5CF6',
    'relatório': '#F59E0B',
    'report': '#F59E0B',
    'livro': '#3B82F6',
    'book': '#3B82F6',
    'caso': '#10B981',
    'case': '#10B981',
    'vídeo': '#EC4899',
    'video': '#EC4899',
  };

  getItemRoute(item: Item): string {
    return getItemPageRoute(item);
  }

  getItemType(item: Item): string {
    return item?.firstMetadataValue('dc.type') || '';
  }

  getItemAuthor(item: Item): string {
    return item?.firstMetadataValue('dc.contributor.author') || '';
  }

  getBadgeColor(type: string): string {
    const key = type?.toLowerCase() || '';
    for (const [keyword, color] of Object.entries(this.badgeColors)) {
      if (key.includes(keyword)) {
        return color;
      }
    }
    return '#007D7A';
  }

  override ngOnInit(): void {
    this.paginationConfig.pageSize = 10;

    this.itemRD$ = this.searchServiceLocal.search(
      new PaginatedSearchOptions({
        pagination: this.paginationConfig,
        dsoTypes: [DSpaceObjectType.ITEM],
        sort: this.sortConfig,
      }),
    ).pipe(
      toDSpaceObjectListRD(),
    ) as any;
  }
}
