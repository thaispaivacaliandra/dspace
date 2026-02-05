import { AsyncPipe, DecimalPipe } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
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

@Component({
  selector: 'ds-themed-top-level-community-list',
  templateUrl: './top-level-community-list.component.html',
  styleUrls: ['./top-level-community-list.component.scss'],
  imports: [
    AsyncPipe,
    DecimalPipe,
    ErrorComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
    RouterLink,
  ],
})
export class TopLevelCommunityListComponent extends BaseComponent implements OnInit, OnDestroy {
  private linkService = inject(LinkService);
  private logoSubscription: Subscription;

  communities: Community[] = [];

  override ngOnInit() {
    super.ngOnInit();
    this.logoSubscription = this.communitiesRD$.subscribe(rd => {
      if (rd?.hasSucceeded && rd?.payload?.page) {
        rd.payload.page.forEach(community => {
          if (hasValue(community) && hasNoValue(community.logo)) {
            this.linkService.resolveLink<Community>(community, followLink('logo'));
          }
        });
        this.communities = rd.payload.page;
      }
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.logoSubscription?.unsubscribe();
  }
}
