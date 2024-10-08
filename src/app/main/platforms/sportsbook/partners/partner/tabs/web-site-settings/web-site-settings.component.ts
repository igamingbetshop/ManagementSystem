import { Component, HostListener, Injector, OnInit, signal } from '@angular/core';
import { Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SportsbookApiService } from "../../../../services/sportsbook-api.service";
import { debounceTime, take } from "rxjs/operators";
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { CoreApiService } from "../../../../../core/services/core-api.service";
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
  websiteMenuItem;
  websiteSubMenuItem;
  model: string;
  modelChanged: Subject<string> = new Subject<string>();
  searchTitle = '';
  searchedResultTitle: string;
  showSearchedResult: boolean = false;
  deviceTypes = signal(DEVICE_TYPES);
  deviceType = this.deviceTypes()[0].Id;
  icon = signal('Icon');
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

  constructor(private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    private apiService: SportsbookApiService,
    public dialog: MatDialog,
    private apiServiceCore: CoreApiService,
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

  changeDeviceType(deviceType: number) {
    this.deviceType = deviceType;
    this.getWebsiteMenus();
  }

  getWebsiteMenus() {
    this.apiService.apiPost('cms/getwebsitemenus', { PartnerId: +this.partnerId, DeviceType: this.deviceType, })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData.set(data.ResponseObject);
          if (!!this.rowData().length) {
            this.selectedMenu = data.ResponseObject[0];
            this.getWebsiteMenuItems(this.selectedMenu.Id);
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
            this.webSiteMenusRowData.set(data.ResponseObject);
            this.selectedMenuItem = this.webSiteMenusRowData()[0];
            if (this.selectedMenuItem) {
              this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
            }
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
          this.subMenusRowData.set(data.ResponseObject);
          // this.selectedSubMenuItem = this.subMenusRowData[0];          
          if (this.selectedMenuItem.Title === 'FullRegister') {
            this.icon.set('Step');
          } else {
            this.icon.set('Icon');
          }
        } else { }
      });
  }

  async copyPartnerWebSiteSettings() {
    const { CopyWebsiteSettingsComponent } = await import('./copy-website-settings/copy-website-settings.component');
    const dialogRef = this.dialog.open(CopyWebsiteSettingsComponent, {
      width: ModalSizes.MEDIUM,
      data: { deviceType: this.deviceType, }
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

  onMenuClicked(event) {
    this.subMenusRowData.set([]);
    this.selectedMenuItem = event.data;
    this.getWebSiteSubMenuItems(event.data.Id);
  }

  async openDialog(action, obj) {
    obj.action = action;
    obj.MenuId = this.selectedMenu.Id;
    const { AddEditMenuComponent } = await import('./add-edit-menu/add-edit-menu.component');
    const dialogRef = this.dialog.open(AddEditMenuComponent, { width: ModalSizes.MEDIUM, data: obj });
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

  async addEditMenu(event) {
    console.log(event);

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

  onRowClicked(event) {
    this.webSiteMenusRowData.set([]);
    this.subMenusRowData.set([]);
    this.selectedMenu = event.data;

    this.getWebsiteMenuItems(event.data.Id);
  }

  onSubmenuRowClicked(event) {
    this.selectedSubMenuItem = event.data
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

  async addEditTranslation(item) {
    item.PartnerId = this.partnerId;
    // event.stopPropagation();
    if (this.selectedMenu.Type == 'Translations') {
      const { AddEditTranslationsComponent } = await import('./add-edit-translations/add-edit-translations.component');
      const dialogRef = this.dialog.open(AddEditTranslationsComponent, { width: ModalSizes.MEDIUM, data: item });
      dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
        if (data) {
          // this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
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

  handleSubMenuItem(event) {
    console.log(this.selectedMenu, "this.selectedMenu");
    
    if ((this.selectedMenu.Type == "Translations" && event.data.colId == 'Title')) {
      this.addEditTranslation(event.data);
    // } else if (this.selectedMenu.Type == 'Config' && this.selectedMenuItem.Title == "CloudflareZoneId") {
    //   this.addEditConfig(event);
    } else {
      this.addEditSubMenuItem('Edit', event.data);
    }

  }

}
