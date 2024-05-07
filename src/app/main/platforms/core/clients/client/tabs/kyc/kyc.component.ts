import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { AgBooleanFilterComponent } from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../components/grid-common/button-renderer.component";
import { TextEditorComponent } from "../../../../../../components/grid-common/text-editor.component";
import { SelectRendererComponent } from "../../../../../../components/grid-common/select-renderer.component";
import { NumericEditorComponent } from "../../../../../../components/grid-common/numeric-editor.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IRowNode } from "ag-grid-community";
import { OpenerComponent } from "../../../../../../components/grid-common/opener/opener.component";
import { ImageRendererComponent } from "../../../../../../components/grid-common/image-renderer.component";
import { DatePipe } from "@angular/common";
import { DatePickerRendererComponent } from "../../../../../../components/grid-common/date-picker-renderer.component";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { StateService } from "../../../../services/state.service";
import { syncColumnSelectPanel, syncNestedColumnReset } from "../../../../../../../core/helpers/ag-grid.helper";
import {ExportService} from "../../../../services/export.service";

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss']
})
export class KycComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('agGrid2') agGrid2: AgGridAngular;
  clientId: number;
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  rowModelType2: string = GridRowModelTypes.CLIENT_SIDE;
  rowData = [];
  rowData2 = [];
  columnDefs = [];
  columnDefs2 = [];
  blockedData;
  selected = false;
  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
    numericEditor: NumericEditorComponent,
    imageRenderer: ImageRendererComponent,
    datePickerRenderer: DatePickerRendererComponent
  };
  rowClassRules;
  addedNotes;
  documentTypeName = [];
  documentStateName = [];

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private exportService:ExportService,
    private stateService: StateService) {
    super(injector);
    this.columnDefs2 = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.ChangeDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChangeDate',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ChangeDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.CreatedBy',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusPrize',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: params => {
          let a = document.createElement('div');
          if (params.data.FirstName !== null || params.data.LastName !== null) {
            a.innerHTML = params.data.FirstName + ' ' + params.data.LastName;
          }
          return a;
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        suppressMenu: true,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'object-history').split('?')[0];
          data.queryParams = { ObjectHistory: params.data.Id };
          return data;
        },
        sortable: false
      }
    ];
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.getKYCDocumentTypes();
    this.orderingAsyncCalls().then();
    this.adminMenuId = GridMenuIds.CLIENTS_KYC;

  }

  private async orderingAsyncCalls() {
    await this.getKYCDocumentTypes();
    await this.getKycDocumentStates();
    this.initFirstCoumn();
    this.getKYCData();
  }

  getKYCDocumentTypes(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.apiService.apiPost(this.configService.getApiUrl, {}, true,
        Controllers.ENUMERATION, Methods.GET_KYC_DOCUMENT_TYPES_ENUM).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.documentTypeName = data.ResponseObject;
            console.log(this.documentTypeName, "this.documentTypeName");
            
            return resolve('success');
          } else {
            return resolve('for continuing');
          }
        });
    });
  }

  getKycDocumentStates(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.apiService.apiPost(this.configService.getApiUrl, {}, true,
        Controllers.ENUMERATION, Methods.GET_KYC_DOCUMENT_STATES_ENUM).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.documentStateName = data.ResponseObject;
            return resolve('success');
          } else {
            return resolve('for continuing');
          }
        });
    });
  }

  initFirstCoumn() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.NameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.UserFirstName !== null || params.data.UserLastName !== null) {
            a.innerHTML = params.data.UserFirstName + ' ' + params.data.UserLastName;
          }
          return a;
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.DocumentType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DocumentTypeId',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this),
          Selections: this.documentTypeName,
        },
        editable: true,
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange1['bind'](this),
          Selections: this.documentStateName,
        },
        editable: true,
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Payments.ExpirationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExpirationTime',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: 'datePickerRenderer',
        cellRendererParams: {
          onchange: this.onDateChange['bind'](this),
        },
        editable: true,
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Partners.LastUpdate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ImagePath',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: 'imageRenderer',
        cellRendererParams: {
          onClick: this.viewPic['bind'](this),
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.Notes',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true,
        cellRenderer: params => {
          let keyData = params.data.HasNote;
          let newButton = `<button class="button-view-1" data-action-type="add">Add Note</button>`;
          let newButton2 = `<button class="button-view-2" data-action-type="add">Add</button>
             <button class="button-view-2" data-action-type="view">View</button>`
          if (keyData === false) {
            return newButton;
          } else if (keyData === true) {
            return newButton2;
          }
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 150,
        sortable: false,
        filter: false,
        suppressMenu: true,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveFinishes['bind'](this),
          Label: 'Save',
          bgColor: '#3E4D66',
          textColor: 'white',
          isDisabled: true,
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      }
    ];
    this.rowClassRules = {
      'kyc-status-2': (params) => {
        let numSickDays = params.data.State;
        return numSickDays === 2;
      },
      'kyc-status-1': (params) => {
        let numSickDays = params.data.State;
        return numSickDays === 1;
      },
    };
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.agGrid.api.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;

        }
      })
      this.agGrid.api.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.agGrid.api.redrawRows({ rowNodes: [findedNode] });
    }
  }

  saveFinishes(params) {
    const row = params.data;
    let sData = {
      DocumentStatesName: params.data.DocumentStateName,
      DocumentTypesName: params.data.DocumentTypeName,
      DocumentTypeId: row.DocumentTypeId,
      State: row.State,
      ExpirationTime: row.ExpirationTime,
      ClientId: row.ClientId,
      Id: row.Id
    };
    this.apiService.apiPost(this.configService.getApiUrl, sData, true,
      Controllers.CLIENT, Methods.UPDATE_CLIENT_IDENTITY_MODEL).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.agGrid.api.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.stateService.getInfo(true);
          this.onRowSelected(params);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getKYCData() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_IDENTITY_MODEL).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {

          this.rowData = data.ResponseObject.map((items) => {
            items.DocumentTypeName = this.documentTypeName.find((item => item.Id === items.DocumentTypeId))?.Name;
            // items.DocumentStateName = this.documentStateName.find((item => item.Id === items.State))?.Name;
            return items;
          })
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSelectChange(params, val, param) {
    params.DocumentTypeId = val;
    this.onCellValueChanged(param)
  }

  onSelectChange1(params, val, param) {
    params.State = val;
    this.onCellValueChanged(param)
  }

  onRowSelected(params) {
    if (params.node.selected) {
      this.blockedData = params;
      this.apiService.apiPost(this.configService.getApiUrl, { ObjectId: params.data.Id, ObjectTypeId: 57 }, true,
        Controllers.REPORT, Methods.GET_OBJECT_CHANGE_HISTORY).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.rowData2 = data.ResponseObject;
            setTimeout(() => { this.gridApi.sizeColumnsToFit(); }, 0);
          } else {
            this.rowData2 = [];
          }
        });
    }
  }

  isRowSelected() {
    return this.gridApi && this.gridApi?.getSelectedRows().length === 0;
  }

  onGridReady(params) {
    syncNestedColumnReset();
    this.gridApi = params.api;
    super.onGridReady(params);
    syncColumnSelectPanel();
  }

  async create() {
    const { CreateNewDocumentComponent } = await import('../kyc/create-new-document/create-new-document.component');
    const dialogRef = this.dialog.open(CreateNewDocumentComponent, { width: ModalSizes.MEDIUM });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.rowData.push(data);
        this.gridApi.setRowData(this.rowData);
        this.rowData2 = [];
      }
      this.getKYCData();
    });
  }

  delete() {
    if (!this.blockedData) {
      this.selected = false;
    } else {
      this.apiService.apiPost(this.configService.getApiUrl, this.blockedData.data.Id, true,
        Controllers.CLIENT, Methods.REMOVE_CLIENT_IDENTITY).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.rowData.splice(this.blockedData.rowIndex, 1);
            this.gridApi.setRowData(this.rowData);
            this.selected = false;
            this.rowData2 = [];
            this.getKYCData();
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
    }
  }

  async addNotes(params) {
    const { AddNoteComponent } = await import('../../../../../../components/add-note/add-note.component');
    const dialogRef = this.dialog.open(AddNoteComponent, {
      width: ModalSizes.MEDIUM,
      data: { ObjectId: params.Id, ObjectTypeId: 57 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getKYCData();
      }
    });
  }

  async openNotes(params) {
    const { ViewNoteComponent } = await import('../../../../../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: { ObjectId: params.Id, ObjectTypeId: 57, Type: 1 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) { }
    });
  }

  public onRowClicked(e) {
    console.log(this.gridApi.getSelectedRows().length === 0, "this.gridApi.getSelectedRows().length === 0");
    
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "add":
          return this.addNotes(data);
        case "view":
          return this.openNotes(data);
      }
    }
  }

  async viewPic(params) {
    const { ViewImageComponent } = await import('../kyc/view-image/view-image.component');
    const dialogRef = this.dialog.open(ViewImageComponent, {
      width: ModalSizes.MEDIUM,
      data: { value: params.value, clientId: this.clientId }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {

      }
    });
  }

  onDateChange(params, val, param) {
    params.ExpirationTime = val.value;
    this.onCellValueChanged(param)
  }

  exportToCsv() {
    this.exportService.exportToCsv( Controllers.CLIENT, Methods.EXPORT_CLIENT_IDENTITY, this.clientId);
  }

}
