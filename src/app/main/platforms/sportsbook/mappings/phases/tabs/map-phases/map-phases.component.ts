import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';

import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { UnmapedPhasesComponent } from './components/unmaped-phases/unmaped-phases.component';
import { MappedPhasesComponent } from './components/mapped-phases/mapped-phases.component';

@Component({
  selector: 'app-map-phases',
  templateUrl: './map-phases.component.html',
  styleUrls: ['./map-phases.component.scss']
})
export class MapPhasesTabComponent implements OnInit {

  @ViewChild(UnmapedPhasesComponent) unmapedPhasesComponent: UnmapedPhasesComponent;
  @ViewChild(MappedPhasesComponent) mappedPhasesComponent: MappedPhasesComponent;

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

  go() {
    this.unmapedPhasesComponent.getRows();
    this.mappedPhasesComponent.getRows();
    this.isCanNotSelect = true
  }

  mapCompetition() {
    let unknownRow = this.unmapedPhasesComponent.gridApi.getSelectedRows()[0];
    let knownRow = this.mappedPhasesComponent.gridApi.getSelectedRows()[0];

    let model = {
      ProviderId: unknownRow.ProviderId,
      ObjectId: knownRow.Id,
      ObjectTypeId: 11,
      ObjectExternalId: unknownRow.ExternalId
    };
    this.apiService.apiPost('common/map', model)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Mapped', Type: "success" });
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
