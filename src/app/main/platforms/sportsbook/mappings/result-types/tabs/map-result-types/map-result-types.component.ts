import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { UnmappedResultTypesGridComponent } from './grids/unmapped-result-types-grid/unmapped-result-types-grid.component';
import { MappedResultTypesGridComponent } from './grids/mapped-result-types-grid/mapped-result-types-grid.component';

@Component({
  selector: 'app-map-phases',
  templateUrl: './map-result-types.component.html',
  styleUrls: ['./map-result-types.component.scss']
})
export class MapResultTypesTabComponent implements OnInit {

  @ViewChild(UnmappedResultTypesGridComponent) unmappedResultTypesGridComponent: UnmappedResultTypesGridComponent;
  @ViewChild(MappedResultTypesGridComponent) mappedResultTypesGridComponent: MappedResultTypesGridComponent;

  public isCanNotSelect = true;

  public providers: any[] = [];
  public sports: any[] = [];
  public sportId: number = 1;

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
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
    this.unmappedResultTypesGridComponent.gridApi.refreshServerSide({ purge: true });
    this.mappedResultTypesGridComponent.gridApi.refreshServerSide({ purge: true });
    this.isCanNotSelect = true
  }

  mapCompetition() {
    let unknownRow = this.unmappedResultTypesGridComponent.gridApi.getSelectedRows()[0];
    let knownRow = this.mappedResultTypesGridComponent.gridApi.getSelectedRows()[0];

    let model = {
      ProviderId: unknownRow.ProviderId,
      ObjectId: knownRow.Id,
      ObjectTypeId: 21,
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
