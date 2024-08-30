import { Component, Injector, InputSignal, OnInit, ViewChild, input } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { MatDialog } from '@angular/material/dialog';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { IRowNode } from 'ag-grid-enterprise';

@Component({
  selector: 'app-selections-grid',
  templateUrl: './selections-grid.component.html',
  styleUrls: ['./selections-grid.component.scss']
})
export class SelectionsGridComponent extends BaseGridComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  selectedRowId: InputSignal<any> = input(null, {
    transform: (v: number) => {
      this.getSelectionsData(v);
      return v;
    }
  });
  frameworkComponents = {
    numericEditor: NumericEditorComponent,
    buttonRenderer: ButtonRendererComponent,
  };
  isSendingRequest = false;
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  rowData = [];
  games = [];
  partners = [];
  updateSelectionType = 'markettypes/updateselectiontype';
  selectPath: string = 'markettypes/selectiontypes';
  partnerId: number | null = null;
  gameId: number | null = null;
  gridReady = false;

  constructor(
    protected injector: Injector, 
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private apiService: SportsbookApiService
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        minWidth: 55,
        resizable: true,
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
      },
      {
        headerName: 'Common.HeaderTranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'HeaderTranslationId',
        resizable: true,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        resizable: true,
        editable: true,
        cellEditor: NumericEditorComponent,
      },
      {
        headerName: 'Common.CalculationFormula',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CalculationFormula',
        resizable: true,
        editable: true,
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Clients.CalculationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CalculationTime',
        resizable: true,
        editable: true,
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 130,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveSecondGridRow.bind(this),
          Label: this.translate.instant('Common.Save'),
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        },
      }
    ];
  }

  onGridReady(params: any): void {
    super.onGridReady(params);
    this.gridReady = true;
  }

  getSelectionsData(id: number) {
    this.apiService.apiPost(this.selectPath, { 'MarketTypeId': id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.Selections;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onCellValueChanged(event) {
    if (!this.gridReady || !this.agGrid || !this.agGrid.api) {
      console.error("Grid is not ready or agGrid/api is not initialized.");
      return;
    }

    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;

      this.agGrid.api.forEachNode(nod => {
        if (nod.rowIndex === node) {
          findedNode = nod;
        }
      });
      if (findedNode) {
        this.agGrid.api.getColumnDef('save').cellRendererParams.isDisabled = false;
        this.agGrid.api.redrawRows({ rowNodes: [findedNode] });
      }
    }
  }

  saveSecondGridRow(params) {
    const row = params.data;    
    this.apiService.apiPost(this.updateSelectionType, row).subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  async addSelectionType() {
    this.isSendingRequest = true;
    let id = this.selectedRowId();
    const { AddSelectionTypesComponent } = await import('../../market-types/add-selection-types/add-selection-types.component');
    const dialogRef = this.dialog.open(AddSelectionTypesComponent, { width: ModalSizes.SMALL, data: { Id: id } });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost(this.selectPath, { 'MarketTypeId': id })
          .pipe(take(1))
          .subscribe(data => {
            if (data.Code === 0) {
              this.rowData = data.Selections;
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
            this.isSendingRequest = false;
          });
      } else {
        this.isSendingRequest = false;
      }
    });
  }
}
