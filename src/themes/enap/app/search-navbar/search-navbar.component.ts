import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NavigationEnd,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { filter, Subscription } from 'rxjs';

import { SearchNavbarComponent as BaseComponent } from '../../../../app/search-navbar/search-navbar.component';
import { BrowserOnlyPipe } from '../../../../app/shared/utils/browser-only.pipe';
import { ClickOutsideDirective } from '../../../../app/shared/utils/click-outside.directive';

const expandSearchInputWide = trigger('toggleAnimation', [
  state('collapsed', style({
    width: '0',
    opacity: '0',
  })),
  state('expanded', style({
    width: '400px',
    opacity: '1',
  })),
  transition('* => collapsed', group([
    animate('300ms ease-in-out', style({
      width: '30px',
    })),
    animate('300ms ease-in', style({
      opacity: '0',
    })),
  ])),
  transition('* => expanded', group([
    animate('300ms ease-out', style({
      opacity: '1',
    })),
    animate('300ms ease-in-out', style({
      width: '400px',
    })),
  ])),
]);

@Component({
  selector: 'ds-themed-search-navbar',
  templateUrl: './search-navbar.component.html',
  styleUrls: ['../../../../app/search-navbar/search-navbar.component.scss', './search-navbar.component.scss'],
  animations: [expandSearchInputWide],
  imports: [
    BrowserOnlyPipe,
    ClickOutsideDirective,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class SearchNavbarComponent extends BaseComponent implements AfterViewInit, OnDestroy {
  isHomePage = true;
  private routerRef = inject(Router);
  private routerSub: Subscription;

  ngAfterViewInit() {
    this.checkRoute(this.routerRef.url);
    this.routerSub = this.routerRef.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe((event: NavigationEnd) => {
      this.checkRoute(event.urlAfterRedirects || event.url);
    });
  }

  private checkRoute(url: string) {
    this.isHomePage = url === '/' || url === '/home' || url.startsWith('/home?') || url.startsWith('/?');
    if (!this.isHomePage && !this.searchExpanded) {
      setTimeout(() => this.expand());
    } else if (this.isHomePage && this.searchExpanded && this.searchField) {
      super.collapse();
    }
  }

  override collapse() {
    if (this.isHomePage) {
      super.collapse();
    }
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
