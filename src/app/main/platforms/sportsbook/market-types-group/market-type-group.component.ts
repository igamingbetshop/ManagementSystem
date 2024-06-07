import { Component, OnInit, Injector, ViewChild } from '@angular/core';

import { MatDialog } from "@angular/material/dialog";
import { AgGridAngular } from "ag-grid-angular";
import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { IRowNode } from "ag-grid-community";

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../services/sportsbook-api.service';
import { CommonDataService } from "../../../../core/services";
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { AgBooleanFilterComponent } from "../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../components/grid-common/numeric-editor.component";
import { TextEditorComponent } from "../../../components/grid-common/text-editor.component";
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';


@Component({
  selector: 'app-teams',
  templateUrl: './market-type-group.component.html',
  styleUrls: ['./market-type-group.component.scss']
})
export class MarketTypeGroupComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public partners: any[] = [];
  public rowData = [];
  public path: string = 'markettypes/groups';
  public updatePath: string = 'markettypes/updatemarkettypegroup';
  public delPath = 'markettypes/deletegroup'
  public sports: any[] = [];
  public cacheBlockSize = 500;
  public sportsNamesEntites = [];
  public partnerNamesEntites = [];
  isSendingReqest = false;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    textEditor: TextEditorComponent,
  };

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_MARKET_TYPES_GROUP;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        cellStyle: { color: '#3E4D66', 'font-size': '14px', 'font-weight': '500' },
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        resizable: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        // filterParams: {
        //   buttons: ['apply', 'reset'],
        //   closeOnApply: true,
        //   filterOptions: this.filterService.textOptions
        // }
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        resizable: true,
        sortable: true,
        editable: true,
        cellEditor: 'numericEditor',
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        resizable: true,
        sortable: true,
        editable: true,
        cellEditor: 'numericEditor',
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
        sortable: true,
        editable: false,
        cellEditor: 'numericEditor',
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveMarketTypeGroup['bind'](this),
          Label: 'Save',
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      }
    ]
  }

  ngOnInit() {
    this.getSports();
    this.partners = this.commonDataService.partners;
    this.mapPartnerFilter();
    this.gridStateName = 'market-type-group-grid-state';
    this.getPage();
    super.ngOnInit();
  }

  getSports() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
        this.mapSportNameFilter();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  mapSportNameFilter(): void {
    this.sportsNamesEntites.push("empty");
    this.sports.forEach(field => {
      this.sportsNamesEntites.push({
        displayKey: field.Id,
        displayName: field.Name,
        predicate: (_,) => false,
        numberOfInputs: 0,
      });
    })

  }

  mapPartnerFilter(): void {
    this.partnerNamesEntites.push("empty");
    this.partners.forEach(field => {
      this.partnerNamesEntites.push({
        displayKey: field.Id,
        displayName: field.Name,
        predicate: (_,) => false,
        numberOfInputs: 0,
      });
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

  saveMarketTypeGroup(params) {
    const row = params.data;
    this.apiService.apiPost(this.updatePath, row).subscribe(data => {
      if (data.Code === 0) {
        this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  async addTypeGroup() {
    const { AddMarketTypeGroupComponent } = await import('../market-types-group/add-market-type-group/add-market-type-group.component');
    const dialogRef = this.dialog.open(AddMarketTypeGroupComponent, { width: ModalSizes.MIDDLE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        data.ResponseObject.PartnerName = this.partners.find((item => item.Id === data.ResponseObject.PartnerId))?.Name;
        data.ResponseObject.SportName = this.sports.find((item => item.Id === data.ResponseObject.SportId))?.Name;
        this.rowData.unshift(data.ResponseObject);
        this.gridApi.setRowData(this.rowData);
      }
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPage() {
    this.apiService.apiPost(this.path)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.ResponseObject;
          const mappedRows = this.rowData.map(part => {
            part['PartnerName'] = this.partners.find((partner) => partner.Id == part.PartnerId)?.Name;
            part['SportName'] = this.sports.find((sport) => sport.Id == part.SportId)?.Name;

            return part;
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  onDeleteGroup() {
    const id = this.gridApi.getSelectedRows()[0]?.Id;
    this.isSendingReqest = true;
    this.apiService.apiPost(this.delPath, { Id: id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = this.rowData.filter(elem => elem.Id !== id);

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

}
