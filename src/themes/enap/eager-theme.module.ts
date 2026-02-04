import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowseByDataType } from '@dspace/core/browse/browse-by-data-type';

import {
  BROWSE_BY_DECORATOR_MAP,
  DEFAULT_BROWSE_BY_CONTEXT,
} from '../../app/browse-by/browse-by-switcher/browse-by-decorator';
import { RootModule } from '../../app/root.module';
import { BrowseByDateComponent } from './app/browse-by/browse-by-date/browse-by-date.component';
import { BrowseByMetadataComponent } from './app/browse-by/browse-by-metadata/browse-by-metadata.component';
import { BrowseByTaxonomyComponent } from './app/browse-by/browse-by-taxonomy/browse-by-taxonomy.component';
import { BrowseByTitleComponent } from './app/browse-by/browse-by-title/browse-by-title.component';
import { FooterComponent } from './app/footer/footer.component';
import { HeaderComponent } from './app/header/header.component';
import { HeaderNavbarWrapperComponent } from './app/header-nav-wrapper/header-navbar-wrapper.component';
import { ExploreThemesComponent } from './app/home-page/explore-themes/explore-themes.component';
import { HomeNewsComponent } from './app/home-page/home-news/home-news.component';
import { HomePageComponent } from './app/home-page/home-page.component';
import { RecentItemListComponent } from './app/home-page/recent-item-list/recent-item-list.component';
import { StatsSectionComponent } from './app/home-page/stats-section/stats-section.component';
import { TopLevelCommunityListComponent } from './app/home-page/top-level-community-list/top-level-community-list.component';
import { NavbarComponent } from './app/navbar/navbar.component';
import { ItemSearchResultListElementComponent } from './app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';

/**
 * Add components that use a custom decorator to ENTRY_COMPONENTS as well as DECLARATIONS.
 * This will ensure that decorator gets picked up when the app loads
 */
const ENTRY_COMPONENTS = [
  ItemSearchResultListElementComponent,
];

const DECLARATIONS = [
  ...ENTRY_COMPONENTS,
  BrowseByDateComponent,
  BrowseByMetadataComponent,
  BrowseByTaxonomyComponent,
  BrowseByTitleComponent,
  ExploreThemesComponent,
  FooterComponent,
  HomeNewsComponent,
  HomePageComponent,
  RecentItemListComponent,
  StatsSectionComponent,
  TopLevelCommunityListComponent,
  HeaderComponent,
  HeaderNavbarWrapperComponent,
  NavbarComponent,
];

// Register ENAP browse-by components in the browse-by decorator map
const dateContextMap = BROWSE_BY_DECORATOR_MAP.get(BrowseByDataType.Date);
if (dateContextMap) {
  const themeMap = dateContextMap.get(DEFAULT_BROWSE_BY_CONTEXT);
  if (themeMap) {
    themeMap.set('enap', BrowseByDateComponent);
  }
}

const metadataContextMap = BROWSE_BY_DECORATOR_MAP.get(BrowseByDataType.Metadata);
if (metadataContextMap) {
  const themeMap = metadataContextMap.get(DEFAULT_BROWSE_BY_CONTEXT);
  if (themeMap) {
    themeMap.set('enap', BrowseByMetadataComponent);
  }
}

const titleContextMap = BROWSE_BY_DECORATOR_MAP.get(BrowseByDataType.Title);
if (titleContextMap) {
  const themeMap = titleContextMap.get(DEFAULT_BROWSE_BY_CONTEXT);
  if (themeMap) {
    themeMap.set('enap', BrowseByTitleComponent);
  }
}

const hierarchyContextMap = BROWSE_BY_DECORATOR_MAP.get(BrowseByDataType.Hierarchy);
if (hierarchyContextMap) {
  const themeMap = hierarchyContextMap.get(DEFAULT_BROWSE_BY_CONTEXT);
  if (themeMap) {
    themeMap.set('enap', BrowseByTaxonomyComponent);
  }
}

@NgModule({
  imports: [
    CommonModule,
    RootModule,
    ...DECLARATIONS,
  ],
  providers: [
    ...ENTRY_COMPONENTS.map((component) => ({ provide: component })),
  ],
})
/**
 * This module is included in the main bundle that gets downloaded at first page load. So it should
 * contain only the themed components that have to be available immediately for the first page load,
 * and the minimal set of imports required to make them work. Anything you can cut from it will make
 * the initial page load faster, but may cause the page to flicker as components that were already
 * rendered server side need to be lazy-loaded again client side
 *
 * Themed EntryComponents should also be added here
 */
export class EagerThemeModule {
}
