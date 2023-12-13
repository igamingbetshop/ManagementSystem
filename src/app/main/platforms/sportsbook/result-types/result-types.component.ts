import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { GridMenuIds, GridRowModelTypes } from 'src/app/core/enums';
import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { CellValueChangedEvent, IRowNode } from "ag-grid-community";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { SportsbookApiService } from '../services/sportsbook-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';

@Component({
  selector: 'app-result-types',
  templateUrl: './result-types.component.html',
  styleUrls: ['./result-types.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class ResultTypesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  frameworkComponents =  {
    numericEditor: NumericEditorComponent,
  };
  rowData = [];
  path: string = 'common/resulttypes';
  updatePath: string = 'common/updateresulttype';
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };
  userId: any;

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_RESULT_TYPES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        editable: true,
        cellEditor: 'numericEditor',
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
      },
    ]
  }

  ngOnInit() {
    this.userId = this.localstorageService.get('user').UserId;
    this.gridStateName = 'currencies-grid-state';
    super.ngOnInit();
    this.getRows();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getRows() {
    this.apiService.apiPost(this.path)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.Objects;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


  onCellValueChanged(params) {
    const row = params.data;
    row.UserId = this.userId;
    this.apiService.apiPost(this.updatePath, row).subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onPageSizeChanged() {
    this.agGrid.api.paginationSetPageSize(Number(this.cacheBlockSize));
  }

}
