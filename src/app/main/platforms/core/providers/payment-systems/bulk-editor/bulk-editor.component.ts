import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ModalSizes } from 'src/app/core/enums';
import { CoreApiService } from '../../../services/core-api.service';
import { ConfigService } from 'src/app/core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';


@Component({
  selector: 'bulk-editor',
  templateUrl: './bulk-editor.component.html',
  styleUrls: ['./bulk-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatSlideToggleModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
  ]
})
export class BulkEditorComponent {
  @Input() bulkMenuTrigger: any;
  @Input() Ids: any;
  @Input() method: string;
  @Input() controller: string;
  @Output() afterClosed: EventEmitter<void> = new EventEmitter<void>();

  value: false;
  constructor(
    private dialog: MatDialog,
    private configService: ConfigService,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,

  ) { }

  onCancelBtn() {
    this.bulkMenuTrigger.closeMenu();
  }

  async openConfirmDialog() {
    const { ConfirmComponent } = await import('../../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });

    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.onSubmit();
        // this.bulkMenuTrigger.closeMenu();
      }
    })
  }

  onSubmit() {
    const data = {
      Ids: [...this.Ids],
      IsActive: this.value || false
    }
    this.apiService.apiPost(this.configService.getApiUrl,data,
      true, this.controller, this.method).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Updated successfully', Type: "success" });
          this.bulkMenuTrigger.closeMenu();
          this.afterClosed.emit();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}
