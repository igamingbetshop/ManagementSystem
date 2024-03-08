import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { take } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ModalSizes } from 'src/app/core/enums';
import { ConfigService } from 'src/app/core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { CoreApiService } from '../../services/core-api.service';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'products-bulk-editor',
  templateUrl: './products-bulk-editor.component.html',
  styleUrls: ['./products-bulk-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    FormsModule,
    MatSlideToggleModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class ProductsBulkEditorComponent {
  @Input() bulkMenuTrigger: any;
  @Input() Ids: any;
  @Input() method: string;
  @Input() controller: string;
  @Input() countries: any;
  @Input() productStates: any;
  @Output() afterClosed: EventEmitter<void> = new EventEmitter<void>();
  formGroup: UntypedFormGroup;
  SelectedIds: any;
  constructor(
    private dialog: MatDialog,
    private configService: ConfigService,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
  ) {
    this.formGroup = this.fb.group({
      Ids: [null],
      Countries: this.fb.group({
        Type: [null],
        Ids: [null],
      }),
      State: [null, [Validators.required]],
    });
  }

  onCancelBtn() {
    this.bulkMenuTrigger.closeMenu();
  }

  async openConfirmDialog() {
    const { ConfirmComponent } = await import('../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });

    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.onSubmit();
      }
    })
  }

  onSubmit() {
    let data = this.formGroup.getRawValue();
    data.Ids = this.Ids;
    this.apiService.apiPost(this.configService.getApiUrl, data,
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
