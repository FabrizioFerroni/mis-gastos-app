import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TerminosComponent } from '../../modals/terminos/terminos.component';
import { PrivacidadComponent } from '../../modals/privacidad/privacidad.component';

@Component({
  selector: 'app-home-footer',
  standalone: true,
  imports: [ButtonModule, TerminosComponent, PrivacidadComponent],
  templateUrl: './home-footer.component.html',
  styleUrl: './home-footer.component.scss',
})
export class HomeFooterComponent implements OnInit {
  year = 2024;
  visiblePoliticaCond = false;
  visiblePoliticaPriv = false;

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }

  showDialogPoliticaCond() {
    this.visiblePoliticaCond = true;
  }

  hideDialogPoliticaCond() {
    this.visiblePoliticaCond = false;
  }

  showDialogPoliticaPriv() {
    this.visiblePoliticaPriv = true;
  }

  hideDialogPoliticaPriv() {
    this.visiblePoliticaPriv = false;
  }
}
