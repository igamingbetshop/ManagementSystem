import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-currency-settings-component',
  templateUrl: './currency-settings.component.html',
  styleUrls: ['./currency-settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class CurrencySettingsComponent implements OnInit {

  @Input() dataSource: any;
  @Output() dataSourceChange = new EventEmitter<any>();
  @Input() isNotUptoAmmount?: boolean;
  displayedColumns: string[] = ['currency', "minAmount", "maxAmount", 'upToAmount', 'delete'];
  selection = new SelectionModel<any>(false, []);


  ngOnInit(): void {

   if (this.isNotUptoAmmount) {
    this.displayedColumns = this.displayedColumns.filter(element => element !== 'upToAmount');
    }
  }

  onDelete(item) {
    this.dataSourceChange.emit(this.dataSource.filter((i) => i.CurrencyId !== item.CurrencyId))
  }

  isRowSelected(currency: any): boolean {
    return this.selection.isSelected(currency);
  }

  onRowClick(currency: any) {
    this.selection.clear();
    this.selection.select(currency);
  }

  onCurrencyChange(currency: any) {
    this.dataSourceChange.emit(this.dataSource);
  }
}
