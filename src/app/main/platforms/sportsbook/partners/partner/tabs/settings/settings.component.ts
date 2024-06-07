import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { GridRowModelTypes, ModalSizes } from "../../../../../../../core/enums";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SportsbookApiService } from "../../../../services/sportsbook-api.service";
import { take } from "rxjs/operators";
import { AgBooleanFilterComponent } from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../../components/grid-common/checkbox-renderer.component";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { IRowNode } from "ag-grid-community";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partnerId;
  public partnerName;
  public frameworkComponents;

  constructor(private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    public dialog: MatDialog,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'VirtualGames.BooleanValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BooleanValue',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agBooleanColumnFilter',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onchange: this.onCheckBoxChange['bind'](this),

        }
      },
      {
        headerName: 'VirtualGames.IntValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IntValue',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'VirtualGames.DecimalValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DecimalValue',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.StringValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StringValue',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.DateValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DateValue',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 140,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveCategorySettings['bind'](this),
          Label: 'Save',
          isDisabled: true
        }
      },
    ]
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
      checkBoxRenderer: CheckboxRendererComponent,
    }
  }

  ngOnInit() {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getSettings();
  }

  getSettings() {
    this.apiService.apiPost('partners/getpartnersettings', { PartnerId: +this.partnerId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.gridApi.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
  }

  async addKey() {
    const { AddKeyComponent } = await import('../keys/add-key/add-key.component');
    const dialogRef = this.dialog.open(AddKeyComponent, {
      width: ModalSizes.MEDIUM,
      data: { type: 2 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getSettings();
      }
    });
  }

  onCheckBoxChange(params, val, event) {
    params.BooleanValue = val;
    this.onCellValueChanged(event);
  }

  saveCategorySettings(params) {

    delete params.data.UserId;
    delete params.data.LanguageId;
    delete params.data.TimeZone;
    delete params.data.CurrencyId;
    this.apiService.apiPost('partners/savepartnerkey', params.data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.getSettings();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

}
