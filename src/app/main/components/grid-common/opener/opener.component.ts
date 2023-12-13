import {Component } from '@angular/core';
import {ICellRendererParams} from "ag-grid-community";

@Component({
  selector: 'app-opener',
  templateUrl: './opener.component.html',
  styleUrls: ['./opener.component.scss']
})
export class OpenerComponent {
  public path: string;
  public queryParams:any;

  constructor()
  {

  }

  agInit(params: ICellRendererParams): void
  {
    this.path = params.value.path;
    this.queryParams = params.value.queryParams;
  }

  refresh(params: ICellRendererParams)
  {

  }

}
