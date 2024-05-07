import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";

import {AgGridAngular} from "ag-grid-angular";
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { MatDialog } from '@angular/material/dialog';
import { MATCH_STATUSES, SETTELMENT_STATUSES } from 'src/app/core/constantes/statuses';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public partners: any[] = [];
  public partnerId: number;
  public formGroup: UntypedFormGroup;
  public Providers: any[] = [];
  public MatchId: number;
  public activeMatch: any = {};
  public name: string = '';
  public rowData = [];
  public isEdit = false;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public columnDefs = [];
  public frameworkComponents = {
    checkBoxRenderer: CheckboxRendererComponent,
    buttonRenderer: ButtonRendererComponent,
    };

    settlementStatuses = SETTELMENT_STATUSES;

  public Statuses = MATCH_STATUSES;
  matchName: string;

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TeamId',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Sport.TeamName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TeamName',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.TeamId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TeamId',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeId',
        sortable: true,
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.Display',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Display',
        sortable: true,
        resizable: true,
        filter: 'agBooleanColumnFilter',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onchange: this.onUpdateCompetitor['bind'](this),
          onCellValueChanged: this.onUpdateCompetitor.bind(this)
        }
      },
      {
        headerName: 'Common.Delete',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        minWidth: 150,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onRemoveCompetitor['bind'](this),
          Icon:  'delete',
          bgColor: 'red',
          textColor: 'white'
        },
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
      },
    ];
  }

  ngOnInit() {
    this.MatchId = +this.activateRoute.snapshot.queryParams.MatchId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.getProviders();
    this.createForm();
    this.getPartners();
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

  getProviders() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.Providers = data.Objects;
        this.getMatch();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onPartnerChange(val) {
    this.partnerId = val;
    this.getMatch();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      MatchId: [null],
      SportName: [null],
      Number: [null],
      ExternalId: [null],
      StartTime: [null],
      AbsoluteLimit: [null, [Validators.required]],
      ResultInfo: [null],
      Type: [null],
      ProviderId: [null],
      LinkedMatches: [null],
      RegionName: [null],
      MaxWinPrematchSingle: [null, [Validators.required]],
      MaxWinPrematchMultiple: [null, [Validators.required]],
      MaxWinLiveSingle: [null, [Validators.required]],
      MaxWinLiveMultiple: [null, [Validators.required]],
      CompetitionName: [null],
      CompetitionId: [null, [Validators.required]],
      Delay: [null, [Validators.required]],
      Enabled: [false],
      BlockedByFeed: [false],
      CurrentPhaseId: [null],
      CurrentPhaseName: [null],
      currentPhase: [null],
      Status: [null],
      AutoSettlement: [null],
    });
  }

  updateProviders(val) {
    let sData = {
      MatchId: this.MatchId,
      ProviderId: val,
    };

    this.apiService.apiPost('matches/changeprovider', sData)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onResetMatch() {
    const sData = {
      MatchId: this.MatchId,
      ServiceType: this.activeMatch.Status,
      PartnerId: this.partnerId,
    };

    this.apiService.apiPost('matches/reset', sData)
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Match reset is successfully!", Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getMatch() {
    this.apiService.apiPost('matches/match', { MatchId: this.MatchId, PartnerId: this.partnerId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.activeMatch = data.ResponseObject;
          this.activeMatch.currentPhase = this.activeMatch.CurrentPhaseId + ' - ' + this.activeMatch.CurrentPhaseName;
          this.formGroup.patchValue(this.activeMatch);
          this.activeMatch.StatusName = this.Statuses?.find(p =>p.status == this.activeMatch?.Status).Name
          this.activeMatch.AutoSettlementName = this.settlementStatuses?.find(p =>p.Id == this.activeMatch?.AutoSettlement).Name || 'None'
          this.activeMatch.ProviderName = this.Providers?.find(p =>p.Id == this.activeMatch?.ProviderId).Name
          this.rowData = this.activeMatch.Competitors;
          this.matchName = this.rowData[0].TeamName + ' vs ' +this.rowData[1].TeamName
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    obj.PartnerId = this.partnerId;
    this.apiService.apiPost('matches/update', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.isEdit = false;
          this.getMatch();
          SnackBarHelper.show(this._snackBar, { Description: 'Success', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onUpdateCompetitor(params, val) {
    const form = {
      "MatchId": this.MatchId,
      "TeamId": params.TeamId,
      "Display": val,
    };
    this.apiService.apiPost('matches/updatecompetitor', form)
    .pipe(take(1))
    .subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  async onAddCompetitor() {
    const {AddCompetitor} = await import('./add-competitor/add-competitor.component');
    const dialogRef = this.dialog.open(AddCompetitor, {width:ModalSizes.SMALL, data: this.MatchId});
      dialogRef.afterClosed().pipe(take(1)).subscribe(() => {
        this.getMatch();
      })
  }

  async onRemoveCompetitor(params) {
    const {ConfirmComponent} = await import('../../../../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, {width:ModalSizes.SMALL});
      dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
        const form = {
          "MatchId": this.MatchId,
          "TeamId": params.data.TeamId,
        };
        this.apiService.apiPost('matches/removecompetitor', form)
        .pipe(take(1))
        .subscribe(data => {
          if (data.Code === 0) {
            SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });
            this.getMatch();
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });
      })
  }


  get errorControl() {
    return this.formGroup.controls;
  }

  localizeHeader(parameters: ICellRendererParams): string {
    let headerIdentifier = parameters.colDef.headerName;
    return this.translate.instant(headerIdentifier) || "";
  }

}
