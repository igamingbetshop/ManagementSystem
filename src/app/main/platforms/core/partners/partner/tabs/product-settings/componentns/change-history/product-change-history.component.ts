import {Component, Injector, OnInit} from '@angular/core';
import { DatePipe } from "@angular/common";

import {IRowNode, RowModelType} from "ag-grid-community";
import 'ag-grid-enterprise';
import {BaseGridComponent} from "../../../../../../../../components/classes/base-grid-component";
import {Controllers, GridRowModelTypes, Methods} from "../../../../../../../../../core/enums";
import {OpenerComponent} from "../../../../../../../../components/grid-common/opener/opener.component";
import {take} from "rxjs/operators";


@Component({
  selector: 'product-change-history',
  templateUrl: './product-change-history.component.html',
  styleUrls: ['./product-change-history.component.scss']
})
export class ProductChangeHistoryComponent extends BaseGridComponent implements OnInit {
  public rowData = [];
  public rowModelType: RowModelType = GridRowModelTypes.CLIENT_SIDE;
  public columnDefs = [
    {
      headerName: 'Common.Id',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Id',
      sortable: true,
      resizable: true
    },
    {
      headerName: 'Payments.Comment',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Comment',
      sortable: true,
      resizable: true
    },
    {
      headerName: 'Common.ChangeDate',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'ChangeDate',
      sortable: true,
      resizable: true,
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
      cellRenderer: params => {
        let div = document.createElement('div');
        if (params.data.FirstName !== null || params.data.LastName !== null) {
          div.innerHTML = params.data.FirstName + ' ' + params.data.LastName;
        }
        return div;
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

  constructor(protected injector: Injector)
  {
    super(injector);
  }

  getObjectChangeHistory(objectId)
  {
    this.coreApiService.apiPost(this.configService.getApiUrl, { ObjectId: objectId, ObjectTypeId: 19 }, true,
      Controllers.REPORT, Methods.GET_OBJECT_CHANGE_HISTORY).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject;
      } else {
        this.rowData = [];
      }
    });
  }

}
