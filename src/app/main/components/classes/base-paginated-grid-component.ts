import {Directive, Injector, OnDestroy} from '@angular/core';
import {BaseGridComponent} from './base-grid-component';
import {GridRowModelTypes} from '../../../core/enums';
import {GetContextMenuItemsParams, ISetFilter, MenuItemDef, ServerSideStoreType} from 'ag-grid-community';
import {fromEvent, Subscription} from "rxjs";

@Directive()
export class BasePaginatedGridComponent extends BaseGridComponent implements OnDestroy{
  public pagination: boolean = true;
  public paginationAutoPageSize: boolean = false;
  public paginationPageSize: number = 100;
  public cacheBlockSize: number = 100;
  public cacheBlockSize1 = 100;
  public suppressPaginationPanel: boolean = false;
  public rowModelType:any = GridRowModelTypes.SERVER_SIDE;
  public serverSideStoreType:ServerSideStoreType = 'full';
  public pageSizes = [100, 500, 1000, 2000, 5000];
  public pageSizesSecond = [100, 500, 1000, 2000, 5000];
  public defaultPageSize = 100;
  public defaultPageSizeSecond = 100;
  public colId: string;
  public paginationPage = 1;
  public subscription: Subscription = new Subscription();

  constructor(
    protected injector: Injector,

  ) {
    super(injector)
    this.subscription = fromEvent(document, 'keypress').subscribe((event) => {
      this.keyPressHandler(event);
    });
  }

  onFilterModified(event) {
    this.colId = event.column.colId;
  }

  keyPressHandler(event) {
    const filterPopup = document.querySelector('.ag-theme-balham .ag-popup');
    if (!filterPopup || !this.colId) {
      return;
    }

    if (event.keyCode === 13) {
      const instance = this.gridApi.getFilterInstance(this.colId) as ISetFilter;
      this.colId = null;
      instance.applyModel();
      this.gridApi.onFilterChanged();
      this.gridApi.hidePopupMenu();
    }
  }

  onPaginationChanged(event)
  {
    const page = this.gridApi?.paginationGetCurrentPage();
    if(!isNaN(page))
    this.paginationPage = this.gridApi?.paginationGetCurrentPage() + 1;
  }

  onPaginationGoToPage(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.gridApi.paginationGoToPage(this.paginationPage - 1);
    }
  }

  getContextMenuItems(params: GetContextMenuItemsParams): (string | MenuItemDef)[] {
    return ['copy'];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
