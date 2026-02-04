import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Theme {
  label: string;
  query: string;
}

@Component({
  selector: 'ds-enap-explore-themes',
  templateUrl: './explore-themes.component.html',
  styleUrls: ['./explore-themes.component.scss'],
  standalone: true,
  imports: [RouterLink],
})
export class ExploreThemesComponent {
  themes: Theme[] = [
    { label: 'Gestão Pública', query: 'gestão pública' },
    { label: 'Políticas Públicas', query: 'políticas públicas' },
    { label: 'Inovação', query: 'inovação' },
    { label: 'Administração Pública', query: 'administração pública' },
    { label: 'Servidor Público', query: 'servidor público' },
    { label: 'Liderança', query: 'liderança' },
    { label: 'Governo Digital', query: 'governo digital' },
    { label: 'Avaliação de Políticas', query: 'avaliação de políticas' },
    { label: 'Educação', query: 'educação' },
    { label: 'Finanças Públicas', query: 'finanças públicas' },
    { label: 'Tecnologia', query: 'tecnologia' },
    { label: 'Sustentabilidade', query: 'sustentabilidade' },
  ];
}
