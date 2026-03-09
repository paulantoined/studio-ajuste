import { STUDIO_BUSINESS_CONFIG } from './business-config';
import { ConfiguratorState, PricingEstimate } from './types';

const formatDriver = (condition: boolean, label: string, list: string[]) => {
  if (condition) list.push(label);
};

export function calculateEstimate(input: ConfiguratorState): PricingEstimate {
  const config = STUDIO_BUSINESS_CONFIG;
  const volumeFactor = (input.dimensions.widthCm * input.dimensions.heightCm * input.dimensions.depthCm) / 1_000_000;
  const modules = input.layout.columns * input.layout.rows;

  let price = config.basePriceByFurnitureType[input.furnitureType] + volumeFactor * config.volumeUnitPrice + modules * config.moduleUnitPrice;
  price += input.options.doors * config.doorUnitPrice + input.options.drawers * config.drawerUnitPrice;
  if (input.options.led) price += config.ledAddon;
  if (input.layout.asymmetry) price *= config.asymmetryCoefficient;
  if (input.layout.customLargeModules > 0) price += input.layout.customLargeModules * config.customModuleSurcharge;

  price *= config.materialCoefficient[input.material];
  price *= config.finishCoefficient[input.finish];

  if (input.options.installation) price += config.installationFee;
  if (input.options.delivery) price += config.deliveryFee;

  const estimatedBase = Math.max(config.minimumCharge, Math.round(price));
  const buffer = Math.max(estimatedBase * config.uncertaintyRatio, config.minimumBuffer);
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
  if (modules >= 10 || input.layout.asymmetry || input.options.drawers >= 3) complexityLevel = 'intermediaire';
  if (modules >= 14 || input.layout.customLargeModules >= 2 || (input.options.led && input.options.drawers >= 3)) complexityLevel = 'avance';

  return {
    estimatedBase,
    lowRange,
    highRange,
    complexityLevel,
    drivers,
    indicativeDelay: config.delaysByComplexityWeeks[complexityLevel]
  };
}

export const euro = (value: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
