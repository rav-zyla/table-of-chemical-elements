import { GetFormControlFrom } from '../../utils/common';

export type PeriodicElement = {
  position: number;
  name: string;
  weight: number;
  symbol: string;
};

export type DtoNameId = {
  name: string;
  id: string;
};

export type PeriodicElementControls = GetFormControlFrom<PeriodicElement>;
