import {
  AsyncPipe,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Context } from '@dspace/core/shared/context.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';

import { listableObjectComponent } from '../../../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemSearchResultListElementComponent as BaseComponent } from '../../../../../../../../../app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { TruncatableComponent } from '../../../../../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement, Context.Any, 'enap')
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.Any, 'enap')
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html',
  imports: [
    AsyncPipe,
    NgClass,
    NgTemplateOutlet,
    RouterLink,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class ItemSearchResultListElementComponent extends BaseComponent implements OnInit {

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
    'repositório': '#007D7A',
    'repository': '#007D7A',
  };

  itemType: string;
  badgeColor: string;
  itemAuthor: string;
  itemLanguage: string;
  itemDate: string;
  itemPublisher: string;
  itemAbstract: string;
  itemSubjects: string[];

  override ngOnInit(): void {
    super.ngOnInit();
    this.itemType = this.dso?.firstMetadataValue('dc.type') || '';
    this.badgeColor = this.getBadgeColor(this.itemType);
    this.itemAuthor = this.dso?.firstMetadataValue('dc.contributor.author') || '';
    this.itemLanguage = this.dso?.firstMetadataValue('dc.language.iso') || '';
    this.itemDate = this.dso?.firstMetadataValue('dc.date.issued') || '';
    this.itemPublisher = this.dso?.firstMetadataValue('dc.publisher') || '';
    this.itemAbstract = this.dso?.firstMetadataValue('dc.description.abstract') || '';
    this.itemSubjects = this.allMetadataValues(['dc.subject']) || [];
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
}
