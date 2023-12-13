import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {SkillGamesApiService} from "../../../../services/skill-games-api.service";
import {take} from "rxjs/operators";
import {ModalSizes} from "../../../../../../../core/enums";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-web-site-settings',
  templateUrl: './web-site-settings.component.html',
  styleUrls: ['./web-site-settings.component.scss']
})
export class WebSiteSettingsComponent implements OnInit {
  public partnerId: number;
  public partnerName;
  public menus = [];
  public websiteMenuItems = [];
  public subMenuItems = [];
  public selectedMenu;
  public selectedMenuItem;
  public selectedSubMenuItem;
  public websiteMenuItem;
  public websiteSubMenuItem;

  constructor(private activateRoute: ActivatedRoute,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              public apiService: SkillGamesApiService) { }

  ngOnInit(): void {
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.partnerName = this.activateRoute.snapshot.queryParams.partnerName;
    this.getWebsiteMenus();
  }

  getWebsiteMenus() {
    this.apiService.apiPost('cms/websitemenus', {PartnerId: +this.partnerId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.menus = data.ResponseObject;
          this.selectedMenu = data.ResponseObject[0]
          this.getWebsiteMenuItems(this.selectedMenu.Id)
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  getWebsiteMenuItems(menuId) {
    this.apiService.apiPost('cms/websitemenuItems', {MenuId: menuId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.websiteMenuItems = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  getWebSiteSubMenuItems(menuItemId) {
    this.apiService.apiPost('cms/websitesubmenuItems', {MenuItemId: menuItemId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.subMenuItems = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
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

  deleteWebsiteMenuItem() {
    this.apiService.apiPost('cms/removewebsitemenuitem', {Id: this.selectedMenuItem.Id})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.getWebsiteMenuItems(this.selectedMenu.Id);
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  deleteWebsiteSubMenuItem() {
    this.apiService.apiPost('cms/removewebsitesubmenuitem', {Id: this.selectedSubMenuItem.Id})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  async addEditTranslation(item, event) {
    item.PartnerId = this.partnerId;
    event.stopPropagation();
    if (this.selectedMenu.Type.includes('Translations')) {
      const {AddEditTranslationsComponent} = await import('./add-edit-translations/add-edit-translations.component');
      const dialogRef = this.dialog.open(AddEditTranslationsComponent, {width: ModalSizes.MEDIUM, data: item});
      dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
        if (data) {
          this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
        }
      });
    }
  }

  async openDialog(action, obj) {
    obj.action = action;
    obj.MenuId = this.selectedMenu.Id;
    const {AddEditMenuComponent} = await import('./add-edit-menu/add-edit-menu.component');
    const dialogRef = this.dialog.open(AddEditMenuComponent, {width: ModalSizes.MEDIUM, data: obj});
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      this.getWebsiteMenuItems(this.selectedMenu.Id);
    });
  }

  async openDialogSubMenu(action, obj) {
    obj.action = action;
    obj.MenuItemId = this.selectedMenuItem.Id;
    const {AddEditSubMenuComponent} = await import('./add-edit-sub-menu/add-edit-sub-menu.component');
    const dialogRef = this.dialog.open(AddEditSubMenuComponent, {width: ModalSizes.MEDIUM, data: obj});
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      this.getWebSiteSubMenuItems(this.selectedMenuItem.Id);
    });
  }

  async copyPartnerWebSiteSettings() {
    const {CopyWebsiteSettingsComponent} = await import('./copy-website-settings/copy-website-settings.component');
    const dialogRef = this.dialog.open(CopyWebsiteSettingsComponent, {
      width: ModalSizes.MEDIUM
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getWebsiteMenus();
      }
    });
  }

  uploadConfig() {
    this.apiService.apiPost('cms/uploadconfigs', {PartnerId: this.partnerId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      })
  }

  uploadStyles() {
    this.apiService.apiPost('cms/uploadstyles', {PartnerId: this.partnerId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      })
  }

  uploadMenu() {
    this.apiService.apiPost('cms/uploadmenus', {PartnerId: this.partnerId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      })
  }

  uploadTranslations() {
    this.apiService.apiPost('cms/uploadtranslations', {PartnerId: this.partnerId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      })
  }

}
