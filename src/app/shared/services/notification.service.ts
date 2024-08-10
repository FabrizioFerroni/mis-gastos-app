import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Severity } from '../utils/severity';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly messageService = inject(MessageService);

  showToast(severity: Severity, summary: string, detail: string) {
    this.messageService.add({
      severity,
      summary,
      detail,
    });
  }
}
