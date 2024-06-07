import { Component, Injector, OnInit, ViewChild, input } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { CellValueChangedEvent } from 'ag-grid-community';
import { GridRowModelTypes } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { VirtualGamesApiService } from '../../services/virtual-games-api.service';

@Component({
  selector: 'app-selections-grid',
  templateUrl: './selections-grid.component.html',
  styleUrls: ['./selections-grid.component.scss']
})
export class SelectionsGridComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  selectedRowId = input<number>();
  frameworkComponents = {
    numericEditor: NumericEditorComponent,
  };
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  rowData = [];
  games = [];
  partners = [];
  path2: string = 'markettypes/selectiontypes';
  partnerId: number | null = null;
  gameId: number | null = null;

  constructor(protected injector: Injector, private _snackBar: MatSnackBar,
    private apiService: VirtualGamesApiService) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 100,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        sortable: true,
        editable: true,
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
      },
      {
        headerName: 'Sport.Order',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Order',
        resizable: true,
        sortable: true,
        editable: true,
        cellEditor: 'numericEditor',
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
        sortable: true,
      }
    ]
  }


  ngOnChanges() {
    if (this.selectedRowId()) {
      this.getSelectionsData();
    }

  }
  onGridReady(params: any): void {
    super.onGridReady(params);
  }

  getSelectionsData() {
    let data = {
      MarketTypeId: this.selectedRowId(),
    };
    this.apiService.apiPost(this.path2, data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onCellValueChanged(event) {
    const data = {
      SelectionTypeId: event.data.Id,
      Order: event.data.Order,
      NickName: event.data.NickName
    }
    this.apiService.apiPost('markettypes/saveselectiontypes', data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


}
