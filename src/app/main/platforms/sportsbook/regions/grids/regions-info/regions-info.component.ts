import { Component, Injector, ViewChild, Input, EventEmitter, Output } from '@angular/core';

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgGridAngular } from "ag-grid-angular";

import { MatSnackBar } from "@angular/material/snack-bar";
import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { MatDialog } from "@angular/material/dialog";
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import { CommonDataService } from 'src/app/core/services';
import { take } from 'rxjs';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import {SelectRendererComponent} from "../../../../../components/grid-common/select-renderer.component";

@Component({
  selector: 'app-regions-info',
  templateUrl: './regions-info.component.html',
  styleUrls: ['./regions-info.component.scss']
})
export class RegionsInfoComponent extends BasePaginatedGridComponent {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @Input() partnerId: number = 0;
  @Output() valueEmitted: EventEmitter<boolean> = new EventEmitter<boolean>();

  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partners: any[] = [];
  private statuses = [
    {Id: 1, State: true, Name: 'Active'},
    {Id: 2, State: false, Name: 'Inactive'},
    {Id: 3, State: null, Name: 'None'},
  ]

  private settingsPath = 'regions/sportsettings';
  private updateSettingsPath = 'regions/updatesettings';
  private removePath = 'regions/removesettings';
  public frameworkComponents = {
    selectRenderer: SelectRendererComponent,
    numericEditor: NumericEditorComponent,
  }

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportId',
        sortable: true,
        resizable: true,
        checkboxSelection: true,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Enabled',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this),
          Selections: this.statuses,
        },

      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        cellEditorPopup: true,
        stopEditing: this.savePartnerSettings['bind'](this),
      },
    ]
  }

  onSelectChange(params, value, param) {
    params.Enabled = this.statuses.find(status => status.Id == value).State;
    this.savePartnerSettings(params);
  }

  savePartnerSettings(params) {
    const requestData = params?.data ? params.data : params;
    this.apiService.apiPost(this.updateSettingsPath, requestData).subscribe(data => {
      if (data.Code === 0) {
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  getRows(regionId, partnerId?) {
    this.apiService.apiPost(this.settingsPath, { RegionId: regionId, PartnerId: partnerId }).subscribe(data => {
      if (data.Code === 0) {
        const mappedData = data.ResponseObject.map(element => {
          element.Enabled = this.statuses.find(status => status.State == element.Enabled)?.Id;
          return element;
        });
        this.rowData = mappedData;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  onRowSelected() {
    this.valueEmitted.emit(false);
  }

  async deleteItem(params) {
    const { ConfirmComponent } = await import('../../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      this.apiService.apiPost(this.removePath, params)
        .subscribe(data => {
          if (data.ResponseCode === 0) {
            this.getRows(this.partnerId);
            this.valueEmitted.emit(true);
            SnackBarHelper.show(this._snackBar, { Description: "Removed", Type: "success" });
          }
          else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        })
      }
    });
  }

  onPartnerChange(val: number) {
    this.partnerId = val;
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

}
