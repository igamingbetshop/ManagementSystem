import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CellClickedEvent } from 'ag-grid-community';
import { take } from 'rxjs/operators';
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { CommonDataService } from 'src/app/core/services';

@Component({
  selector: 'app-multiple-bonuses',
  templateUrl: './multiple-bonuses.component.html',
  styleUrls: ['./multiple-bonuses.component.scss']
})
export class MultipleBonusesComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public path: string = 'bonuses/multiplebonuses';
  public partners: any[] = [];
  public bonusSettings: any[] = [];
  public partnerId;

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private commonDataService: CommonDataService,
    protected injector: Injector,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_MULTIPLE_BOUNUSES;
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
        headerName: 'Common.BonusSettingId',
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
    this.partners = this.commonDataService.partners;
    this.getbonusSettings();
    setTimeout(() => {
      this.getPage()
    });
  }

  getbonusSettings() {
    let data = {
      PageIndex: 0,
      PageSize: 5000,
    };
    this.apiService.apiPost('bonuses/bonussettings', data).subscribe(data => {
      if (data.Code === 0) {
        this.bonusSettings = data.ResponseObject.map((obj) => {
          return { Id: obj.Id, TypeId: obj.TypeId, Name: obj.Id + '-' + obj.Name }
        });        
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

    const { AddBonusComponent } = await import('./add-bonus/add-bonus.component');
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
    let data = {
      PageIndex: 0,
      PageSize: 5000,
      PartnerId: null,
    };
    if (this.partnerId) {
      data.PartnerId = this.partnerId
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
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onPartnerChange(value) {
    this.partnerId = value;
    this.getPage();
  }

}
