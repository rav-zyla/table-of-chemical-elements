import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { PeriodicElement, PeriodicElementControls } from '../../table.model';

@Component({
  selector: 'app-edit-item-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './edit-item-dialog.component.html',
  styleUrl: './edit-item-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditItemDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EditItemDialogComponent>);
  private readonly dialogData = inject<PeriodicElement>(MAT_DIALOG_DATA);
  protected readonly formGroup: FormGroup<PeriodicElementControls>;

  constructor() {
    this.formGroup = this.buildFrom(this.dialogData);
  }

  private buildFrom(data: PeriodicElement): FormGroup<PeriodicElementControls> {
    const { position, name, weight, symbol } = data;

    return new FormGroup({
      position: new FormControl(position, {
        nonNullable: true,
      }),
      name: new FormControl(name, {
        nonNullable: true,
      }),
      weight: new FormControl(weight, { nonNullable: true }),
      symbol: new FormControl(symbol, { nonNullable: true }),
    });
  }

  protected saveChanges(): void {
    this.dialogRef.close(this.formGroup.value);
  }
}
