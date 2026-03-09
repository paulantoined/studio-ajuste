import { ConfiguratorState, FinishOption, FurnitureType, MaterialOption, PricingEstimate } from './types';

const BASE_PRICE: Record<FurnitureType, number> = {
  bibliotheque: 1800,
  'meuble-tv': 1400,
  'rangement-bas': 1200,
  'rangement-haut': 1300,
  'meuble-mural': 2100,
  'dressing-simple': 2200,
  'banquette-integree': 1900,
  autre: 1600
};

const MATERIAL_COEFFICIENT: Record<MaterialOption, number> = {
  melamine: 1,
  'placage-bois': 1.2,
  'bois-massif': 1.35,
  laque: 1.28
};

const FINISH_COEFFICIENT: Record<FinishOption, number> = {
  'standard-mat': 1,
  satin: 1.08,
  'premium-laque': 1.2
};

const MINIMUM_CHARGE = 1600;

const formatDriver = (condition: boolean, label: string, list: string[]) => {
  if (condition) list.push(label);
};

export function calculateEstimate(input: ConfiguratorState): PricingEstimate {
  const volumeFactor = (input.dimensions.widthCm * input.dimensions.heightCm * input.dimensions.depthCm) / 1_000_000;
  const modules = input.layout.columns * input.layout.rows;

  let price = BASE_PRICE[input.furnitureType] + volumeFactor * 180 + modules * 90;
  price += input.options.doors * 95 + input.options.drawers * 120;
  if (input.options.led) price += 320;
  if (input.layout.asymmetry) price *= 1.1;
  if (input.layout.customLargeModules > 0) price += input.layout.customLargeModules * 140;

  price *= MATERIAL_COEFFICIENT[input.material];
  price *= FINISH_COEFFICIENT[input.finish];

  if (input.options.installation) price += 450;
  if (input.options.delivery) price += 180;

  const estimatedBase = Math.max(MINIMUM_CHARGE, Math.round(price));
  const buffer = Math.max(estimatedBase * 0.11, 250);
  const lowRange = Math.round(estimatedBase - buffer);
  const highRange = Math.round(estimatedBase + buffer);

  const drivers: string[] = [];
  formatDriver(input.options.led, 'Intégration LED', drivers);
  formatDriver(input.options.doors > 4, 'Nombre élevé de portes', drivers);
  formatDriver(input.options.drawers > 2, 'Tiroirs sur mesure', drivers);
  formatDriver(input.material !== 'melamine', 'Matériau premium', drivers);
  formatDriver(input.finish !== 'standard-mat', 'Finition avancée', drivers);
  formatDriver(input.layout.asymmetry, 'Composition asymétrique', drivers);

  let complexityLevel: PricingEstimate['complexityLevel'] = 'simple';
  if (modules >= 10 || input.layout.asymmetry || input.options.drawers >= 3) {
    complexityLevel = 'intermediaire';
  }
  if (modules >= 14 || input.layout.customLargeModules >= 2 || (input.options.led && input.options.drawers >= 3)) {
    complexityLevel = 'avance';
  }

  return {
    estimatedBase,
    lowRange,
    highRange,
    complexityLevel,
    drivers
  };
}

export const euro = (value: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
