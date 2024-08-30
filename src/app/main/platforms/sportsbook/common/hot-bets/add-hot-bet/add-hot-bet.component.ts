import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";


import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import {
  FormArray, FormControl, FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';

@Component({
  selector: 'app-add-hot-bet',
  templateUrl: './add-hot-bet.component.html',
  styleUrls: ['./add-hot-bet.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    TranslateModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule
  ]
})

export class AddHotBetComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public status = ACTIVITY_STATUSES;
  public types = [
    { Id: 1, Name: 'Single' },
    { Id: 2, Name: 'Multiple' },
  ];
  public partners = [];
  public action;
  public hotbet: any;
  newSelectionControl: FormControl;
  
  constructor(
    public dialogRef: MatDialogRef<AddHotBetComponent>,
    private apiService: SportsbookApiService, 
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.newSelectionControl = new FormControl(null);
  }

  ngOnInit(): void {
    this.action = this.data.action;    
    this.hotbet = this.data._data;
    this.formValues();
    this.getPartners();
  }

  formValues() {
    this.formGroup = this.fb.group({
      Id: [this.hotbet?.Id || null],
      PartnerId: [{ value: this.hotbet?.PartnerId || null, disabled: this.action === 'Edit' }],
      Type: [this.hotbet?.Type || null, [Validators.required]],
      Status: [this.hotbet?.Status || null, [Validators.required]],
      BoostPercent: [this.hotbet?.BoostPercent || null, [Validators.required]],
      Selections: this.fb.array([]) 
    });

    if (this.action === 'Edit' && this.hotbet.Selections && this.hotbet.Selections.length > 0) {
      this.hotbet.Selections.forEach(selection => {
        this.apiHotBetSelection.push(this.fb.group({
          SelectionId: [selection.SelectionId]
        }));
      });
    }
  }

  get apiHotBetSelection() {
    return this.formGroup.get('Selections') as FormArray;
  }

  addSelection() {
    if (this.newSelectionControl.valid) {
      this.apiHotBetSelection.push(this.fb.group({
        SelectionId: [this.newSelectionControl.value]
      }));
      this.newSelectionControl.reset();
    } else {
      this.newSelectionControl.markAsTouched();
    }
  }

  removeSelection(index: number) {
    this.apiHotBetSelection.removeAt(index);
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
      }
    });
  }

  submit() {
    const method =  this.action === 'Edit' ? 'bets/updatehotbet' : 'bets/addhotbet';
    const formData = this.formGroup.getRawValue();
    formData.Selections.forEach(element => {
      (element.SelectionId = String(element.SelectionId));
      
    });
    this.apiService.apiPost(method, formData).subscribe(data => {
      if (data.Code === 0) {
        SnackBarHelper.show(this._snackBar, { Description: "Done", Type: 'success' });
        this.dialogRef.close(true);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }
}