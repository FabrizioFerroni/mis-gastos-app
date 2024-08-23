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
    this.primengConfig.setTranslation({
      startsWith: 'Comienza con',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina con',
      equals: 'Es igual',
      notEquals: 'No es igual',
      noFilter: 'Sin filtro',
      lt: 'Menos que',
      lte: 'Menor o igual a',
      gt: 'Más que',
      gte: 'Mayor o igual a',
      is: 'Es',
      isNot: 'No es',
      before: 'Antes',
      after: 'Después',
      dateIs: 'La fecha es',
      dateIsNot: 'La fecha no es',
      dateBefore: 'La fecha es anterior',
      dateAfter: 'La fecha es posterior',
      clear: 'Limpiar',
      apply: 'Aplicar',
      matchAll: 'Coinidir con todos',
      matchAny: 'Coincide con cualquiera',
      addRule: 'Añadir Regla',
      removeRule: 'Quitar Regla',
      accept: 'Si',
      reject: 'No',
      choose: 'Elegir',
      upload: 'Subir',
      cancel: 'Cancelar',
      dayNames: [
        'Domingo',
        'Lunes',
        'Martes',
        'Miercoles',
        'Jueves',
        'Viernes',
        'Sabado',
      ],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      monthNamesShort: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
      dateFormat: 'dd/mm/yy',
      firstDayOfWeek: 1,
      today: 'Hoy',
      weekHeader: 'Wk',
      weak: 'Flojo',
      medium: 'Medio',
      strong: 'Fuerte',
      passwordPrompt: 'Ingrese una contraseña',
      emptyMessage: 'No hay resultados',
      emptyFilterMessage: 'No hay resultados',
      //translations
    });
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
