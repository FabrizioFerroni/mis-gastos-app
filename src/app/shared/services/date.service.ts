import { DatePipe } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class DateService {
  private datePipe = inject(DatePipe);

  formatDatabaseDate(inputDate: string, format: string): string | null {
    const parsedDate = new Date(inputDate);
    return this.datePipe.transform(parsedDate, format);
  }

  formatDatabaseDateD(inputDate: Date, format: string): string | null {
    const parsedDate = new Date(inputDate);
    return this.datePipe.transform(parsedDate, format);
  }
}
