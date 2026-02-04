import { AsyncPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { Community } from '@dspace/core/shared/community.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import {
  hasNoValue,
  hasValue,
} from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { TopLevelCommunityListComponent as BaseComponent } from '../../../../../app/home-page/top-level-community-list/top-level-community-list.component';
import { ErrorComponent } from '../../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../../../../app/thumbnail/themed-thumbnail.component';

@Component({
  selector: 'ds-themed-top-level-community-list',
  templateUrl: './top-level-community-list.component.html',
  styleUrls: ['./top-level-community-list.component.scss'],
  imports: [
    AsyncPipe,
    ErrorComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
    RouterLink,
    ThemedThumbnailComponent,
  ],
})
export class TopLevelCommunityListComponent extends BaseComponent implements OnInit, OnDestroy {
  private linkService = inject(LinkService);
  private logoSubscription: Subscription;

  @ViewChild('carouselTrack') carouselTrack: ElementRef;

  override ngOnInit() {
    super.ngOnInit();
    this.logoSubscription = this.communitiesRD$.subscribe(rd => {
      if (rd?.hasSucceeded && rd?.payload?.page) {
        rd.payload.page.forEach(community => {
          if (hasValue(community) && hasNoValue(community.logo)) {
            this.linkService.resolveLink<Community>(community, followLink('logo'));
          }
        });
      }
    });
  }

  scrollPrev() {
    const track = this.carouselTrack?.nativeElement;
    if (track) {
      const card = track.querySelector('.carousel-card');
      const cardWidth = card?.offsetWidth || 300;
      const gap = 24;
      track.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    }
  }

  scrollNext() {
    const track = this.carouselTrack?.nativeElement;
    if (track) {
      const card = track.querySelector('.carousel-card');
      const cardWidth = card?.offsetWidth || 300;
      const gap = 24;
      track.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.logoSubscription?.unsubscribe();
  }
}
