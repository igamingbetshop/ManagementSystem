import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { UntypedFormBuilder, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

import { take } from "rxjs/operators";
import { MatIconModule } from "@angular/material/icon";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslateModule } from "@ngx-translate/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";


import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSelectModule } from '@angular/material/select';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

import { SportsbookApiService } from '../../../../services/sportsbook-api.service';

@Component({
  standalone: true,
  selector: 'app-ucalculated-bets-note',
  templateUrl: './ucalculated-bets.component.html',
  styleUrls: ['./ucalculated-bets.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    FlexLayoutModule,
    TranslateModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule
  ],
})
export class UcalculatedBetsComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public finishedMatches: {[key: string]: any}[];

  constructor(
    public dialogRef: MatDialogRef<UcalculatedBetsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {[key: string]: any}[],
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    ) {
  }

  ngOnInit(): void {
    this.finishedMatches = this.data;
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }

    // this.apiService.apiPost(`report/${this.path}`,
    //   {
    //     BetIds: [this.betId],
    //     TypeId: obj.Kind,
    //     Comment: obj.Comment
    //   })
    //   .pipe(take(1))
    //   .subscribe(res => {
    //     if (res.Code === 0) {
    //       this.dialogRef.close(obj);
    //     } else {
    //       SnackBarHelper.show(this._snackBar, { Description: obj.Description, Type: "error" });
    //     }
    //   })
  }

}
