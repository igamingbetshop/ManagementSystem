import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { CellClickedEvent } from 'ag-grid-community';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { CommonDataService } from 'src/app/core/services';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { CoreApiService } from '../../services/core-api.service';
import { ActivatedRoute } from '@angular/router';

export const JACKPOT_TYPE_STATUSES = [
  { Id: 1, Name: 'Progressive' },
  { Id: 2, Name: 'Fixed' },
]

@Component({
  selector: 'app-core-jackpot',
  templateUrl: './core-jackpot.component.html',
  styleUrls: ['./core-jackpot.component.scss']
})
export class CoreJackPotComponent extends BasePaginatedGridComponent implements OnInit {

  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  jackpotTypes: any[] = [];
  partners: any[] = [];
  partnerId: number;
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };
  isSendingRequest = false;
  public frameworkComponents = {
    selectRenderer: SelectRendererComponent,
    numericEditor: NumericEditorComponent,
  };

  constructor(
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public activateRoute: ActivatedRoute,
    protected injector: Injector,
    private commonDataService:CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_JAKPOT;
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.setColdefs();
    this.getPage();
  }


  setColdefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        editable: true,
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
      },
      {
        headerName: 'Common.Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Amount',
      },
      // {
      //   headerName: 'Sport.SecondaryAmount',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   field: 'SecondaryAmount',
      //   editable: true,
      // },
      // {
      //   headerName: 'Sport.WinnedClient',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   field: 'WinnedClient',
      // },
      {
        headerName: 'Common.RightBorder',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RightBorder',
      },
      {
        headerName: 'Common.LeftBorder',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LeftBorder',
      },
      {
        headerName: 'Clients.CreationDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationDate',
      },
      {
        headerName: 'Common.LastUpdateDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateDate',
      },
      {
        headerName: 'Common.FinishTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FinishTime',
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: function (params) {
          return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
           visibility
           </i>`
        },
        onCellClicked: (event: CellClickedEvent) => this.onNavigateToJackpot(event),
      },

    ];
  }

  async addBonus() {
    const { AddCoreJackpotComponent } = await import('./add-core-jackpot/add-core-jackpot.component');
    const dialogRef = this.dialog.open(AddCoreJackpotComponent, {
      width: ModalSizes.SMALL, data: {
        partners: this.partners,
        jackpotTypes: this.jackpotTypes, jackpot: {}
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPage() {
    let data = {     
      PageIndex: 0,
      PageSize: 5000,
      PartnerId: null,
    };
    if (this.partnerId) {
      data.PartnerId = this.partnerId;
    }
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.BONUS, Methods.GET_JACKPOTS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          if (this.partnerId) {
            this.rowData = data.ResponseObject.filter((items) => {
              if (items.PartnerId === this.partnerId) {
                return this.rowData
              }
            })
          } else {
            this.rowData = data.ResponseObject;
          }
          this.rowData.forEach(bonus => {
            bonus.Type = JACKPOT_TYPE_STATUSES.find((type) => { return type.Id == bonus.Type })?.Name;
            bonus.CreationDate = bonus.CreationDate ? new Date(bonus.CreationDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;            
            bonus.LastUpdateDate = bonus.LastUpdateDate ? new Date(bonus.LastUpdateDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;            
            bonus.FinishTime = bonus.FinishTime ? new Date(bonus.FinishTime).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;            
            let partnerName = this.partners.find((partner) => {
              return partner.Id == bonus.PartnerId;
            })
            if (partnerName) {
              bonus['PartnerName'] = partnerName.Name;
            }
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }        
      });
  }

  // onDeleteBounus() {
  // }

  isRowSelected() {
    return  this.gridApi?.getSelectedRows().length == 0;
  };

  onPartnerChange(value) {
    this.partnerId = value;
    this.getPage();
  }

  onNavigateToJackpot(event) {
    let jackpotId = event.data.Id;
    this.router.navigate(['/main/platform/bonuses/jackpots/jackpot'], { queryParams: { Id: jackpotId } });
  }

}
