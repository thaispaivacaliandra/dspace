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

interface CommunityCategory {
  name: string;
  icon: string;
  description: string;
  keywords: string[];
  communities: Community[];
  totalItems: number;
}

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

  categories: CommunityCategory[] = [];

  private categoryDefinitions = [
    {
      name: 'Formação e Ensino',
      icon: 'fas fa-graduation-cap',
      description: 'Cursos, especializações, mestrado e escola virtual',
      keywords: ['curso', 'escola virtual', 'especialização', 'mestrado', 'formação', 'aperfeiçoamento', 'desenvolvimento profissional', 'educação executiva'],
    },
    {
      name: 'Pesquisa e Publicações',
      icon: 'fas fa-book-open',
      description: 'Produção acadêmica, publicações e revista do serviço público',
      keywords: ['produção acadêmica', 'publicações', 'revista', 'gestão pública', 'finanças públicas'],
    },
    {
      name: 'Inovação e Premiações',
      icon: 'fas fa-lightbulb',
      description: 'Concursos de inovação, casoteca e ODS',
      keywords: ['inovação', 'concurso', 'casoteca', 'ods', 'premiações'],
    },
    {
      name: 'Eventos',
      icon: 'fas fa-calendar-alt',
      description: 'Eventos nacionais e internacionais',
      keywords: ['evento'],
    },
    {
      name: 'Institucional',
      icon: 'fas fa-landmark',
      description: 'Memória, acesso à informação e rede de escolas',
      keywords: ['memória', 'acesso à informação', 'rede', 'história', 'eppgg'],
    },
  ];

  override ngOnInit() {
    super.ngOnInit();
    this.logoSubscription = this.communitiesRD$.subscribe(rd => {
      if (rd?.hasSucceeded && rd?.payload?.page) {
        rd.payload.page.forEach(community => {
          if (hasValue(community) && hasNoValue(community.logo)) {
            this.linkService.resolveLink<Community>(community, followLink('logo'));
          }
        });
        this.buildCategories(rd.payload.page);
      }
    });
  }

  private buildCategories(communities: Community[]): void {
    const assigned = new Set<string>();

    this.categories = this.categoryDefinitions.map(def => {
      const matched = communities.filter(c => {
        const name = c.name?.toLowerCase() || '';
        return def.keywords.some(kw => name.includes(kw));
      });

      matched.forEach(c => assigned.add(c.id));

      return {
        ...def,
        communities: matched,
        totalItems: matched.reduce((sum, c) => sum + (c.archivedItemsCount || 0), 0),
      };
    });

    // Catch unmatched communities under "Outros"
    const unmatched = communities.filter(c => !assigned.has(c.id));
    if (unmatched.length > 0) {
      this.categories.push({
        name: 'Outros',
        icon: 'fas fa-folder-open',
        description: 'Outras comunidades do repositório',
        keywords: [],
        communities: unmatched,
        totalItems: unmatched.reduce((sum, c) => sum + (c.archivedItemsCount || 0), 0),
      });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.logoSubscription?.unsubscribe();
  }
}
