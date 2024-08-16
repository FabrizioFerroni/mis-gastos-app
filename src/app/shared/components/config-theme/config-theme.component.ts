import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { CustomizationService } from '@app/shared/services/customization.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-config-theme',
  standalone: true,
  imports: [
    ButtonModule,
    SidebarModule,
    RippleModule,
    RouterLink,
    RouterModule,
    AvatarModule,
    StyleClassModule,
    InputSwitchModule,
    RadioButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './config-theme.component.html',
  styleUrl: './config-theme.component.scss',
})
export class ConfigThemeComponent implements OnInit {
  @Input() visible = false;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @Output() visibleChange = new EventEmitter<boolean>();
  fb = inject(FormBuilder);
  customService = inject(CustomizationService);
  form: FormGroup = new FormGroup({});

  ngOnInit() {
    this.form = this.fb.group({
      designType: ['outlined'],
    });
  }

  get inputStyle(): string {
    return this.form.get('designType')?.value;
  }

  onHide() {
    this.visibleChange.emit(false);
  }

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }

  switchTheme(theme: string): void {
    this.customService.setTheme(theme);
  }
}
