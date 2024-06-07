import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { take } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-migrate-competition',
  templateUrl: './migrate-competition.component.html',
  styleUrls: ['./migrate-competition.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule
  ],
})
export class MigrateCompetitionComponent {

  sports: any[] = [];
  providers: any[] = [];
  competitionId: number;
  competition: any;
  agreement: boolean = false;
  isSendingReqest = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MigrateCompetitionComponent>,

    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
  ) {
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.isSendingReqest = true; 
    const requestBody = {
      FromCompetitionId: this.data.Id,
      ToCompetitionId: this.competition.Id,
    }

    this.apiService.apiPost('competitions/migrate', requestBody).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.dialogRef.close(data);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false;
    });
  }

  getCompetition() {
    const filter = {
      Id: +this.competitionId
    }
    this.apiService.apiPost('competitions/competition', filter)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.competition = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onKeyPress(event: KeyboardEvent) {
    const inputChar = event.key;
    const pattern = /[0-9]/;
    this.agreement = false;
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
