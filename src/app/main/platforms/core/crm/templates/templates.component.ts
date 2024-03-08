import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { CommonDataService } from 'src/app/core/services/common-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes, ObjectTypes } from 'src/app/core/enums';
import { mergeMap, take } from 'rxjs/operators';
import 'ag-grid-enterprise';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { CellDoubleClickedEvent, IRowNode, RowNode, ValueFormatterParams } from 'ag-grid-community';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partners: any[] = [];
  public partnersVerificationTypes: any[] = [];

  public delPath = '/delete';
  private messageTemplateStates = [];

  public frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
    numericEditor: NumericEditorComponent,
  };

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_CRM_TAMPLATES;
  }

  ngOnInit() {
    this.mergeTemplateEnumsApi();
    this.gridStateName = 'crm-templates-grid-state';
    this.partners = this.commonDataService.partners;
    this.getPage();
  }

  mergeTemplateEnumsApi() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_MESSAGE_TEMPLATE_STATES_ENUM)
      .pipe(
        mergeMap(data => {
          if (data.ResponseCode === 0) {
            this.messageTemplateStates = data.ResponseObject;
          }
          return this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_PARTNERS_VERIFICATION_TYPE_ENUM);
        }))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.partnersVerificationTypes = data.ResponseObject;
          this.initColumnDefs();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  initColumnDefs() {
    this.columnDefs = [
      {
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event);
        }
      },
      {
        headerName: 'Common.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        sortable: true,
        editable: true,
        cellEditor: 'textEditor',
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
        headerName: 'Common.ExternalTemplateId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalTemplateId',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.Info',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientInfoType',
        resizable: true,
        sortable: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this),
          Selections: this.partnersVerificationTypes,
        },
        floatingFilter: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          values: this.partnersVerificationTypes.map(item => item.Id),
          debounceMs: 200,
          suppressFilterButton: true,
          valueFormatter: (
            params: ValueFormatterParams
          ) => params.value = this.partnersVerificationTypes.find(item => item.Id == params.value)?.Name,
        },
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        sortable: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectStateChange.bind(this),
          Selections: this.messageTemplateStates,
        },
        floatingFilter: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          values: this.messageTemplateStates.map(item => item.Id),
          debounceMs: 200,
          suppressFilterButton: true,
          valueFormatter: (
            params: ValueFormatterParams
          ) => params.value = this.messageTemplateStates.find(item => item.Id == params.value)?.Name,
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
          onClick: this.saveTemplateSettings['bind'](this),
          Label: 'Save',
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      }
    ];
  }

  createStateIdToNameMap(states) {
    const stateIdToNameMap = {};
    states.forEach(item => {
      stateIdToNameMap[item.Id] = item.Name;
    });
    return stateIdToNameMap;
  }

  saveTemplateSettings(params) {
    const row = params.data;
    this.apiService.apiPost(this.configService.getApiUrl, row,
      true, Controllers.CONTENT, Methods.SAVE_MESSAGE_TEMPLATES)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Templates successfully updated', Type: "success" });
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.getPage();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  onSelectChange(params, value, event) {
    params.ClientInfoType = value;
    this.onCellValueChanged(event);
  }

  onSelectStateChange(params, value, event) {
    params.State = value;
    this.onCellValueChanged(event);
  }

  async cellDoubleClicked(event: CellDoubleClickedEvent) {
    const id = event.value;
    const { AddEditTranslationComponent } = await import('../../../../components/add-edit-translation/add-edit-translation.component');
    const dialogRef = this.dialog.open(AddEditTranslationComponent, {
      width: ModalSizes.MEDIUM, data: {
        ObjectId: id,
        ObjectTypeId: ObjectTypes.MessageTemplate
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
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

  async AddSTemplate() {
    const { AddTemplatesComponent } = await import('./add-templates/add-templates.component');
    const dialogRef = this.dialog.open(AddTemplatesComponent, {
      width: ModalSizes.SMALL, data: {
        partners: this.partners,
        types: this.partnersVerificationTypes,
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getPage();
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPage() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.CONTENT, Methods.GET_MESSAGE_TEMPLATES).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
          this.rowData.forEach((payment) => {
            payment['PartnerName'] = this.partners.find((partner) => partner.Id == payment.PartnerId)?.Name;
          });

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  async deleteItem() {
    const row = this.gridApi.getSelectedRows()[0];
    const { ConfirmComponent } = await import('../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost(this.configService.getApiUrl, row.Id,
          true, Controllers.CONTENT, Methods.REMOVE_MESSAGE_TEMPLATE)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.getPage();
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    })
  }

}
