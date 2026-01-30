
export interface Allergen {
  id: string;
  name: string;
  enabled: boolean;
}

export interface ScanResult {
  ingredients: string[];
  detectedAllergens: {
    ingredient: string;
    matchedAllergens: string[];
    explanation: string;
  }[];
  originalLanguage: string;
  translation?: string;
  safetyRating: 'safe' | 'warning' | 'danger';
  timestamp: number;
}

export interface HistoryItem extends ScanResult {
  id: string;
  imageUrl?: string;
}
