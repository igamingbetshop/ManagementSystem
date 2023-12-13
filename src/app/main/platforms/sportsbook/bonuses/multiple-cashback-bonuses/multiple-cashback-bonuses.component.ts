import {Component, OnInit, Injector,} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CellClickedEvent} from 'ag-grid-community';
import {take} from 'rxjs/operators';
import {GridMenuIds, GridRowModelTypes, ModalSizes} from 'src/app/core/enums';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {SportsbookApiService} from '../../services/sportsbook-api.service';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-multiple-cashback-bonuses',
  templateUrl: './multiple-cashback-bonuses.component.html',
  styleUrls: ['./multiple-cashback-bonuses.component.scss']
})
export class MultipleCashbackBonusesComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public path: string = 'bonuses/multiplecashbackbonuses';
  public partners: any[] = [];
  public bonusSettings: any[] = [];
  public partnerId;

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    protected injector: Injector,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_MULTIPLE_CASHBACK_BOUNUSES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        minWidth: 100,
        tooltipField: 'Id',
        cellStyle: {color: '#076192', 'font-size': '12px', 'font-weight': '500'},
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Sport.BonusSettingId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusSettingId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
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

  ngOnInit() {
    this.gridStateName = 'bonus-multiple-cashback-grid-state';
    this.getPartners();
    this.getbonusSettings();
    setTimeout(() => {
      this.getPage()
    });
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  getbonusSettings() {
    this.apiService.apiPost('bonuses/bonussettings').subscribe(data => {
      if (data.Code === 0) {
        this.bonusSettings = data.ResponseObject.map((obj) => {
          return {Id: obj.Id, TypeId: obj.TypeId, Name: obj.Id + '-' + obj.Name}
        });
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  async editBonus(params) {
    const row = params.data;
    const {AddBonusComponent} = await import('./add-bonus/add-bonus.component');
    const dialogRef = this.dialog.open(AddBonusComponent, {
      width: ModalSizes.SMALL, data: {
        partners: this.partners,
        bonusSettings: this.bonusSettings, bonus: row
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }


  async addBonus() {

    const {AddBonusComponent} = await import('./add-bonus/add-bonus.component');
    const dialogRef = this.dialog.open(AddBonusComponent, {
      width: ModalSizes.SMALL, data: {
        partners: this.partners,
        bonusSettings: this.bonusSettings, bonus: {}
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
            let partnerName = this.partners.find((partner) => {
              return partner.Id == bonus.PartnerId;
            })
            if (partnerName) {
              bonus['PartnerName'] = partnerName.Name;
            }
          });
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  onPartnerChange(value) {
    this.partnerId = value;
    this.getPage();
  }

}
