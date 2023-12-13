import { Component, ViewChild } from '@angular/core';

import { take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MappedSportsGridComponent } from './grids/mapped-sports-grid/mapped-sports-grid.component';
import { UnmappedSportsGridComponent } from './grids/unmapped-sports-grid/unmapped-sports-grid.component';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

@Component({
  selector: 'app-map-sports',
  templateUrl: './map-sports.component.html',
  styleUrls: ['./map-sports.component.scss']
})
export class MapSportsComponent {

  @ViewChild(UnmappedSportsGridComponent) unmapedSportsGrid: UnmappedSportsGridComponent;
  @ViewChild(MappedSportsGridComponent) mappedSportsGrid: MappedSportsGridComponent;

  public isCanNotSelect = true;

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {}

  go() {
    this.unmapedSportsGrid.getRows();
    this.mappedSportsGrid.getRows();
    this.isCanNotSelect = true
  }

  mapCompetition() {

    let unknownRow = this.unmapedSportsGrid.gridApi.getSelectedRows()[0];
    let knownRow = this.mappedSportsGrid.gridApi.getSelectedRows()[0];

    let model = {
      ProviderId: unknownRow.ProviderId,
      ObjectId: knownRow.Id,
      ObjectTypeId: 1,
      ObjectExternalId: unknownRow.ExternalId
    };
    this.apiService.apiPost('common/map', model)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.go();
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  handleValueEmitted(value: boolean) {
    this.isCanNotSelect = value;
  }

}
