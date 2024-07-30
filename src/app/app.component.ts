import { Component } from '@angular/core';
import { environment } from '@env/environment';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, CheckboxModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = environment.name;
}
