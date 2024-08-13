import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Rutas } from '@app/shared/utils/rutas';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [ButtonModule, CardModule, RippleModule, RouterLink],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent {
  registerRoute = Rutas.REGISTER;
}
