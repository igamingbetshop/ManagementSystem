import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, InputSignal, Output, input } from '@angular/core';
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

export class CurrencySettingsComponent {
  @Input() set dataSource(value: any[]) {
    if (value && value.length > 0) {
      this.originalDataSource = JSON.parse(JSON.stringify(value));
      this._dataSource = value;
      // console.log('Original DataSource after initialization:', this.originalDataSource);
    } else {
      // console.error('DataSource is not properly initialized or is empty.');
    }
  }
  
  @Output() dataSourceChange = new EventEmitter<any[]>();

  displayedColumns: string[] = ['currency', 'amount', 'minAmount', 'maxAmount', 'upToAmount', 'delete'];
  isNotUptoAmmount: InputSignal<any> = input(null, {
    transform: (v: boolean) => {
      if(!!v) {
        this.displayedColumns = this.displayedColumns.filter(element => element !== 'upToAmount');
      }
      return v;
    }
  });
  isNotAmount: InputSignal<any> = input(null, {
    transform: (v: boolean) => {
      if(!!v) {
        this.displayedColumns = this.displayedColumns.filter(element => element !== 'amount');
      }
      return v;
    }
  });
  isNotMinAmount: InputSignal<any> = input(null, {
    transform: (v: boolean) => {
      if(!!v) {
        this.displayedColumns = this.displayedColumns.filter(element => element !== 'minAmount');
      }
      return v;
    }
  });
  isNotMaxAmount: InputSignal<any> = input(null, {
    transform: (v: boolean) => {
      if(!!v) {
        this.displayedColumns = this.displayedColumns.filter(element => element !== 'maxAmount');
      }
      return v;
    }
  });
  originalDataSource: any[] = [];
  _dataSource: any[] = [];
  selection = new SelectionModel<any>(false, []);

  onDelete(item) {
    this._dataSource = this._dataSource.filter((i) => i.CurrencyId !== item.CurrencyId);
    this.emitDataSourceChange();
  }

  isRowSelected(currency: any): boolean {
    return this.selection.isSelected(currency);
  }

  onRowClick(currency: any) {
    this.selection.clear();
    this.selection.select(currency);
  }

  onCurrencyChange(currency: any) {
    if (this.originalDataSource && this.originalDataSource.length > 0) {
      const originalCurrency = this.originalDataSource.find(c => c.CurrencyId === currency.CurrencyId);

      if (originalCurrency && !this.deepEqual(originalCurrency, currency)) {
        this.emitDataSourceChange();
      } else if (!originalCurrency) {
        console.warn(`Original currency with CurrencyId ${currency.CurrencyId} not found.`);
      }
    } else {
      console.error('OriginalDataSource is empty or not initialized.');
    }
  }

  emitDataSourceChange() {
    this.dataSourceChange.emit(this._dataSource);
  }

  deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
      if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  }
}