import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {SportsbookApiService} from '../../../../services/sportsbook-api.service';
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {


  public formGroup: UntypedFormGroup;
  public categoryId: number;
  public category: any;
  public isEdit = false;
  public multipleBets = [
    {Id: null, Name: 'NONE'},
    {Id: true, Name: 'YES'},
    {Id: false, Name: 'NO'},
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService: SportsbookApiService,
    private activateRoute: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.categoryId = +this.activateRoute.snapshot.queryParams.categoryId;
    this.createForm();
    this.getPartner();
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onSportChange(val) {

  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [null],
      Name: [null, [Validators.required]],
      Color: [null, [Validators.required]],
      SportId: [null],
      AbsoluteLimit: [null, [Validators.required]],
      LiveDelay: [null, [Validators.required]],
      MaxWinPrematchSingle: [null, [Validators.required]],
      MaxWinPrematchMultiple: [null, [Validators.required]],
      MaxWinLiveSingle: [null, [Validators.required]],
      MaxWinLiveMultiple: [null, [Validators.required]],
      AllowMultipleBets: [null],
      IsDefault: [false],
    });
  }

  getPartner() {
    this.apiService.apiPost('competitions/categories', {"Id": this.categoryId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.category = data.ResponseObject[0];
          this.formGroup.patchValue(this.category);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();

    this.apiService.apiPost('competitions/updatecategory', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.isEdit = false;
          this.getPartner();
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

}
