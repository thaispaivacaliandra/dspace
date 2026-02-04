import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { BrowseByTaxonomyComponent as BaseComponent } from '../../../../../app/browse-by/browse-by-taxonomy/browse-by-taxonomy.component';
import { VocabularyTreeviewComponent } from '../../../../../app/shared/form/vocabulary-treeview/vocabulary-treeview.component';

@Component({
  selector: 'ds-browse-by-taxonomy',
  styleUrls: ['./browse-by-taxonomy.component.scss'],
  templateUrl: './browse-by-taxonomy.component.html',
  imports: [
    RouterLink,
    TranslatePipe,
    VocabularyTreeviewComponent,
  ],
})
export class BrowseByTaxonomyComponent extends BaseComponent {
}
