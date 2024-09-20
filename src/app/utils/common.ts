import { FormControl } from '@angular/forms';

export type GetFormControlFrom<TData extends object> = {
  [TKey in keyof TData]: FormControl<TData[TKey]>;
};
