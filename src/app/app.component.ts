import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CustomizationService } from './shared/services/customization.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [PrimeNGConfig],
})
export class AppComponent implements OnInit {
  private readonly customService = inject(CustomizationService);
  private readonly primengConfig = inject(PrimeNGConfig);

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.setDefaultTheme();
  }

  setDefaultTheme() {
    const theme = this.customService.getTheme();

    if (theme) {
      // this.customService.setActiveClass(theme);
      this.customService.setTheme(theme);
    } else {
      const defaultColor = this.customService.preferColorUser();
      switch (defaultColor) {
        case 'dark':
          // this.customService.setActiveClass('soho-dark');
          this.customService.setTheme('soho-dark');
          break;
        case 'light':
          // this.customService.setActiveClass('soho-light');
          this.customService.setTheme('soho-light');
          break;
        default:
          break;
      }
    }

    // ver que color tiene por default el sistema el usuario
  }
}
