import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DSpaceObjectType } from '@dspace/core/shared/dspace-object-type.model';
import {
  followLink,
  FollowLinkConfig,
} from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { toDSpaceObjectListRD } from '@dspace/core/shared/operators';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';

import { RecentItemListComponent as BaseComponent } from '../../../../../app/home-page/recent-item-list/recent-item-list.component';
import { ErrorComponent } from '../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { SearchService } from '../../../../../app/shared/search/search.service';
import { ThemedThumbnailComponent } from '../../../../../app/thumbnail/themed-thumbnail.component';
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
    ThemedThumbnailComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class RecentItemListComponent extends BaseComponent implements OnInit {
  private searchServiceLocal = inject(SearchService);
  private _platformId = inject(PLATFORM_ID);

  currentSlide = 0;
  carouselTranslate = 0;
  carouselTransition = 'transform 0.3s ease';

  private startX = 0;
  private currentX = 0;
  private isDragging = false;
  private totalSlides = 0;

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

  getSecondaryItems(items: any[]): Item[] {
    return (items || []).slice(1, 4);
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
    const linksToFollow: FollowLinkConfig<Item>[] = [
      followLink('thumbnail'),
    ];

    this.itemRD$ = this.searchServiceLocal.search(
      new PaginatedSearchOptions({
        pagination: this.paginationConfig,
        dsoTypes: [DSpaceObjectType.ITEM],
        sort: this.sortConfig,
      }),
      undefined,
      undefined,
      undefined,
      ...linksToFollow,
    ).pipe(
      toDSpaceObjectListRD(),
      tap((rd: any) => {
        if (rd?.hasSucceeded) {
          this.totalSlides = rd.payload?.page?.length || 0;
        }
      }),
    ) as any;
  }

  goToSlide(index: number): void {
    this.currentSlide = Math.max(0, Math.min(index, this.totalSlides - 1));
    this.carouselTransition = 'transform 0.3s ease';
    this.updateCarouselPosition();
  }

  onTouchStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
    this.currentX = this.startX;
    this.isDragging = true;
    this.carouselTransition = 'none';
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging || !isPlatformBrowser(this._platformId)) return;
    this.currentX = event.touches[0].clientX;
    const diffX = this.currentX - this.startX;
    const diffXInVw = (diffX / window.innerWidth) * 100;
    const slideWidth = this.getSlideWidth();
    const spacing = 4;
    const currentTranslate = -(this.currentSlide * (slideWidth + spacing));
    this.carouselTranslate = currentTranslate + diffXInVw;
  }

  onTouchEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.carouselTransition = 'transform 0.3s ease';
    const diffX = this.currentX - this.startX;
    const threshold = 50;
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        this.goToSlide(this.currentSlide - 1);
      } else {
        this.goToSlide(this.currentSlide + 1);
      }
    } else {
      this.goToSlide(this.currentSlide);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateCarouselPosition();
  }

  private updateCarouselPosition(): void {
    const slideWidth = this.getSlideWidth();
    const spacing = 4;
    this.carouselTranslate = -(this.currentSlide * (slideWidth + spacing));
  }

  private getSlideWidth(): number {
    if (!isPlatformBrowser(this._platformId)) return 70;
    if (window.innerWidth <= 480) return 85;
    if (window.innerWidth <= 768) return 75;
    return 70;
  }
}
