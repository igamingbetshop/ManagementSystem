import {Component, Injector, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import 'ag-grid-enterprise';
import {MatSnackBar} from '@angular/material/snack-bar';
import {take} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ConfigService} from 'src/app/core/services';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {SportsbookApiService} from "../../services/sportsbook-api.service";
import {GridRowModelTypes, ModalSizes} from "../../../../../core/enums";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent extends BasePaginatedGridComponent implements OnInit {

  private path: string = 'teams';
  public teamId: number;
  public rowModelType:string = GridRowModelTypes.CLIENT_SIDE;
  private sportId: number;
  public teamData: any = {};
  public formGroup: UntypedFormGroup;
  public rowData = [];
  public isEdit = false;
  isSendingReqest = false;
  image: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: SportsbookApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    protected injector: Injector,
    public dialog: MatDialog
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: false,
        resizable: true,
        filter: false
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: false,
        resizable: true,
        filter: false
      },
      {
        headerName: 'Common.ParentId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ParentId',
        sortable: false,
        resizable: true,
        filter: false
      },
      {
        headerName: 'Common.Rating',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Rating',
        sortable: false,
        resizable: true,
        filter: false
      },
      {
        headerName: 'Common.SportId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportId',
        sortable: false,
        resizable: true,
        filter: false
      },
      {
        headerName: 'Common.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        sortable: false,
        resizable: true,
        filter: false
      },
      {
        headerName: 'Common.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        sortable: false,
        resizable: true,
        filter: false
      },
      {
        headerName: 'Common.TypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeId',
        sortable: false,
        resizable: true,
        filter: false
      }
    ]
  }

  ngOnInit() {
    this.createForm();
    this.gridStateName = 'team-grid-state';
    this.teamId = this.activateRoute.snapshot.queryParams.teamId;
    this.getMembers();
    this.getTeamById();
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  getMembers() {
    this.apiService.apiPost(this.path, {ParentId: this.teamId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData  = data.Objects;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  getTeamById() {
    this.apiService.apiPost('teams/team', {Id: this.teamId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.teamData = data.ResponseObject;
          this.sportId = data.ResponseObject.SportId;
          this.formGroup.patchValue(this.teamData);
          this.image = "https://resources.iqsoftllc.com/" + this.teamData.LogoImageUrl;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [null],
      Name: [null],
      ParentId: [null],
      Rating: [null],
      SportId: [null, [Validators.required]],
      SportName: [null],
      TranslationId: [null, [Validators.required]],
      TypeId: [null, [Validators.required]],
      LogoImage: [null],
      LogoImageUrl: [null],
    });
  }

  async addMember() {
    const {AddMemberComponent} = await import('./add-member/add-member.component');
    const dialogRef = this.dialog.open(AddMemberComponent, {width: ModalSizes.LARGE, data : {SportId : this.sportId, ParentId: this.teamId}});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getMembers();
      }
    })
  }

  uploadLogoImage(evt) {
    let files = evt.target.files;
    let file = files[0];
    const maxSizeInBytes = 900000;
    const validDocumentFormat = file && file.type === 'image/svg+xml';
    const validDocumentSize = file && file.size <= maxSizeInBytes;
  
    if (files && file && validDocumentFormat && validDocumentSize) {
      let reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        this.formGroup.get('LogoImage').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
      };
      reader.readAsDataURL(file);
      this.isSendingReqest = false;
    } else {
      this.isSendingReqest = true;
      let errorMessage = 'Invalid file format or size. ';
      if (!validDocumentFormat) {
        errorMessage += 'Please upload an SVG format file. ';
      }
      if (!validDocumentSize) {
        errorMessage += 'File size must be less than 900 KB.';
      }
      SnackBarHelper.show(this._snackBar, {Description: errorMessage, Type: "error"});
    }
  }
  

  onSubmit() {
    const requestBody =  this.formGroup.getRawValue();

    this.apiService.apiPost(this.path + '/update', requestBody).subscribe(data => {
      if (data.Code === 0) {
        this.isEdit = false;
        this.getTeamById();
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

}
