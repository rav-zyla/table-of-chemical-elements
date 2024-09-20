import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  asyncScheduler,
  debounceTime,
  delay,
  filter,
  scheduled,
  tap,
} from 'rxjs';
import { COLUMNS, ELEMENT_DATA } from '../../static/table.data';
import { EditItemDialogComponent } from './components/edit-item-dialog/edit-item-dialog.component';
import { DtoNameId, PeriodicElement } from './table.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  protected readonly dataSource = new MatTableDataSource<PeriodicElement>([]);
  protected readonly columns: DtoNameId[] = COLUMNS;
  protected readonly displayedColumns: string[];
  protected readonly searchControl: FormControl<string> = new FormControl('', {
    nonNullable: true,
  });

  constructor() {
    this.displayedColumns = this.columns.map(({ id }: DtoNameId) => id);
    this.fetchData();
    this.observeSearchControlChanges();
  }

  private fetchData(): void {
    scheduled([ELEMENT_DATA], asyncScheduler)
      .pipe(
        delay(1000),
        tap((data: PeriodicElement[]) => {
          this.dataSource.data = data;
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private observeSearchControlChanges(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(2000),
        tap((value: string) => this.applyFilter(value)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  protected editElement(element: PeriodicElement): void {
    this.dialog
      .open(EditItemDialogComponent, {
        data: { ...element },
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap((result: PeriodicElement) => this.updateData(result))
      )
      .subscribe();
  }

  private updateData(element: PeriodicElement): void {
    const elementIndex: number = this.dataSource.data.findIndex(
      (item: PeriodicElement) => item.position === element.position
    );

    if (elementIndex === -1) return;

    const updatedData = [...this.dataSource.data];
    updatedData[elementIndex] = element;
    this.dataSource.data = updatedData;
  }
}
