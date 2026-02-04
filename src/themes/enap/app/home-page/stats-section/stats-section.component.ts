import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

interface StatItem {
  icon: string;
  value: string;
  numericValue: number;
  label: string;
  suffix: string;
}

@Component({
  selector: 'ds-enap-stats-section',
  templateUrl: './stats-section.component.html',
  styleUrls: ['./stats-section.component.scss'],
  standalone: true,
})
export class StatsSectionComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  @ViewChild('statsContainer') statsContainer: ElementRef;

  animated = false;
  displayValues: string[] = ['0', '0', '0', '0'];

  stats: StatItem[] = [
    { icon: 'fas fa-book', value: '14000', numericValue: 14000, label: 'Publicações', suffix: '+' },
    { icon: 'fas fa-layer-group', value: '22', numericValue: 22, label: 'Comunidades', suffix: '' },
    { icon: 'fas fa-newspaper', value: '2468', numericValue: 2468, label: 'Artigos RSP', suffix: '' },
    { icon: 'fas fa-clock', value: '1937', numericValue: 1937, label: 'Desde', suffix: '' },
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animated) {
            this.animated = true;
            this.animateCounters();
          }
        });
      },
      { threshold: 0.3 },
    );

    if (this.statsContainer?.nativeElement) {
      this.observer.observe(this.statsContainer.nativeElement);
    }
  }

  private animateCounters(): void {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    this.stats.forEach((stat, index) => {
      let current = 0;
      const increment = stat.numericValue / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), stat.numericValue);
        this.displayValues[index] = current.toLocaleString('pt-BR');

        if (step >= steps) {
          this.displayValues[index] = stat.numericValue.toLocaleString('pt-BR');
          clearInterval(timer);
        }
      }, interval);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
