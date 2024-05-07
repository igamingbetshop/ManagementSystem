import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { take } from 'rxjs';
import {AuthService, ConfigService} from "src/app/core/services";
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { Client } from 'src/app/core/interfaces';
import { ServerCommonModel } from 'src/app/core/models/server-common-model';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss']
})
export class ViewImageComponent implements OnInit {
  @Input() id: number;
  @ViewChild('imageArea') imageArea: ElementRef;
  @ViewChild('image') image: ElementRef;
  public client: Client;
  public clientId: number | string;

  public value;
  public imgValue;
  public isZoomIn = false;
  public cities;
  public districtes
  public countryId;
  public districtId;
  public allCities: ServerCommonModel[] = [];
  public cityId: string | number;
  public districtName = '';
  public cityName = '';
  public zoomNumber = 1;
  public countries: ServerCommonModel[] = [];

  public fileUrl: SafeResourceUrl;
  public isImage: boolean;

  constructor(
    private apiService: CoreApiService,
    public dialogRef: MatDialogRef<ViewImageComponent>,
    private configService: ConfigService,
    private sanitizer: DomSanitizer,
    private authService:AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { value: any, clientId: number | string },
    private _el: ElementRef) {
  }

  ngOnInit(): void {
    this.value = this.data.value;
    this.clientId = this.data.clientId;
    this.imgValue = this.configService.defaultOptions.WebApiUrl;
    const url = `${this.imgValue}/Statement/${this.value}/?token=${this.authService.token}`;
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.isImage = (/\.(gif|jpe?g|png|webp|bmp)$/i).test(this.value);
    this.getClient();
  }

  getClient() {
    this.apiService.apiPost(this.configService.getApiUrl, this.clientId, true,
      Controllers.CLIENT, Methods.GET_CLIENT_BY_ID).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.client = data.ResponseObject.Client;
          this.cityId = data.ResponseObject.Client.CityId;
          this.countryId = data.ResponseObject.Client.CountryId;
          this.districtId = data.ResponseObject.Client.DistrictId;
          this.getCountry();
          if (this.districtId) {
            this.getDistrict(this.countryId)
          } else {
            this.getCity(this.countryId)
          }
        }
      });
  }

  getCountry() {
    this.apiService.apiPost(this.configService.getApiUrl, {TypeId: 5}, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.countries = data.ResponseObject;
        this.client.CountryName = (this.countries as Array<any>).find(el => el.Id === this.client?.CountryId)?.Name;
      }
    });
  }

  getDistrict(countryId) {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 2, ParentId: countryId }, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.districtes = data.ResponseObject;
          this.districtName = (this.districtes as Array<any>).find(el => el.Id === this.client.DistrictId)?.Name;
          this.getCity(this.districtId)
        }
      });
  }

  getCity(countryId) {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 3, ParentId: countryId }, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.cities = data.ResponseObject;
          this.cityName = (this.cities as Array<any>).find(el => el.Id === this.client.CityId)?.Name;
        }
      });
  }

  increaseZoomNumber() {
    this.zoomNumber += 2;
    this.image.nativeElement.style.transform = 'translate(0%,0%) scale(' + this.zoomNumber + ')';
  }

  decreaseZoomNumber() {
    this.zoomNumber -= 2;
    this.image.nativeElement.style.transform = 'translate(0%,0%) scale(' + this.zoomNumber + ')';
  }

  moveImage(event: any) {
    if (this.zoomNumber === 1) {
      return;
    }

    let differenceX = event.clientX - this.imageArea.nativeElement.offsetLeft;
    let differenceY = event.clientY - this.imageArea.nativeElement.offsetTop;

    let mWidth = this.imageArea.nativeElement.offsetWidth / 2;
    let mHeight = this.imageArea.nativeElement.offsetHeight / 2;
    let percent = this.zoomNumber === 5 ? 200 : 100;

    let isPositionX = differenceX < mWidth ? '+' : '-';
    let isPositionY = differenceY < mHeight ? '+' : '-';
    let coordinateX = differenceX < mWidth ? ((mWidth - differenceX) * percent / mWidth) : ((differenceX - mWidth) * percent / mWidth);
    let coordinateY = differenceY < mHeight ? ((mHeight - differenceY) * percent / mHeight) : ((differenceY - mHeight) * percent / mHeight);

    this.image.nativeElement.style.transform = 'translate(' + isPositionX + coordinateX + '%,' + isPositionY + coordinateY + '%) scale(' + this.zoomNumber + ')';
  }

}
