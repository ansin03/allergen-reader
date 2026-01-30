
import { Allergen } from './types';

export const DEFAULT_ALLERGENS: Allergen[] = [
  { id: '1', name: 'Peanuts', enabled: true },
  { id: '2', name: 'Dairy', enabled: true },
  { id: '3', name: 'Gluten', enabled: true },
  { id: '4', name: 'Eggs', enabled: false },
  { id: '5', name: 'Soy', enabled: false },
  { id: '6', name: 'Tree Nuts', enabled: false },
  { id: '7', name: 'Shellfish', enabled: false },
  { id: '8', name: 'Fish', enabled: false },
  { id: '9', name: 'Sesame', enabled: false },
];

export const APP_VERSION = '1.0.0';
