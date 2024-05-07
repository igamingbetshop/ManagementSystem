import {ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Controllers, GridRowModelTypes, Methods, ModalSizes} from "../../../../../../../core/enums";
import {AgGridAngular} from "ag-grid-angular";
import {AgBooleanFilterComponent} from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {ButtonRendererComponent} from "../../../../../../components/grid-common/button-renderer.component";
import {NumericEditorComponent} from "../../../../../../components/grid-common/numeric-editor.component";
import {ColorEditorComponent} from "../../../../../../components/grid-common/color-editor.component";
import {CheckboxRendererComponent} from "../../../../../../components/grid-common/checkbox-renderer.component";
import {TextEditorComponent} from "../../../../../../components/grid-common/text-editor.component";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import {take} from "rxjs/operators";
import {SelectRendererComponent} from "../../../../../../components/grid-common/select-renderer.component";
import {IRowNode} from "ag-grid-community";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import { MatDialog } from '@angular/material/dialog';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-currency-settings',
  templateUrl: './currency-settings.component.html',
  styleUrls: ['./currency-settings.component.scss']
})
export class CurrencySettingsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('agGrid1') agGrid1: AgGridAngular;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partnerId;
  public partnerName;
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    colorEditor: ColorEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    selectRenderer: SelectRendererComponent,
    textEditor: TextEditorComponent,
  };
  public columnDefs = [];
  public rowData = [];
  public rowData1 = [];
  public columnDefs1 = [];
  public statusName = ACTIVITY_STATUSES;
  public blockedData;
  public formGroup: UntypedFormGroup;

  constructor(private apiService: CoreApiService,
              private commonDataService: CommonDataService,
              private fb: UntypedFormBuilder,
              private activateRoute: ActivatedRoute,
              public configService: ConfigService,
              protected injector: Injector,
              private ref: ChangeDetectorRef,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog
              ) {
    super(injector);
    this.columnDefs = [
      {
        field: '',
        minWidth: 20,
        checkboxSelection: true,
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
      }
    ];
    this.columnDefs1 = [
      // {
      //   field: '',
      //   minWidth: 20,
      //   checkboxSelection: true,
      // },
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        editable: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange1['bind'](this),
          Selections: this.statusName,
        },
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Payments.UserMinLimit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserMinLimit',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Payments.UserMaxLimit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserMaxLimit',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Payments.ClientMinBet',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientMinBet',
        sortable: true,
        resizable: true,
        editable: true,
        cellEditor: 'numericEditor',
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
          onClick: this.editCurrencySetting['bind'](this),
          Label: 'Save',
          isDisabled: true,
        }
      },
    ]
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getCurrencies();
    this.formValues();
  }

  formValues() {
    this.formGroup = this.fb.group({
      State: [null, [Validators.required]],
      CurrencyId: [null],
    })
  }

  getCurrencies() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.CURRENCY, Methods.GET_PARTNER_CURRENCY_SETTINGS).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        let currencyArray = [];
        data.ResponseObject.currencies.forEach((item, i) => {
          item = data.ResponseObject.currencies[i]
          currencyArray.push({
            CurrencyId: data.ResponseObject.currencies[i]
          });
          return item
        })
        this.rowData = currencyArray;
        this.rowData1 = data.ResponseObject.partnerCurrencies;
        this.rowData1.forEach((entity) => {
          let selectionStatusName = this.statusName.find((stat) => {
            return stat.Id == entity.State;
          })
          if (selectionStatusName) {
            entity['StateName'] = selectionStatusName.Name;
          }
        })
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  onSelectChange1(params, val, param) {
    params.State = val;
    this.onCellValueChanged(param)
  }


  onRowClicked(params) {
    this.blockedData = params;
  }

  isRowSelected() {
    return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length === 0;
  };

  onGridReady(params) {
    super.onGridReady(params);
  }

  addCurrencyToPartner() {
    let selectedNodes = this.agGrid?.api.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    this.formGroup.get('CurrencyId').setValue(selectedData[0].CurrencyId);
    if (!this.formGroup.valid) {
      return;
    }
    const setting = this.formGroup.getRawValue();
    setting.PartnerId = +this.partnerId;
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.CURRENCY, Methods.SAVE_PARTNER_CURRENCY_SETTING).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.getCurrencies();
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  editCurrencySetting(params) {
    this.apiService.apiPost(this.configService.getApiUrl, params.data, true,
      Controllers.CURRENCY, Methods.SAVE_PARTNER_CURRENCY_SETTING).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
        this.getCurrencies();
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  get errorControl() {
    return this.formGroup.controls;
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
      this.gridApi.redrawRows({rowNodes: [findedNode]});
    }
  }

  async copyPartnerSettings() {
    const {CopySettingsComponent} = await import('../copy-settings/copy-settings.component');
    const dialogRef = this.dialog.open(CopySettingsComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        lable: "Copy Payment Settings",
        method: "CLONE_WEBSITE_MENU_BY_PARTNER_ID"
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        // this.getWebsiteMenus();
      }
    });
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
}
