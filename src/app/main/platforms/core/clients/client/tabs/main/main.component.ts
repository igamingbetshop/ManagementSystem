import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";

import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { DateAdapter } from "@angular/material/core";
import { AgGridAngular } from "ag-grid-angular";

import { CommonDataService, ConfigService } from "../../../../../../../core/services";
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { Client } from "../../../../../../../core/interfaces";
import { ServerCommonModel } from "../../../../../../../core/models/server-common-model";
import { CoreApiService } from '../../../../services/core-api.service';
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { OpenerComponent } from "../../../../../../components/grid-common/opener/opener.component";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'client-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  clientId: number;
  client: Client;
  formGroup: UntypedFormGroup;
  countries: ServerCommonModel[] = [];
  allCountries;
  underMonitoringTypes = [];
  allCities: ServerCommonModel[] = [];
  cities: ServerCommonModel[] = [];
  clientStates: ServerCommonModel[] = [];
  clientCategories: ServerCommonModel[] = [];
  jobAreas: ServerCommonModel[] = [];
  isSaveActive: boolean;
  rowData = [];
  columnDefs = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  isEdit = false;
  referralTypes = [];
  countryId;
  districtes;
  districtId;
  districtName = '';
  displayedColumns: string[] = ['select', 'id', 'balance', 'currency', 'type', 'status'];
  dataSource ;;
  selection = new SelectionModel<any>(true, []);


  constructor(
    private apiService: CoreApiService,
    private fb: UntypedFormBuilder,
    private activateRoute: ActivatedRoute,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public configService: ConfigService,
    protected injector: Injector,
    public dialog: MatDialog,
    public dateAdapter: DateAdapter<Date>) {
    super(injector);
    this.dateAdapter.setLocale('en-GB');
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Common.ChangeDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChangeDate',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ChangeDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.CreatedBy',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusPrize',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.FirstName !== null || params.data.LastName !== null) {
            a.innerHTML = params.data.FirstName + ' ' + params.data.LastName;
          }
          return a;
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          data.path = this.router.url.split('?')[0] + '/' + params.data.Id;
          return data;
        },
        sortable: false
      }
    ];
  }

  ngOnInit() {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.clientStates = this.activateRoute.snapshot.data.clientStates;
    this.clientCategories = this.activateRoute.snapshot.data.clientCategories;
    this.getReferralTypesEnum();
    this.getUnderMonitoringTypes();
    this.createForm();
    this.getJobAreas();
    this.getObjectHistory();
    this.getClient();
  }

  getClient() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_BY_ID).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode == 0) {
          this.client = data.ResponseObject.Client;
          if (this.client.BirthDate === "0001-01-01T00:00:00") {
            DateTimeHelper.startDate();
            const fromDate = DateTimeHelper.getFromDate();
            fromDate.setFullYear(fromDate.getFullYear() - 21);
            this.client.BirthDate = fromDate ;
          }
          this.client.PartnerName = (this.commonDataService?.partners as Array<any>).find(p => p.Id === this.client.PartnerId).Name;
          this.client.LanguageName = (this.commonDataService?.languages as Array<any>).find(l => l.Id === this.client.LanguageId).Name;
          this.client.GenderName = (this.commonDataService?.genders as Array<any>).find(g => g.Id === this.client.Gender)?.Name;
          this.client.CategoryName = (this.clientCategories as Array<any>).find(l => l.Id === this.client.CategoryId).Name;
          this.client.StateName = this.clientStates?.find(field => field.Id === this.client.State)?.Name;
          if (!!this.client.UnderMonitoringTypes) {
            this.client.UnderMonitoringTypesNames = '';
            this.client.UnderMonitoringTypes.forEach(element => {
              this.client.UnderMonitoringTypesNames += this.underMonitoringTypes.find((category) => category.Id === element)?.Name + " ";
            }
            );
          }
          this.formGroup.patchValue(this.client)
          this.countryId = data.ResponseObject.Client.CountryId;
          this.districtId = data.ResponseObject.Client.DistrictId;
          this.client.ReferralType = (this.referralTypes as Array<any>).find(type => type.Id === this.client.ReferralType)?.Name;
          this.formGroup.valueChanges.subscribe(data => {
            this.isSaveActive = true
          })

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }

        this.getCountry();
        if (this.districtId) {
          this.getDistrict(this.countryId, true);
        } else {
          this.getCity(this.countryId);
          this.getDistrict(this.countryId, false);
        }
      })
  }

  getUnderMonitoringTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_UNDER_MONITORING_TYPES_ENUM).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.underMonitoringTypes = data.ResponseObject;
        }
      });
  }

  private createForm() {
    this.formGroup = this.fb.group({
      Id: [null],
      Address: [null],
      BuildingNumber: [null],
      PartnerName: [null],
      UserName: [null],
      FirstName: [null],
      LastName: [null],
      Email: [null],
      LanguageId: [null],
      LanguageName: [null],
      // PromoCode: [null],
      CountryId: [null],
      DistrictId: [null],
      CityId: [null],
      City: [null],
      DocumentNumber: [null],
      DocumentType: [null],
      ClientStateName: [null],
      State: [null],
      Info: [null],
      AffiliatePlatformId: [null],
      AffiliateId: [null],
      BetShopId: [null],
      JobAreaName: [null],
      JobArea: [null],
      CitizenshipName: [null],
      Citizenship: [null],
      UserId: [null],
      Comment: [null],
      Apartment: [null],
      MobileNumber: [null],
      PhoneNumber: [null],
      SecondName: [null],
      SecondSurname: [null],
      GenderName: [null],
      Gender: [null],
      CurrencyId: [null],
      DocumentIssuedBy: [null],
      BirthDate: [null],
      CreationTime: [null],
      CategoryId: [null],
      CategoryName: [null],
      NickName: [null],
      CallToPhone: [null],
      IsMobileNumberVerified: [null],
      SendMail: [null],
      IsEmailVerified: [null],
      SendSms: [null],
      IsDocumentVerified: [null],
      ZipCode: [null],
      SendPromotions: [null],
      USSDPin: [null],
      ReferralType: [null],
      LastDepositDate: [null],
      Age: [null],
      RefId: [null],
      CharacterName: [null],
      CharacterId: [null],
      CharacterLevel: [null],
    });
  }

  public onSubmit() {
    const client = this.formGroup.getRawValue();
    if (typeof client.BirthDate === 'object') {
      const tomeZone = -1 * client.BirthDate.getTimezoneOffset() / 60;
      client.BirthDate = new Date(client.BirthDate.setHours(client.BirthDate.getHours() + tomeZone));
    }

    this.apiService.apiPost(this.configService.getApiUrl, client, true,
      Controllers.CLIENT, Methods.CHANGE_CLIENT_DETAILS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          setTimeout(() => {
            this.getClient();
            this.isEdit = false;
          }, 1000)
          SnackBarHelper.show(this._snackBar, { Description: 'The client has been updated successfully', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
    this.getObjectHistory()
  }

  public cancel() {
    this.isEdit = false;
    this.getClient();
  }

  getCountry() {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 5 }, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.countries = data.ResponseObject;
          this.client.CountryName = (this.countries as Array<any>).find(el => el.Id === this.client?.CountryId)?.Name;
          this.client.CitizenshipName = (this.countries as Array<any>).find(el => el.Id === this.client?.Citizenship)?.Name;
        }
      });
  }

  getDistrict(countryId, canGetCity = false) {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 2, ParentId: countryId }, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.districtes = data.ResponseObject;
          this.districtes.unshift({
            Id: 0, Name: "Select One",
            NickName: '',
            Info: undefined,
            ParentId: 0
          })
          this.districtName = (this.districtes as Array<any>).find(el => el.Id === this.client.DistrictId)?.Name;

          if (canGetCity) {
            this.getCity(this.districtId)
          }
        }
      });
  }

  getCity(countryId) {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 3, ParentId: countryId }, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.cities = data.ResponseObject;
          this.cities.unshift({
            Id: 0, Name: "Select One",
            NickName: '',
            Info: undefined,
            ParentId: 0
          })

          this.client.CityName = (this.cities as Array<any>).find(el => el.Id === this.client.CityId)?.Name;
        }
      });
  }

  public onCountryChange(event) {
    this.getDistrict(event.value);
    this.getCity(event.value);
    // this.cities = this.allCities.filter(c => c.ParentId === event.value);
    this.formGroup.get('CountryId').setValue(event.value);
  }

  public onCityChange(event) {
    if (event.value == 0) {
      this.formGroup.get('CityId').setValue(null)
    } else {

      this.formGroup.get('CityId').setValue(event.value);
    }
  }

  public onDistrictChange(event) {

    if (event.value == 0) {
      this.formGroup.get('DistrictId').setValue(null);
      this.getCity(this.formGroup.value.CountryId)

    } else {
      this.formGroup.get('DistrictId').setValue(event.value);
      this.getCity(event.value);
    }

  }

  private getJobAreas() {
    this.apiService.apiPost(this.configService.getApiUrl,
      null, true, Controllers.CONTENT, Methods.GET_JOB_AREA).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.jobAreas = data.ResponseObject;
        }
      });
  }

  getObjectHistory() {
    this.apiService.apiPost(this.configService.getApiUrl, { ObjectId: this.clientId, ObjectTypeId: 2 }, true,
      Controllers.REPORT, Methods.GET_OBJECT_CHANGE_HISTORY).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        }
      });
  }

  getReferralTypesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_REFERRAL_TYPE_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.referralTypes = data.ResponseObject;
        }
      });
  }

  async changePassword() {
    const { ChangePasswordComponent } = await import('./change-password/change-password.component');
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: ModalSizes.MEDIUM,
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    });
  }

  async sendMailToPlayer() {
    const { SendMailToPlayerComponent } = await import('./send-mail-to-player/send-mail-to-player.component');
    const dialogRef = this.dialog.open(SendMailToPlayerComponent, {
      width: ModalSizes.MEDIUM,
      data: { method: "SEND_EMAIL_TO_CLIENT" }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    });
  }

  onResetClientPinCode() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.clientId, true,
      Controllers.CLIENT, Methods.RESET_CLIENT_PIN_CODE).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.client.PinCode = data.ResponseObject;
          SnackBarHelper.show(this._snackBar, { Description: 'The pin code has been reset successfully', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });

  }

  onRowClick(event: any, account: any) {
    this.selection.toggle(account);
  }
}
