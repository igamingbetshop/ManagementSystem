import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { MappedRegionsGridComponent } from './grids/mapped-region-grid/mapped-regions-grid.component';
import { UnmappedRegionsGridComponent } from './grids/unmapped-region-grid/unmapped-regions-grid.component';

@Component({
  selector: 'app-map-regions',
  templateUrl: './map-regions.component.html',
  styleUrls: ['./map-regions.component.scss']
})
export class MapRegionsTabComponent implements OnInit {

  @ViewChild(UnmappedRegionsGridComponent) unmapedRegionsGrid: UnmappedRegionsGridComponent;
  @ViewChild(MappedRegionsGridComponent) mappedRegionsGrid: MappedRegionsGridComponent;


  public isCanNotSelect = true;

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
    ;
  }

  ngOnInit() {
  }

  go() {
    this.unmapedRegionsGrid.getRows();
    this.mappedRegionsGrid.getRows();
    this.isCanNotSelect = true
  }

  mapCompetition() {
    let unknownRow = this.unmapedRegionsGrid.gridApi.getSelectedRows()[0];
    let knownRow = this.mappedRegionsGrid.gridApi.getSelectedRows()[0];


    let model = {
      ProviderId: unknownRow.ProviderId,
      ObjectId: knownRow.Id,
      ObjectTypeId: 2,
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
