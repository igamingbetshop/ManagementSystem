import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { CommonDataService } from 'src/app/core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { VirtualGamesApiService } from '../../services/virtual-games-api.service';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
})
export class CreateTableComponent implements OnInit {
  public formGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { gameId: string | number,},
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: VirtualGamesApiService,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  public createForm() {
    this.formGroup = this.fb.group({
      gameId: [this.data.gameId],
      tableName: [null, [Validators.required]],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    const obj = this.formGroup.getRawValue();
    this.apiService.apiPost('createtable', obj).pipe(take(1)).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        this.dialogRef.close(data.ResponseObject);
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });

  }

}