import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
import { ThemedSearchFormComponent } from '../../../../../app/shared/search-form/themed-search-form.component';

@Component({
  selector: 'ds-themed-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html',
  imports: [
    RouterLink,
    ThemedSearchFormComponent,
    TranslateModule,
  ],
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent extends BaseComponent {
  popularTerms = [
    { label: 'Gestão Pública', query: 'gestão pública' },
    { label: 'Políticas Públicas', query: 'políticas públicas' },
    { label: 'Inovação', query: 'inovação' },
    { label: 'Administração Pública', query: 'administração pública' },
    { label: 'Governo Digital', query: 'governo digital' },
    { label: 'Servidor Público', query: 'servidor público' },
  ];
}
