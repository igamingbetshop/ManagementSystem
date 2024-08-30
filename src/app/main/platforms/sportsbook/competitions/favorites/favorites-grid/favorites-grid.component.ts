import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';

import { MatGridListModule } from '@angular/material/grid-list';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CellValueChangedEvent } from 'ag-grid-community';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { GridRowModelTypes } from 'src/app/core/enums';

@Component({
  selector: 'app-favorites-grid',
  templateUrl: './favorites-grid.component.html',
  styleUrls: ['./favorites-grid.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    AgGridModule,
    MatSelectModule,
    FormsModule,
  ]
})
export class FavoritesGridComponent extends BaseGridComponent {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  rowData = input<[]>();
  @Output() isRowSelected: EventEmitter<any> = new EventEmitter<any>();

  public frameworkComponents = {
    numericEditor: NumericEditorComponent,
    textEditor: TextEditorComponent,
  };
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        resizable: true,
        sortable: true,
        editable: true,
        filter: false,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.RegionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        sortable: true,
        filter: true,
      },
    ];
  }

  isUnknownRowSelected() {
    return this.agGrid.api && this.agGrid.api.getSelectedRows().length === 0;
  };


  onGridReady(params) {
    super.onGridReady(params);
  }

  onCellValueChanged(params) {
    this.apiService.apiPost('competitions/updatefavorite', params.data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onRowSelected() {
    let rowId = this.agGrid.api.getSelectedRows()[0].Id;

    this.isRowSelected.emit(rowId);
  }

}
