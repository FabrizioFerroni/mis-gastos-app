import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './privacidad.component.html',
  styleUrl: './privacidad.component.scss',
})
export class PrivacidadComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    this.visibleChange.emit(false);
  }
}
