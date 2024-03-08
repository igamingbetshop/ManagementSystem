import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';

import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from 'rxjs/operators';

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { ACTIVITY_STATUSES, ENVIRONMENTS_STATUSES } from 'src/app/core/constantes/statuses';
import { CommonDataService } from 'src/app/core/services';
import { CellDoubleClickedEvent } from 'ag-grid-community';
import { CharacterChildsComponent } from './character-childs/character-childs.component';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-gamifications',
  templateUrl: './all-gamifications.component.html',
  styleUrls: ['./all-gamifications.component.scss']
})
export class AllGamificationsComponent extends BasePaginatedGridComponent implements OnInit, OnDestroy  {

  @ViewChild(CharacterChildsComponent) characterChildsComponent: CharacterChildsComponent;

  partnerId;
  rowData = [];
  frameworkComponents;
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  partners: any[] = [];
  statuses: any[] = ACTIVITY_STATUSES;
  environments: any[] = ENVIRONMENTS_STATUSES
  characterChilds: any[] = [];
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };
  childId: number;
  canCreateChild = false;
  charakterId: any;
  allData = [];
  charakterPartner: any;
  rowClassRules = {
    'active-row': params => params.node.isSelected()
  };
  private routerSubscription: Subscription;


  constructor(
    protected injector: Injector,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute,
    public commonDataService: CommonDataService,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_GAMIFICATION;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
      },
      {
        headerName: 'Partners.Title',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Title',
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event, 94);
        }
      },
      {
        headerName: 'Bonuses.Description',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Description',
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event, 95);
        }
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
      },
      {
        headerName: 'Common.Order',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Order',
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: 'gamification', queryParams: { gamificationId: params.data.Id } };
          return data;
        },
        sortable: false
      },
    ]
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    }
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.rowData.length) {
        this.getRows();
      }
    });
  }

  getByPartnerData(event) {
    this.partnerId = event;
    this.getRows();
    this.characterChilds = [];
  }

  onAddChildGamification() {
    this.onAddGamification(this.charakterId, this.partnerId, true)
  }

  async onAddGamification(charakterId?, partnerId?, compPoint = false) {
    const { AddGamificationComponent } = await import('./add-gamifications/add-gamification.component');
    const dialogRef = this.dialog.open(AddGamificationComponent, { width: ModalSizes.SMALL, data: { paretnId: charakterId ?? null, partnerId: partnerId ?? null } });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getRows();
        this.characterChilds = [];
      }
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  async cellDoubleClicked(event: CellDoubleClickedEvent, typeId) {
    const id = event.data.Id;
    const { AddEditTranslationComponent } = await import('../../../../components/add-edit-translation/add-edit-translation.component');
    const dialogRef = this.dialog.open(AddEditTranslationComponent, {
      width: ModalSizes.MEDIUM, data: {
        ObjectId: id,
        ObjectTypeId: typeId
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getRows();
      }
    })
  }

  getRows() {
    this.apiService.apiPost(this.configService.getApiUrl, this.partnerId,
      true, Controllers.PARTNER, Methods.GET_CHARACTER_HIERARCHY).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.allData = data.ResponseObject;
          const rowData = []
          this.allData.forEach(item => {
            rowData.push(item.Parent);
          });

          rowData.forEach(item => {
            item.PartnerName = this.partners.find(x => x.Id === item.PartnerId).Name;
            item.Status = item.Status === 1 ? 'Active' : 'Inactive';

          })
          this.rowData = rowData;
          this.setChildData(this.childId);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onRowClicked(event: any) {
    const id = event.data.Id;

    this.childId = this.rowData.findIndex(x => x.Id === id);

    this.characterChilds = this.allData.find(item => item.Parent.Id === id)?.Children;
    this.charakterId = id;
    this.charakterPartner = event.data.PartnerId;
    this.canCreateChild = true;
  }

  setChildData(event) {
    this.characterChilds = this.allData[event]?.Children;
    this.canCreateChild = true;

  }

  createChildCharacter(event) {
    this.charakterId = event.ParentId;
    this.canCreateChild = true;
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
