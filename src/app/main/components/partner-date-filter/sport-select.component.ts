import { Component, EventEmitter, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonDataService } from 'src/app/core/services';
import { SportsbookApiService } from '../../platforms/sportsbook/services/sportsbook-api.service';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sport-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    TranslateModule
  ],
  template: `
      <div class="partner-dropdown">
      <mat-select (selectionChange)="sportChange($event.value)" placeholder="{{'Sport.SelectSport' | translate}}"
        panelClass="overlay-dropdown" disableOptionCentering>
        @for (sport of sports; track sport.Id) {
        <mat-option [value]="sport.Id">{{sport.Name}}</mat-option>
        }
      </mat-select>
    </div>
  `,
  styleUrls: ['./partner-date-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SportSelectComponent implements OnInit {

  sports: any[];
  @Output() toSportChange = new EventEmitter<any>();
  sportId: number | undefined;

  private apiService = inject(SportsbookApiService);
  private _snackBar = inject(MatSnackBar);

  ngOnInit(): void {
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

  sportChange(event: number) {
    this.sportId = event;
    this.toSportChange.emit(this.sportId);
  }

}