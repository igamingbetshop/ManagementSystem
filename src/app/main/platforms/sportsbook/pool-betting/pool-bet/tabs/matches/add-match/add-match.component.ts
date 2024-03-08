import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatInputModule} from "@angular/material/input";

import {TranslateModule} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatButtonModule} from "@angular/material/button";

import {MatIconModule} from "@angular/material/icon";
import {PoolBettingApiService} from "../../../../../services/pool-betting-api.service";
import {PBControllers, PBMethods} from "../../../../../../../../core/enums";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-round',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule
  ]
})
export class AddMatchComponent implements OnInit {
  public roundId: number;
  public formGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddMatchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: PoolBettingApiService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.roundId = this.data.roundId;
    this.formValues();
  }

  formValues() {
    this.formGroup = this.fb.group({
      RoundId: [this.roundId, [Validators.required]],
      MatchId: [null, [Validators.required]],
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    const requestData = this.formGroup.getRawValue();
    this.apiService.apiPost(PBControllers.ROUND, PBMethods.ADD_MATCH_TO_ROUND, requestData).pipe(take(1)).subscribe(data => {
      if (data.Code === 0) {
        this.dialogRef.close(data);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

}
