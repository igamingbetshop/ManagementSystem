import { Component, HostListener, Injector, OnInit, signal, ViewChild } from '@angular/core';
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { debounceTime, take } from "rxjs/operators";
import { Subject } from "rxjs";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { DEVICE_TYPES } from "../../../../../../../core/constantes/types";
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';

@Component({
  selector: 'app-web-site-settings',
  templateUrl: './web-site-settings.component.html',
  styleUrls: ['./web-site-settings.component.scss']
})
export class WebSiteSettingsComponent extends BaseGridComponent implements OnInit {
  partnerId;
  partnerName;
  selectedMenu;
  selectedMenuItem;
  selectedSubMenuItem;
  model: string;
  modelChanged: Subject<string> = new Subject<string>();
  searchTitle = '';
  icon = signal('Icon');
  partnerEnvironments = [];
  selected = { Id: 3, Name: 'environmentId' };
  searchedResultTitle: string;
  showSearchedResult: boolean = false;
  deviceTypes = signal(DEVICE_TYPES);
  deviceType = this.deviceTypes()[0].Id;
  rowData = signal([]);
  webSiteMenusRowData = signal([]);
  subMenusRowData = signal([]);
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };
  changeMenuData: any;
  changeSubMenuData: any;

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        maxWidth: 60
      },
      {
        headerName: 'Clients.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
      },
      {
        headerName: 'Clients.StyleType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StyleType',
      },
    ];

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

  changeDeviceType(deviceType: number) {
    this.deviceType = deviceType;
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
          this.rowData.set(data.ResponseObject);
          if (!!this.rowData().length) {
            this.selectedMenu = data.ResponseObject[0];
            this.getWebsiteMenuItems(this.selectedMenu.Id);
          }
        }
      });
  }

  onRowClicked(event) {
    this.webSiteMenusRowData.set([]);
    this.subMenusRowData.set([]);
    this.selectedMenu = event.data;

    this.getWebsiteMenuItems(event.data.Id);
  }

  getWebsiteMenuItems(menuId: number, searchedMenuId = null) {
    this.apiService.apiPost(this.configService.getApiUrl, menuId, true,
      Controllers.CONTENT, Methods.GET_WEBSITE_MENU_ITEMS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          if (searchedMenuId === null) {
            this.webSiteMenusRowData.set(data.ResponseObject);
            this.selectedMenuItem = this.webSiteMenusRowData()[0];
            if (this.selectedMenuItem) {
              this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
            }
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
          this.subMenusRowData.set(data.ResponseObject);
          // this.selectedSubMenuItem = this.subMenusRowData[0];          
          if (this.selectedMenuItem.Title === 'FullRegister') {
            this.icon.set('Step');
          } else {
            this.icon.set('Icon');
          }
        }
      });
  }

  onSubmenuRowClicked(event) {
    this.selectedSubMenuItem = event.data
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
      if (result) {
        this.getWebsiteMenus();
      }
    });
  }

  async addEditMenuItem(action: string, obj) {
    obj.action = action;
    obj.MenuId = this.selectedMenu.Id;
    const { AddEditMenuItemComponent } = await import('./add-edit-menu-item/add-edit-menu-item.component');
    const dialogRef = this.dialog.open(AddEditMenuItemComponent, { width: ModalSizes.MEDIUM, data: obj });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        if (action === 'Edit') {
          this.changeMenuData = result;
          setTimeout(() => {
            this.changeMenuData = null;
          }, 1000);
        } else {
          this.getWebsiteMenuItems(this.selectedMenu.Id);
        }
        SnackBarHelper.show(this._snackBar, { Description: 'Success', Type: "success" });
      }

    });
  }

  async addEditSubMenuItem(action: string, data) {
    data.action = action;
    data.MenuItemId = this.selectedMenuItem.Id;
    data.menuId = this.selectedMenu.Id;
    const { AddEditSubMenuComponent } = await import('./add-edit-sub-menu/add-edit-sub-menu.component');
    const dialogRef = this.dialog.open(AddEditSubMenuComponent, { width: ModalSizes.MEDIUM, data: data });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        if (action === 'Edit') {
          this.changeSubMenuData = result;
          setTimeout(() => {
            this.changeSubMenuData = null;
          }, 1000);
        } else {
          this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
        }
        SnackBarHelper.show(this._snackBar, { Description: 'Success', Type: "success" });
      }
    });
  }

  onMenuClicked(event) {
    this.subMenusRowData.set([]);
    this.selectedMenuItem = event.data;
    this.getWebSiteSubMenuItems(event.data.Id);
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

  async addEditTranslation(event) {
    const item = event.data;

    item.PartnerId = this.partnerId;
    const { AddEditTranslationsComponent } = await import('./add-edit-translations/add-edit-translations.component');
    const dialogRef = this.dialog.open(AddEditTranslationsComponent, { width: ModalSizes.MEDIUM, data: item });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        SnackBarHelper.show(this._snackBar, { Description: "Updated", Type: "success" });

        // this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
      }
    });
  }

  async addEditConfig(event) {
    const item = event.data;
    const { ConfigPopupComponent } = await import('./config-popup/config-popup.component');
    const dialogRef = this.dialog.open(ConfigPopupComponent, { width: "1200px", height: "850px", data: item.Id });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        // this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
      }
    });
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

  onPurgeContentCache() {
    this.apiService.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.PARTNER, Methods.PURGE_CONTENT_CACHE).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  handleSubMenuItem(event) {
    if ((this.selectedMenu.Type == "Translations" && event.data.colId == 'Title')) {
      this.addEditTranslation(event);
    } else if (this.selectedMenu.Type == 'Config' && this.selectedMenuItem.Title == "CloudflareZoneId") {
      this.addEditConfig(event);
    } else {
      this.addEditSubMenuItem('Edit', event.data);
    }

  }

}
