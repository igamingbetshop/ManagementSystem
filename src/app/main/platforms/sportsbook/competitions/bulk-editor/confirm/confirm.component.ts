import {CommonModule} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SportsbookApiService} from "../../../services/sportsbook-api.service";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-add-edit-translation',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    MatDialogModule
  ]
})
export class ConfirmComponent implements OnInit{

  private bulkUpdateRequest: BulkUpdateRequest;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BulkUpdateRequest,
    public dialogRef: MatDialogRef<ConfirmComponent>,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
  ) {}

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.bulkUpdateRequest = this.data;
  }

  onSubmit() {
    const request = this.bulkUpdateRequest;
    this.apiService.apiPost('competitions/bulkupdate', request).subscribe(data => {
      if (data.Code === 0) {
        this.dialogRef.close('success');
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }
}

export interface BulkUpdateRequest {
  StateSpecified: boolean;
  State: boolean;
  CategorySpecified: boolean;
  CategoryId: number;
}
