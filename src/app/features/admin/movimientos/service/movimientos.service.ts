/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@app/shared/services/base-http.service';
import { map, Observable } from 'rxjs';
import {
  Movimiento,
  MovimientoData,
  MovimientoResponse,
} from '../dto/response/movimiento.response';
import { ApiResponse } from '@app/shared/response/api-response-ok';
import { CrearMovimientoDto } from '../dto/create-movimiento.dto';
import { EditarMovimientoDto } from '../dto/update-movimiento.dto';
import { CategoriaMovResponse } from '../dto/response/categoria.response';
import { CuentaMovResponse } from '../dto/response/cuentas.response';
import { DateService } from '@app/shared/services/date.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { getDate } from '@app/shared/utils/getDate';
import { capitalizeFirstLetter } from '@app/shared/utils/capitalize';

@Injectable()
export class MovimientosService extends BaseHttpService {
  private dateService = inject(DateService);
  private workbook!: Workbook;
  getMovements(page: number, limit: number): Observable<MovimientoData> {
    return this.http
      .get<MovimientoResponse>(
        `${this.apiUrl}/movimientos?page=${page}&limit=${limit}`
      )
      .pipe(
        map(({ data: { movimientos, meta } }: MovimientoResponse) => {
          const movimientosResp = movimientos.map((movimiento: Movimiento) => ({
            ...movimiento,
            fecha: new Date(movimiento.fecha),
          }));

          return {
            movimientos: movimientosResp,
            meta: meta,
          };
        })
      );
  }

  getAllAccounts(): Observable<CuentaMovResponse> {
    return this.http.get<CuentaMovResponse>(`${this.apiUrl}/cuentas/listar`);
  }

  getAllCategories(): Observable<CategoriaMovResponse> {
    return this.http.get<CategoriaMovResponse>(
      `${this.apiUrl}/categorias/listar`
    );
  }

  getMovement(id: string): Observable<ApiResponse<Movimiento>> {
    return this.http.get<ApiResponse<Movimiento>>(
      `${this.apiUrl}/movimientos/${id}`
    );
  }

  createMovement(body: CrearMovimientoDto): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/movimientos`,
      body
    );
  }

  updateMovement(
    id: string,
    body: EditarMovimientoDto
  ): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${this.apiUrl}/movimientos/${id}`,
      body
    );
  }

  deleteMovement(id: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${this.apiUrl}/movimientos/${id}`
    );
  }

  downloadExcel(
    nameSheet: string,
    title: string,
    movimientos: Movimiento[]
  ): void {
    this.workbook = new Workbook();

    this.workbook.creator = 'Fabrizio Dev';
    this.workbook.lastModifiedBy = 'Fabrizio Ferroni';
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.workbook.lastPrinted = new Date();
    this.workbook.company = 'Fabrizio Dev';
    this.workbook.title = title;
    this.workbook.manager = 'Fabrizio Dev';
    this.workbook.subject = `Reporte de todos los ${nameSheet}`;

    this.createDoc(nameSheet, title, movimientos);

    this.workbook.xlsx.writeBuffer().then(file => {
      const blob = new Blob([file]);
      fs.saveAs(blob, `movimientos_${getDate()}.xlsx`);
    });
  }

  private createDoc(
    nameSheet: string,
    title: string,
    movimientos: Movimiento[]
  ): void {
    const sheet = this.workbook.addWorksheet(nameSheet);
    sheet.getColumn('A').width = 50; //Concepto
    sheet.getColumn('B').width = 15; //Pagado / Cobrado
    sheet.getColumn('C').width = 20; //Tipo
    sheet.getColumn('D').width = 21; //Movimiento
    sheet.getColumn('E').width = 21; //Fecha
    sheet.getColumn('F').width = 25; //Categoria
    sheet.getColumn('G').width = 25; //Cuenta

    sheet.columns.forEach(c => {
      c.alignment = {
        vertical: 'middle',
        horizontal: 'left',
        wrapText: true,
        shrinkToFit: true,
      };
    });

    const nombresArray = [
      'Concepto',
      '¿Cobrado? / ¿Pagado?',
      'Tipo',
      'Movimiento',
      'Fecha',
      'Categoria',
      'Cuenta',
    ];

    const cabeceraRow = sheet.getRow(1);

    cabeceraRow.values = nombresArray;

    cabeceraRow.font = { bold: true, size: 12 };

    cabeceraRow.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '538DD5' },
      };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true };
    });

    const rowsToInsert = sheet.getRows(2, movimientos.length)!;

    for (let i = 0; i < rowsToInsert.length; i++) {
      const itemData = movimientos[i];
      const row = rowsToInsert[i];
      row.values = [
        itemData.concepto ? capitalizeFirstLetter(itemData.concepto) : '-',
        itemData.estado ? (itemData.estado === 0 ? 'No' : 'Si') : 'No',
        itemData.tipo ? itemData.tipo : '-',
        itemData.movimiento ? itemData.movimiento : '0',
        itemData.fecha
          ? this.dateService.formatDatabaseDateD(itemData.fecha, 'dd/MM/yyyy')
          : '-',
        itemData.categoria.nombre ? itemData.categoria.nombre : '-',
        itemData.cuenta.nombre ? itemData.cuenta.nombre : '-',
      ];
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    }
  }
}
