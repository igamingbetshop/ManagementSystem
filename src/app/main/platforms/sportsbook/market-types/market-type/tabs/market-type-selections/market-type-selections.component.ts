import { Component, Injector, OnInit, signal, WritableSignal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfigService } from "../../../../../../../core/services";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { GridRowModelTypes } from 'src/app/core/enums';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { IMarketType } from '../../../martet-type.interface'
import { MARKET_TYPE_STATUSES } from '../../../market-type-common/market-type-statuses';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';

@Component({
  selector: 'app-market-type-selections',
  templateUrl: './market-type-selections.component.html',
  styleUrls: ['./market-type-selections.component.scss']
})
export class MarketTypeSelectionsComponent extends BaseGridComponent implements OnInit {
  public partnerId: number;
  public marketTypeId: number;
  marketEntity: WritableSignal<IMarketType | null> = signal<IMarketType | null>(null);
  statuses = MARKET_TYPE_STATUSES;
  frameworkComponents = {
    numericEditor: NumericEditorComponent,
    buttonRenderer: ButtonRendererComponent,
  };
  public partnerName;
  public formGroup: UntypedFormGroup;
  public states = [
    { Id: 1, Name: 'Active' },
    { Id: 2, Name: 'Blocked' }
  ]
  public isEdit = false;
  updateSelectionType = 'markettypes/updateselectiontype';
  rowData: WritableSignal<[]> = signal<[]>(null);
  selectionHystoryData: WritableSignal<[]> = signal<[]>(null);
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  filter = {
    PageIndex: 0,
    PageSize: 5000,
    Ids: {},
    PartnerId: undefined,
  };
  selectPath: string = 'markettypes/selectiontypes';
  selectedRowId: WritableSignal<number | null> = signal<number | null>(null);
  selectionColumnDefs = []
  constructor(
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    protected injector: Injector
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
        headerName: 'Common.CalculationFormula',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CalculationFormula',
        resizable: true,
        editable: true,
        cellEditor: 'textEditor',
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
    this.selectionColumnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserFirstName',
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserLastName',
      },
      {
        headerName: 'Common.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
      },
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Object.Name',
      },
      {
        headerName: 'Common.CalculationFormula',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Object.CalculationFormula',
      },
      {
        headerName: 'Clients.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Object.Priority',
      },
      
    ]
  }

  ngOnInit() {
    this.marketTypeId = +this.activateRoute.snapshot.queryParams.marketTypeId;
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getSelectionsData(this.marketTypeId);
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


  getSelectionsData(id: number) {
    this.apiService.apiPost(this.selectPath, { 'MarketTypeId': id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData.set(data.Selections);
          this.selectedRowId.set(data.Selections[0].Id);
          this.getObjectChangeHistory(this.selectedRowId());
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onRowClicked(event) {
    this.selectedRowId.set(event.data.Id);
    this.getObjectChangeHistory(event.data.Id);
  }


  getObjectChangeHistory(id: number) {
    this.apiService.apiPost('common/objectchangehistory', { ObjectId: id, ObjectTypeId: 8 })
      .pipe(take(1)).subscribe((data) => {
        if (data.Code === 0) {
          this.selectionHystoryData.set(data.ResponseObject.map((items) => {
            items.Object = JSON.parse(items.Object);
            items.LimitPercent = items.Object.LimitPercent;
            return items
          }));          
        }
      })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
      this.apiService.apiPost('markettypes/update', obj).subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
          this.marketEntity.set(data.ResponseObject);
          this.formGroup.patchValue(data.ResponseObject);
          this.isEdit = false;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
    }
    

}
