export interface IngredientInterface {
  id: string;
  name: string;
  price: number;
  percent: number;
}

export interface IngredientFormValue {
  id: string;
  name: string;
  price: number | null;
  percent: number | null;
  edit: boolean;
}
