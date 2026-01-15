import { IngredientInterface } from './ingredient.interface';

export interface OrderInterface {
  id: string;
  name: string;
  number: string;
  date: string;
  readyDate: string;
  address: string;
  delivery: string;
  payment: string;
  ingredients?: IngredientInterface[];
}
