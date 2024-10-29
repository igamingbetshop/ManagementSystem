import { Component, Injector, OnInit } from '@angular/core';
import { CoreApiService } from "../../../services/core-api.service";
import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { GridMenuIds, Methods } from "../../../../../../core/enums";
import {ExportService} from "../../../services/export.service";
import { ReportByAgentCorrectionsComponents } from '../../agents/report-by-agent-corrections/report-by-agent-corrections.component';

@Component({
  selector: 'app-report-by-user-corrections',
  templateUrl: '../../agents/report-by-agent-corrections/report-by-agent-corrections.component.html',
  styleUrls: ['../../agents/report-by-agent-corrections/report-by-agent-corrections.component.scss']
})
export class ReportByUserCorrectionsComponents extends ReportByAgentCorrectionsComponents implements OnInit {
  public rowData = [];
  title = 'Reports.ReportByUserCorrections';
  method = Methods.GET_REPORT_BY_USER_CORRECTIONS;
  exportMethod = Methods.EXPORT_REPORT_BY_USER_CORRECTIONS;

  constructor(
    protected apiService: CoreApiService,
    protected configService: ConfigService,
    protected _snackBar: MatSnackBar,
    protected commonDataService: CommonDataService,
    protected exportService:ExportService,
    protected injector: Injector) {
    super(
      apiService,
      configService,
      _snackBar,
      commonDataService,
      exportService,
      injector,);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_AGENTS_TRANSACTIONS;

  }


}
