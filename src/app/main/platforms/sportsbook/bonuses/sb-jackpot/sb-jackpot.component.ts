import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { IRowNode } from 'ag-grid-community';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { CommonDataService } from 'src/app/core/services';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';

@Component({
  selector: 'app-sb-jackpot',
  templateUrl: './sb-jackpot.component.html',
  styleUrls: ['./sb-jackpot.component.scss']
})
export class SBJackPotComponent extends BasePaginatedGridComponent implements OnInit {

  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  path: string = 'bonuses/getjackpots';
  updatePath = 'bonuses/savejackpot';
  jackpotTypes: any[] = [];
  statuses = ACTIVITY_STATUSES;
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
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    protected injector: Injector,
    private commonDataService:CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_JACKPOT;
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.setColdefs();
    this.getPage();
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
      this.onUpdateRow(event);
      this.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
  }

  onUpdateRow(params) {
    let row = params.data;
    delete row.UserId;
    this.apiService.apiPost(this.updatePath, row).subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });
        // this.getPage();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
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
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        editable: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this, "Status"),
          Selections: this.statuses,
        },
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
      },
      {
        headerName: 'Clients.Amount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Amount',
      },
      {
        headerName: 'Sport.BetPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BetPercent',
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.WinnerBetId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'WinnerBetId',
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
      },
      {
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
      },
      // {
      //   headerName: 'Common.View',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   cellRenderer: function (params) {
      //     return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
      //      visibility
      //      </i>`
      //   },
      //   onCellClicked: (event: CellClickedEvent) => this.editBonus(event),
      // },

    ];
  }

  // getBonusesTypes() {
  //   this.apiService.apiPost('utils/bonusesTypes', {})
  //     .pipe(take(1))
  //     .subscribe(data => {
  //       if (data.Code === 0) {
  //         this.jackpotTypes = data.ResponseObject;
  //       } else {
  //         SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
  //       }
  //     });
  // }


  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  async addBonus() {
    const { AddSBJackpotComponent } = await import('./add-sb-jackpot/add-sb-jackpot.component');
    const dialogRef = this.dialog.open(AddSBJackpotComponent, {
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
    this.apiService.apiPost(this.path, data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
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
            bonus.CreationTime = bonus.CreationTime ? new Date(bonus.CreationTime).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;            
            bonus.LastUpdateTime = bonus.LastUpdateTime ? new Date(bonus.LastUpdateTime).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : null;            

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

  onSelectChange(key, params, val, event) {
    params[key] = val;
    this.onUpdateRow(event);
  }

  // onDeleteBounus() {
  //   this.isSendingRequest = true;
  //   const row = this.gridApi.getSelectedRows()[0];
  //   this.apiService.apiPost('bonuses/deletebonussetting', row).subscribe(data => {
  //     if (data.Code === 0) {
  //       SnackBarHelper.show(this._snackBar, { Description: "Deleted", Type: "success" });
  //       this.getPage();
  //     } else {
  //       SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
  //     }
  //     this.isSendingRequest = false;
  //   });
  // }

  isRowSelected() {
    return  this.gridApi?.getSelectedRows().length == 0;
  };

  onPartnerChange(value) {
    this.partnerId = value;
    this.getPage();
  }

}
