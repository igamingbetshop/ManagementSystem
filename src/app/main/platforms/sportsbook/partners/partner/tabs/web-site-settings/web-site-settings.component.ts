import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SportsbookApiService } from "../../../../services/sportsbook-api.service";
import { debounceTime, take } from "rxjs/operators";
import { Controllers, Methods, ModalSizes } from "../../../../../../../core/enums";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { CoreApiService } from "../../../../../core/services/core-api.service";

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
  websiteSubMenuItem;
  model: string;
  modelChanged: Subject<string> = new Subject<string>();
  searchTitle = '';
  searchedResultTitle: string;
  showSearchedResult: boolean = false;
  deviceType = 1


  constructor(private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    private apiService: SportsbookApiService,
    public dialog: MatDialog,
    private apiServiceCore: CoreApiService,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getWebsiteMenus();
    this.modelChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.searchFindWebSiteMenuItemBySubMenuTitle()
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

  changeDeviceType(number) {
    this.deviceType = number;
    this.getWebsiteMenus();
  }

  getWebsiteMenus() {
    this.apiService.apiPost('cms/getwebsitemenus', { PartnerId: +this.partnerId, DeviceType: this.deviceType, })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.menus = data.ResponseObject;
          if (!!this.menus.length) {
            this.selectedMenu = data.ResponseObject[0];
            this.getWebsiteMenuItems(this.selectedMenu.Id)
          } else {
            this.websiteMenuItems = [];
            this.subMenuItems = [];
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getWebsiteMenuItems(menuId, searchedMenuId = null) {
    this.apiService.apiPost('cms/getwebsitemenuItems', { MenuId: menuId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          if (searchedMenuId === null) {
            this.websiteMenuItems = data.ResponseObject;
          } else {
            this.searchedResultTitle = data.ResponseObject.find(field => field.Id === searchedMenuId)?.Title;
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getWebSiteSubMenuItems(menuItemId) {
    this.apiService.apiPost('cms/getwebsitesubmenuitems', { MenuItemId: menuItemId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {

          this.subMenuItems = data.ResponseObject;
        } else { }
      });
  }

  changeSelectedItem(type, item) {
    switch (type) {
      case 0:
        this.selectedMenu = item;
        this.getWebsiteMenuItems(item.Id);
        this.websiteMenuItem = item.Id;
        this.selectedMenuItem = {};
        this.selectedSubMenuItem = {};
        break;
      case 1:
        this.selectedMenuItem = item;
        this.selectedSubMenuItem = {};
        this.getWebSiteSubMenuItems(item.Id);
        this.websiteSubMenuItem = item.Id;
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
      data: {deviceType: this.deviceType,}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getWebsiteMenus();
      }
    });
  }

  addWebsiteMenuItem(row_obj) {
    console.log(row_obj);
  }

  addWebsiteSubMenuItem(row_obj) {
    console.log(row_obj);
  }

  editWebsiteSubMenuItem(row_obj) {
    this.selectedMenuItem = row_obj;
  }

  editWebsiteMenuItem(row_obj) {
    this.selectedMenu = row_obj;
  }

  async openDialog(action, obj) {
    obj.action = action;
    obj.MenuId = this.selectedMenu.Id;
    const { AddEditMenuComponent } = await import('./add-edit-menu/add-edit-menu.component');
    const dialogRef = this.dialog.open(AddEditMenuComponent, { width: ModalSizes.MEDIUM, data: obj });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result.event == 'Add') {
        this.addWebsiteMenuItem(result.data);
      } else if (result.event == 'Edit') {
        this.editWebsiteMenuItem(result.data);
      }
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
    this.apiService.apiPost('cms/removewebsitemenuitem', { Id: this.selectedMenuItem.Id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getWebsiteMenuItems(this.selectedMenu.Id);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  deleteWebsiteSubMenuItem() {
    this.apiService.apiPost('cms/removewebsitesubmenuitem', { Id: this.selectedSubMenuItem.Id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
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
  }

  searchFindWebSiteMenuItemBySubMenuTitle() {
    this.apiService.apiPost('cms/findsubmenuitembytitle',
    {
      Title: this.searchTitle.trim(),
      MenuId: this.selectedMenu.Id
    }
    ).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
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
    this.apiService.apiPost('cms/uploadconfigfile', { PartnerId: this.partnerId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Successfully upload config', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  uploadMenus() {
    this.apiService.apiPost('cms/uploadmenus', { PartnerId: this.partnerId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Successfully upload menu', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  uploadStyles() {
    this.apiService.apiPost('cms/uploadwebsitestylesfile', { PartnerId: this.partnerId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Successfully upload styles', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  uploadTranslations() {
    this.apiService.apiPost('cms/uploadwebsitetranslations', { PartnerId: this.partnerId })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: 'Successfully upload translations', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  ClearCloudCache() {
    this.apiServiceCore.apiPost(this.configService.getApiUrl, +this.partnerId, true,
      Controllers.PARTNER, Methods.PURGE_CONTENT_CACHE).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
        }
      });
  }

}
