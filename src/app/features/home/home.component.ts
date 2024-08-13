import { Component } from '@angular/core';
import { HomeNavbarComponent } from '@app/shared/components/navbar/home-navbar/home-navbar.component';
import { FeaturesComponent } from './features/features.component';
import { PricingComponent } from './pricing/pricing.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Rutas } from '@app/shared/utils/rutas';
import { InformesComponent } from './informes/informes.component';
import { HomeFooterComponent } from '@app/shared/components/footer/home-footer/home-footer.component';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeNavbarComponent,
    FeaturesComponent,
    PricingComponent,
    AboutComponent,
    ContactComponent,
    ButtonModule,
    RouterLink,
    InformesComponent,
    HomeFooterComponent,
    ScrollTopModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {
  registerRoute = Rutas.REGISTER;
}
