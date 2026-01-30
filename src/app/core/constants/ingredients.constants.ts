import { Rarity } from '../enums/order.enums';
import { IngredientInterface } from '../interfaces/ingredient.interface';

export const magicalIngredients: IngredientInterface[] = [
  {
    id: '1',
    name: 'mandrakeRoot',
    rarity: Rarity.RARE,
    effect: 'mandrakeRoot',
    price: 120
  },
  {
    id: '2',
    name: 'moonflowerPollen',
    rarity: Rarity.UNCOMMON,
    effect: 'moonflowerPollen',
    price: 75
  },
  {
    id: '3',
    name: 'phoenixTear',
    rarity: Rarity.LEGENDARY,
    effect: 'phoenixTear',
    price: 500
  },
  {
    id: '4',
    name: 'nightDragonScale',
    rarity: Rarity.VERY_RARE,
    effect: 'nightDragonScale',
    price: 320
  },
  {
    id: '5',
    name: 'underdarkSpiderSilk',
    rarity: Rarity.RARE,
    effect: 'underdarkSpiderSilk',
    price: 90
  },
  {
    id: '6',
    name: 'swampTrollBlood',
    rarity: Rarity.UNCOMMON,
    effect: 'swampTrollBlood',
    price: 110
  },
  {
    id: '7',
    name: 'seerOwlFeather',
    rarity: Rarity.RARE,
    effect: 'seerOwlFeather',
    price: 180
  },
  {
    id: '8',
    name: 'manaCrystal',
    rarity: Rarity.COMMON,
    effect: 'manaCrystal',
    price: 60
  },
  {
    id: '9',
    name: 'mistEssence',
    rarity: Rarity.UNCOMMON,
    effect: 'mistEssence',
    price: 95
  },
  {
    id: '10',
    name: 'vampireFang',
    rarity: Rarity.RARE,
    effect: 'vampireFang',
    price: 210
  }
];
