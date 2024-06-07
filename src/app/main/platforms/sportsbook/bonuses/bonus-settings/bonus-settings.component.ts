import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { CellClickedEvent } from 'ag-grid-community';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';

@Component({
  selector: 'app-bonus-settings',
  templateUrl: './bonus-settings.component.html',
  styleUrls: ['./bonus-settings.component.scss']
})
export class BonusSettingsComponent extends BasePaginatedGridComponent implements OnInit {

  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  path: string = 'bonuses/bonussettings';
  bonusTypes: any[] = [];
  bonusChannels: any[] = [];
  partners: any[] = [];
  partnerId: number;
  regions: any;
  frameworkComponents = {
    agDropdownFilter: AgDropdownFilter,
  };
  isSendingReqest = false;

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    protected injector: Injector,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_BOUNUS_SETTINGS;


  }

  ngOnInit() {
    this.gridStateName = 'bonus-settings-grid-state';
    this.getBonusesTypes();
    this.getChannels();
    this.getPartners();
    this.setColdefs();
    this.getPage();
  }

  setColdefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 100,
        tooltipField: 'Id',
        cellStyle: { color: '#076192', 'font-size': '12px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Common.ChannelName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChanelName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Common.SelectionsMinCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionsMinCount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Sport.SelectionsMaxCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionsMaxCount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'BetShops.BonusPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusPercent',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MinTotalCoef',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MinTotalCoef',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Sport.MinCoeff',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MinCoeff',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Bonuses.MaxAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxAmount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Bonuses.MinAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MinAmount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Products.ExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExternalId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Bonuses.Country',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CountryCode',
        resizable: true,
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Bonuses.TurnoverCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TurnoverCount',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: function (params) {
          return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
           visibility
           </i>`
        },
        onCellClicked: (event: CellClickedEvent) => this.editBonus(event),
      },

    ];
  }


  getBonusesTypes() {
    this.apiService.apiPost('utils/bonustypes', {})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.bonusTypes = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getChannels() {
    this.apiService.apiPost('utils/channels', {})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.bonusChannels = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  async editBonus(params) {
    const row = params.data;
    const { AddBonusComponent } = await import('./add-bonus/add-bonus.component');
    const dialogRef = this.dialog.open(AddBonusComponent, {
      width: ModalSizes.SMALL, data: {
        partners: this.partners,
        bonusTypes: this.bonusTypes, bonusChannels: this.bonusChannels, bonus: row
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }

  async addBonus() {
    const { AddBonusComponent } = await import('./add-bonus/add-bonus.component');
    const dialogRef = this.dialog.open(AddBonusComponent, {
      width: ModalSizes.SMALL, data: {
        partners: this.partners,
        bonusTypes: this.bonusTypes, bonusChannels: this.bonusChannels, bonus: {}
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
    let data = {};
    if (this.partnerId) {
      data = {
        PartnerId: this.partnerId
      }
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
            let bonusName = this.bonusTypes.find((type) => {
              return type.Id == bonus.TypeId;
            })
            if (bonusName) {
              bonus['TypeName'] = bonusName.Name;
            }
            let partnerName = this.partners.find((partner) => {
              return partner.Id == bonus.PartnerId;
            })
            if (partnerName) {
              bonus['PartnerName'] = partnerName.Name;
            }
            let chanelName = this.bonusChannels.find((chanel) => {
              return chanel.Id == bonus.ChannelId;
            })
            if (chanelName) {
              bonus['ChanelName'] = chanelName.Name;
            }
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onDeleteBounus() {
    this.isSendingReqest = true;
    const row = this.gridApi.getSelectedRows()[0];
    this.apiService.apiPost('bonuses/deletebonussetting', row).subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: "Deleted", Type: "success" });
        this.getPage();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false;
    });
  }

  isRowSelected() {
    return  this.gridApi?.getSelectedRows().length == 0;
  };

  onPartnerChange(value) {
    this.partnerId = value;
    this.getPage();
  }

}
