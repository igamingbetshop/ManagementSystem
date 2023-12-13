import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { CommonDataService } from 'src/app/core/services';
import { MatDialog } from '@angular/material/dialog';
import 'ag-grid-enterprise';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { take } from 'rxjs/operators';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { AgGridAngular } from "ag-grid-angular";

@Component({
  selector: 'app-core-regions',
  templateUrl: './core-regions.component.html',
  styleUrls: ['./core-regions.component.scss']
})
export class CoreRegionsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public sessionStates = [{ Name: 'Active', Id: 1 }, { Name: 'Inactive', Id: 2 }];
  public rowData = [];
  public languages: any[] = [];
  public regions: any[] = [];
  public partners: any[] = [];
  public frameworkComponents = {
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
  }
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  public autoGroupColumnDef: ColDef = {
    headerName: 'Common.Id',
    headerValueGetter: this.localizeHeader.bind(this),
    floatingFilter: true,
    floatingFilterComponentParams: {
      suppressFilterButton: true,
    },
    checkboxSelection: true,
    filter: 'agNumberColumnFilter',
    cellRendererParams: {
      suppressCount: true,
    },
  };
  public groupDefaultExpanded = 0;

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    // this.adminMenuId = GridMenuIds.CORE_REGIONS;
  }

  ngOnInit() {
    this.gridStateName = 'core-regions-grid-state';
    this.partners = this.commonDataService.partners;
    this.languages = this.commonDataService.languages;
    this.getRegions();
    this.getPage();
  }

  init() {
    this.columnDefs = [
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Cms.IsoCode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsoCode',
        resizable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Cms.IsoCode3',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsoCode3',
        resizable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Common.LanguageId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LanguageId',
        resizable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        filter: 'agSetColumnFilter',
        floatingFilter: true,
        filterParams: {
          valueFormatter: params => {
            const state = Number(params.value);
            return this.sessionStates.find(field => field.Id === state)?.Name;
          }
        },
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChangeState['bind'](this),
          Selections: this.sessionStates,
        },
      },
      {
        headerName: 'Products.ParentId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ParentId',
        resizable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.CurrencyId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        resizable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeId',
        resizable: true,
        filter: 'agSetColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        filterParams: {
          valueFormatter: params => {
            const region = Number(params.value);
            return this.regions.find(field => field.Id === region)?.Name;
          }
        },
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChangeType['bind'](this),
          Selections: this.regions,
        },
      },
      {
        headerName: 'Common.Info',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Info',
        resizable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event.data),
        cellEditor: 'textEditor',
      },
    ];
  }

  public getDataPath = (data: any) => {
    return data.groupKey;
  };

  getRegions() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_REGION_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.regions = data.ResponseObject;
          this.init();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSelectChangeState(params, value) {
    params.State = value;
    this.onCellValueChanged(params);
  }

  onSelectChangeType(params, value) {
    params.TypeId = value;
    this.onCellValueChanged(params);
  }
  

  async addRegions() {
    const parentId = this.agGrid.api.getSelectedRows()[0]?.Id;
    const { AddCoreRegionsComponent } = await import('./add-regions/add-core-regions.component');
    const dialogRef = this.dialog.open(AddCoreRegionsComponent, {
      width: ModalSizes.SMALL, data: {
        Languages: this.languages,
        Regions: this.regions,
        parentId: parentId
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }

  onCellValueChanged(request) {
    this.apiService.apiPost(this.configService.getApiUrl, request, true, Controllers.REGION, Methods.SAVE_REGION)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Updated Successfully', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  handleDataRecursively(mappedData, parent, dest) {
    let children = mappedData.filter(field => field.ParentId === parent.Id);

    if (children.length > 0) {
      children.forEach(field => {
        field.groupKey = [...parent.groupKey, field.Id];
        dest.push(field);
        this.handleDataRecursively(mappedData, field, dest);
      })
    }
  };

  getPage() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.REGION, Methods.GET_REGIONS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          let mappedData = [];
          data.ResponseObject.forEach(field => {
            if (field.ParentId === null) {
              field.groupKey = [field.Id];
              mappedData.push(field);
              this.handleDataRecursively(data.ResponseObject, field, mappedData);
            }
          })
          this.rowData = mappedData;


        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getFormattedState(params) {
    const state = Number(params.value);
    return this.sessionStates.find(field => field.Id === state)?.Name;
  }

}