import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import { ActivatedRoute } from '@angular/router';
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-market',
  templateUrl: './create-market.component.html',
  styleUrls: ['./create-market.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule
  ],

})
export class CreateMarketComponent implements OnInit {

  public marketTypes: any[] = [];
  public formGroup: UntypedFormGroup;
  public competitionId: number;
  public partnerId: number;
  public sportId: number;

  constructor(
    public dialogRef: MatDialogRef<CreateMarketComponent>,
    private fb:UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private apiService:SportsbookApiService,
    private activateRoute:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.competitionId = +this.activateRoute.snapshot.queryParams.competitionId;
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId ? +this.activateRoute.snapshot.queryParams.partnerId : null;
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.apiService.apiPost('markettypes',{
      "SportIds": {
          "ApiOperationTypeList": [{
              "IntValue": this.sportId,
              "OperationTypeId": 1
          }]
      }, "pageindex": 0, "pagesize": 500
    })
    .pipe(take(1))
    .subscribe(data => {
      if(data.Code === 0){
        this.marketTypes = data.ResponseObject.map(el => {
          return {Id: el.Id, Name: `${el.Name} - ${el.Id}`};
        });
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
    this.createForm();
  }

  public createForm(){
    this.formGroup = this.fb.group({
      MarketTypeId:[null, [Validators.required]],
      AbsoluteProfitRange1:[null, [Validators.required]],
      AbsoluteProfitRange2:[null, [Validators.required]],
      AbsoluteProfitRange3:[null, [Validators.required]],
      AbsoluteProfitLive:[null, [Validators.required]],
      RelativeLimitRange1:[null, [Validators.required]],
      RelativeLimitRange2:[null, [Validators.required]],
      RelativeLimitRange3:[null, [Validators.required]],
      RelativeLimitLive:[null, [Validators.required]],
      AllowMultipleBets:[false],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close()
  {
    this.dialogRef.close();
  }

  onSubmit()
  {
    if(this.formGroup.invalid){
      return;
    }
    const obj = this.formGroup.getRawValue();
    obj.PartnerId = this.partnerId ? this.partnerId : null;
    obj.CompetitionId = this.competitionId ? this.competitionId : null;
    this.apiService.apiPost('competitions/createmarkettypeprofit', obj).pipe(take(1)).subscribe(data => {
      if(data.Code === 0)
      {
        this.dialogRef.close(data.ResponseObject);
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}