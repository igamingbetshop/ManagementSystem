import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { IRowNode } from 'ag-grid-enterprise';
import { take } from 'rxjs';
import { GridRowModelTypes, } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { VirtualGamesApiService } from 'src/app/main/platforms/virtual-games/services/virtual-games-api.service';

@Component({
  selector: 'app-market-types-categores-grid',
  templateUrl: './market-types-categores-grid.component.html',
  styleUrls: ['./market-types-categores-grid.component.scss'],
})

export class MarketTypesCategoresGridComponent extends BaseGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  rowData = input<string>();
  marketTypeId = input<string>();
  userId = input<string>();
  @Output() emitSecondGridData: EventEmitter<any> = new EventEmitter();
  frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
  };

  constructor(
    protected injector: Injector,
    private apiService: VirtualGamesApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Products.CategoryId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryId',
        sortable: true,
        resizable: true,
        minWidth: 100,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
      },
      {
        headerName: 'Clients.CategoryName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryName',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Sport.Profit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProfitValue',
        resizable: true,
        sortable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 150,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: (params) => ({
          onClick: this.saveFinishes.bind(this),
          Label: 'Save',
        })
      }
    ];
  }

  onGridReady(params: any): void {
    super.onGridReady(params);
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      event.node.setDataValue('isChanged', true);
      this.agGrid.api.refreshCells({ force: true, rowNodes: [event.node] });
    }
  }

  saveFinishes(params) {
    const row = params.data;
    let data = {
      ProfitValue: row.ProfitValue,
      MarketTypeId: this.marketTypeId,
      CategoryId: row.CategoryId,
      Id: this.userId
    };
    this.apiService.apiPost('markettypes/saveprofitvalue', data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          params.node.setDataValue('isChanged', false);
          this.agGrid.api.refreshCells({ force: true, rowNodes: [params.node] });
          // this.emitSecondGridData.emit();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }
}

