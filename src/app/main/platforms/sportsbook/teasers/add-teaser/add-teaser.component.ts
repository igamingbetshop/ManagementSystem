import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";


import { SportsbookApiService } from "../../services/sportsbook-api.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import {
  FormArray, FormsModule,
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
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ACTIVITY_STATUSES, MATCH_STATUSES_OPTIONS } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-add-teaser',
  templateUrl: './add-teaser.component.html',
  styleUrls: ['./add-teaser.component.scss'],
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
export class AddTeaserComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public status = ACTIVITY_STATUSES;
  public maxPoints = [1, 2, 3, 4, 5, 6, 7, 8];
  public tieRules = [
    { Id: 1, Name: 'No Bet' },
    { Id: 2, Name: 'Wins' },
    { Id: 3, Name: 'Losses' },
    { Id: 4, Name: 'Demotes' },
  ];
  public matchStatus = MATCH_STATUSES_OPTIONS
  public partners = [];
  public selectedPoints = [];
  public action;
  public matchId = null;
  public matchStatusName = 'All';
  public pointCoefficientInputs;
  public propArray: FormArray;
  public teaser: any;

  constructor(
    public dialogRef: MatDialogRef<AddTeaserComponent>,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
  }

  ngOnInit(): void {
    this.action = this.data.action;
    this.teaser = this.data.data;
    if (this.teaser?.PointCoefficients.length === 0 && this.teaser?.MaxPoint !== null) {
      this.teaser.PointCoefficients = new Array(this.teaser.MaxPoint * 2).fill('undefined');
    }

    if (this.matchId === null) {
      this.matchStatusName = 'All'
    }
    if (this.action === 'Add') {
      this.selectedPoints = [];
    } else if (this.action === 'Edit') {
      if (this.data.data.PointCoefficients === null) {
        this.selectedPoints = [];
      } else {
        this.selectedPoints = this.data.data.PointCoefficients.map((item, i) => {
          return { Id: i, Value: item, Number: (i + 1) * 0.5 };
        });
      }
    }

    this.getPartners();
    this.formValues();
  }

  onMatchChange(val) {
    this.matchId = val;
    if (this.matchId === null) {
      this.matchStatusName = 'All'
    }
  }

  onMaxPointChange(value) {
    this.pointCoefficientInputs = value;
    this.selectedPoints = this.action === 'Add' ? [] : this.data.data.PointCoefficients.map((item, i) => {
      return { Id: i, Value: item, Number: (i + 1) * 0.5 };
    });

    const valueMultiple = value * 2;
    if (valueMultiple < this.selectedPoints.length) {
      this.selectedPoints.splice(valueMultiple, this.selectedPoints.length);
    } else {
      for (let i = this.selectedPoints.length; i < value * 2; i++) {
        this.selectedPoints.push({ Id: i + 1, Value: null, Number: (i + 1) * 0.5 })
      }
    }
  }

  formValues() {
    if (this.action === 'Add') {
      this.formGroup = this.fb.group({
        Name: [null, [Validators.required]],
        SelectionsCount: [null, [Validators.required]],
        MaxOpenSpots: [null, [Validators.required]],
        MaxPoint: [null, [Validators.required]],
        TieRule: [null, [Validators.required]],
        BaseCoefficient: [null, [Validators.required]],
        Status: [null, [Validators.required]],
        PartnerId: [null, [Validators.required]],
        MinCoefficient: [null],
        MaxCoefficient: [null],
        MatchStatus: [this.matchStatus[0].Id],
        DropHalfPoints: [false],
        Settings: [[]]
      });
    } else if (this.action === 'Edit') {
      this.formGroup = this.fb.group({
        Id: [this.teaser.Id],
        Name: [this.teaser.Name],
        SelectionsCount: [this.teaser.SelectionsCount],
        MaxOpenSpots: [this.teaser.MaxOpenSpots],
        MaxPoint: [this.teaser.MaxPoint],
        TieRule: [this.teaser.TieRule],
        BaseCoefficient: [this.teaser.BaseCoefficient],
        Status: [this.teaser.Status],
        PartnerId: [this.teaser.PartnerId],
        MinCoefficient: [this.teaser.MinCoefficient],
        MaxCoefficient: [this.teaser.MaxCoefficient],
        MatchStatus: [this.teaser.MatchStatus],
        Settings: [this.teaser.Settings],
        DropHalfPoints: [this.teaser.DropHalfPoints],
      });
    }

  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    obj.PointCoefficients = this.selectedPoints.map((item) => item.Value);
    this.dialogRef.close(obj);
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }
}
