import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {GridRowModelTypes} from "../../../../../../../core/enums";
import {ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../../../../../../core/services";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {take} from "rxjs/operators";
import {AgBooleanFilterComponent} from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {ButtonRendererComponent} from "../../../../../../components/grid-common/button-renderer.component";
import {NumericEditorComponent} from "../../../../../../components/grid-common/numeric-editor.component";
import {CheckboxRendererComponent} from "../../../../../../components/grid-common/checkbox-renderer.component";
import {IRowNode} from "ag-grid-community";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {SkillGamesApiService} from "../../../../services/skill-games-api.service";

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss']
})
export class KeysSGComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partnerId;
  public partnerName;
  public frameworkComponents;

  constructor(private apiService: SkillGamesApiService,
              private activateRoute: ActivatedRoute,
              protected injector: Injector,
              public configService: ConfigService,
              public dialog: MatDialog,
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
        headerName: 'Common.GameProviderId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameProviderId',
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
        headerName: 'Payments.PaymentSystemId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PaymentSystemId',
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
        headerName: 'Payments.NotificationServiceId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NotificationServiceId',
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
        headerName: 'Common.NumericValue',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NumericValue',
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
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      },
    ];
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
      checkBoxRenderer: CheckboxRendererComponent,
    }
  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getPartnerKeys();
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let rowNode = event.node.rowIndex;
      this.gridApi.forEachNode(node => {
        if (node.rowIndex == rowNode) {
          findedNode = node;
        }
      })
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({rowNodes: [findedNode]});
    }
  }

  getPartnerKeys() {
    const path = 'partners/getpartnerkeys';
    this.apiService.apiPost(path, {PartnerId: +this.partnerId})
      .pipe(take(1))
      .subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  saveCategorySettings(params) {
    const path = 'partners/savepartnerkey';
    this.apiService.apiPost(path, params.data)
      .pipe(take(1))
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.getPartnerKeys();
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });

  }
}
