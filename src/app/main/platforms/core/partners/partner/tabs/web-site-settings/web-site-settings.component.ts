import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Controllers, Methods, ModalSizes } from "../../../../../../../core/enums";
import { debounceTime, take } from "rxjs/operators";
import { Subject } from "rxjs";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-web-site-settings',
  templateUrl: './web-site-settings.component.html',
  styleUrls: ['./web-site-settings.component.scss']
})
export class WebSiteSettingsComponent implements OnInit {
  partnerId;
  partnerName;
  menus = [];
  websiteMenuItems = [];
  subMenuItems = [];
  selectedMenu;
  selectedMenuItem;
  selectedSubMenuItem;
  websiteMenuItem;
  websiteMenuItemName;
  websiteSubMenuItem;
  model: string;
  modelChanged: Subject<string> = new Subject<string>();
  searchTitle = '';
  icon = 'Icon';
  deviceType = 1
  partnerEnvironments = [];
  selected = { Id: 3, Name: 'environmentId' };
  searchedResultTitle: string;
  showSearchedResult: boolean = false;

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getWebsiteMenus();
    this.getPartnerEnvironments();
    this.modelChanged.pipe(debounceTime(300)).subscribe(() => {
      this.searchFindItemBySubTitle();
    })
  }

  @HostListener('click', ['$event.target'])
  onClick(targetElement: HTMLElement) {
    if (this.showSearchedResult) {
      if (!targetElement.classList.contains('search-result')) {
        this.showSearchedResult = false;
      }
    }
  }

  getPartnerEnvironments() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.PARTNER, Methods.GET_PARTNER_ENVIRONMENTS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.partnerEnvironments = data.ResponseObject;
        }
      });
  }

  changeDeviceType(number) {
    this.deviceType = number;
    this.getWebsiteMenus();
  }

  getWebsiteMenus() {
    const data = {
      PartnerId: +this.partnerId,
      DeviceType: this.deviceType,
    }
    this.apiService.apiPost(this.configService.getApiUrl, data, true,
      Controllers.CONTENT, Methods.GET_WEBSITE_MENU).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.menus = data.ResponseObject;
          if (!!this.menus.length) {
            this.selectedMenu = data.ResponseObject[0];
            this.getWebsiteMenuItems(this.selectedMenu.Id)
          } else {
            this.websiteMenuItems = [];
            this.subMenuItems = [];
          }
        }
      });
  }

  getWebsiteMenuItems(menuId: number, searchedMenuId = null) {
    this.apiService.apiPost(this.configService.getApiUrl, menuId, true,
      Controllers.CONTENT, Methods.GET_WEBSITE_MENU_ITEMS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          if (searchedMenuId === null) {
            this.websiteMenuItems = data.ResponseObject;
          } else {
            this.searchedResultTitle = data.ResponseObject.find(field => field.Id === searchedMenuId)?.Title;
          }
        }
      });
  }

  getWebSiteSubMenuItems(menuItemId) {
    this.apiService.apiPost(this.configService.getApiUrl, menuItemId, true,
      Controllers.CONTENT, Methods.GET_WEBSITE_SUB_MENU_ITEMS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.subMenuItems = data.ResponseObject;
          if (this.selectedMenuItem.Title === 'FullRegister') {
            this.icon = 'Step'
          } else {
            this.icon = 'Icon'
          }
        }
      });
  }

  changeSelectedItem(type, item) {
    switch (type) {
      case 0:
        this.selectedMenu = item;
        this.getWebsiteMenuItems(item.Id);
        this.websiteMenuItem = item.Id;
        this.websiteMenuItemName = item.Title;
        this.selectedMenuItem = {};
        this.selectedSubMenuItem = {};
        break;
      case 1:
        this.selectedMenuItem = item;
        this.selectedSubMenuItem = {};
        this.getWebSiteSubMenuItems(item.Id);
        this.websiteSubMenuItem = item.Id;
        this.websiteMenuItemName = item.Title;
        break;
      case 2:
        this.selectedSubMenuItem = item;
        break;
    }
  }

  async copyPartnerWebSiteSettings() {
    const { CopyWebsiteSettingsComponent } = await import('./copy-website-settings/copy-website-settings.component');
    const dialogRef = this.dialog.open(CopyWebsiteSettingsComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        diviceType: this.deviceType,
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getWebsiteMenus();
      }
    });
  }

  async addEditMenu(obj) {
    const { AddEditMenuComponent } = await import('./add-edit-menu/add-edit-menu.component');
    const dialogRef = this.dialog.open(AddEditMenuComponent, { width: ModalSizes.MEDIUM, data: obj });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      this.getWebsiteMenus();
    });
  }

  async addEditMenuItem(action: string, obj) {
    obj.action = action;
    obj.MenuId = this.selectedMenu.Id;
    const { AddEditMenuItemComponent } = await import('./add-edit-menu-item/add-edit-menu-item.component');
    const dialogRef = this.dialog.open(AddEditMenuItemComponent, { width: ModalSizes.MEDIUM, data: obj });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      this.getWebsiteMenuItems(this.selectedMenu.Id);
    });
  }

  async addEditSubMenuItem(action: string, data) {
    data.action = action;
    data.MenuItemId = this.selectedMenuItem.Id;
    data.menuId = this.selectedMenu.Id;
    const { AddEditSubMenuComponent } = await import('./add-edit-sub-menu/add-edit-sub-menu.component');
    const dialogRef = this.dialog.open(AddEditSubMenuComponent, { width: ModalSizes.MEDIUM, data: data });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
    });
  }

  deleteWebsiteMenuItem() {
    this.apiService.apiPost(this.configService.getApiUrl, this.selectedMenuItem.Id, true,
      Controllers.CONTENT, Methods.REMOVE_WEBSITE_MENU_ITEM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.getWebsiteMenuItems(this.selectedMenu.Id)
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  deleteWebsiteSubMenuItem() {
    this.apiService.apiPost(this.configService.getApiUrl, this.selectedSubMenuItem.Id, true,
      Controllers.CONTENT, Methods.REMOVE_WEBSITE_SUB_MENU_ITEM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.getWebSiteSubMenuItems(this.selectedMenuItem.Id)
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  async addEditTranslation(item, event) {
    item.PartnerId = this.partnerId;
    event.stopPropagation();
    if (this.selectedMenu.Type == 'Translations') {
      const { AddEditTranslationsComponent } = await import('./add-edit-translations/add-edit-translations.component');
      const dialogRef = this.dialog.open(AddEditTranslationsComponent, { width: ModalSizes.MEDIUM, data: item });
      dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
        if (data) {
          this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
        }
      });
    }
    if (this.selectedMenu.Type == 'Config' && this.websiteMenuItemName == "CloudflareZoneId") {

      const { ConfigPopupComponent } = await import('./config-popup/config-popup.component');
      const dialogRef = this.dialog.open(ConfigPopupComponent, { width: "1200px", height: "850px", data: item.Id });
      dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
        if (data) {
          // this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
        }
      });
    }
  }

  searchFindItemBySubTitle() {
    this.apiService.apiPost(this.configService.getApiUrl, {
      Title: this.searchTitle.trim(),
      Id: this.selectedMenu.Id
    }, true,
      Controllers.CONTENT, Methods.FIND_SUB_MENU_ITEM_BY_TITLE).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.showSearchedResult = true;
          if (data.ResponseObject == null) {
            this.searchedResultTitle = "Not found";
          } else {
            this.getWebsiteMenuItems(this.selectedMenu.Id, data.ResponseObject.MenuItemId);
          }
        }
      });
  }

  searchItemBySubTitle(event) {
    this.modelChanged.next(event)
  }

  uploadConfig() {
    this.apiService.apiPost(this.configService.getApiUrl, {
      EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
    }, true,
      Controllers.CONTENT, Methods.UPLOAD_CONFIG).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  uploadMenus() {
    this.apiService.apiPost(this.configService.getApiUrl, {
      EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
    }, true,
      Controllers.CONTENT, Methods.UPLOAD_MENUS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  uploadStyles() {
    this.apiService.apiPost(this.configService.getApiUrl, {
      EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
    }, true,
      Controllers.CONTENT, Methods.UPLOAD_STYLES).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  uploadTranslations() {
    this.apiService.apiPost(this.configService.getApiUrl, {
      EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
    }, true,
      Controllers.CONTENT, Methods.UPLOAD_TRANSLATIONS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  uploadPromotions() {
    this.apiService.apiPost(this.configService.getApiUrl, {
      EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
    }, true,
      Controllers.CONTENT, Methods.UPLOAD_PROMOTIONS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  uploadNews() {
    this.apiService.apiPost(this.configService.getApiUrl, {
      EnvironmentTypeId: this.selected.Id, PartnerId: +this.partnerId
    }, true,
      Controllers.CONTENT, Methods.UPLOAD_NEWS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  PurgeContentCache() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.PARTNER, Methods.PURGE_CONTENT_CACHE).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }
}
