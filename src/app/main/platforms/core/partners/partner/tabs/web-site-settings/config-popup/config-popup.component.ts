import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { CoreApiService } from "../../../../../services/core-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonDataService, ConfigService } from "../../../../../../../../core/services";
import { Controllers, Methods, ModalSizes } from "../../../../../../../../core/enums";
import { take } from "rxjs/operators";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-config-popup',
  templateUrl: './config-popup.component.html',
  styleUrls: ['./config-popup.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class ConfigPopupComponent implements OnInit {
  public webFlows;
  public Id;
  public dataSource;
  displayedColumns: string[] = ['name', 'type', 'content', 'proxied', 'created_on', "delete"];

  constructor(public dialogRef: MatDialogRef<ConfigPopupComponent>,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data) {
  }

  ngOnInit(): void {
    this.Id = this.data;
    this.getConfig();
  }

  getConfig() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.Id, true, Controllers.PARTNER,
      Methods.GET_DNS_RECORDS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.dataSource = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  async onRowDelete(id, name) {
    const {ConfirmDialogComponent} = await import('../confirm-dialog/confirm-dialog.component');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: ModalSizes.SMALL,
      data: {
        rowId: this.Id,
        id: id,
        name: name
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.dataSource = this.dataSource.filter(elem => elem.id != id)
      }
    });
  }


  async onAddConfig() {
    const {AddConfigComponent} = await import('../add-config/add-config.component');
    const dialogRef = this.dialog.open(AddConfigComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        rowId: this.Id,
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.dataSource = [...this.dataSource, data]
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

}
