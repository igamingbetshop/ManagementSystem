import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { UnmappedTeamsGridComponent } from './girds/unmapped-teams-grid/unmapped-teams-grid.component';
import { MappedTeamsGridComponent } from './girds/mapped-teams-grid/mapped-teams-grid.component';

@Component({
  selector: 'app-map-teams',
  templateUrl: './map-teams.component.html',
  styleUrls: ['./map-teams.component.scss']
})
export class MapTeamsTabComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild(UnmappedTeamsGridComponent) unmappedTeamsGridComponent: UnmappedTeamsGridComponent;
  @ViewChild(MappedTeamsGridComponent) mappedTeamsGridComponent: MappedTeamsGridComponent;

  public isCanNotSelect = true;

  public providers: any[] = [];
  public sports: any[] = [];
  public sportId: number | null;


  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.gridStateName = 'map-teams-grid-state';
    this.getProviders();
    this.getSports();
  }

  getSports() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  getProviders() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.providers = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onSportChange(val) {
    this.sportId = val;
    this.go();
  }

  go() {
    this.unmappedTeamsGridComponent.gridApi.refreshServerSide({ purge: true });
    this.mappedTeamsGridComponent.gridApi.refreshServerSide({ purge: true });
    this.isCanNotSelect = true
  }

  mapCompetition() {
    let unknownRow = this.unmappedTeamsGridComponent.gridApi.getSelectedRows()[0];
    let knownRow = this.mappedTeamsGridComponent.gridApi.getSelectedRows()[0];

    let model = {
      ProviderId: unknownRow.ProviderId,
      ObjectId: knownRow.Id,
      ObjectTypeId: 4,
      ObjectExternalId: unknownRow.ExternalId
    };

    this.apiService.apiPost('common/map', model)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.go();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  handleValueEmitted(value: boolean) {
    this.isCanNotSelect = value;
  }


}
