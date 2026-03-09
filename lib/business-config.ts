import { FinishOption, FurnitureType, MaterialOption } from './types';

export type StudioBusinessConfig = {
  basePriceByFurnitureType: Record<FurnitureType, number>;
  materialCoefficient: Record<MaterialOption, number>;
  finishCoefficient: Record<FinishOption, number>;
  moduleUnitPrice: number;
  volumeUnitPrice: number;
  doorUnitPrice: number;
  drawerUnitPrice: number;
  ledAddon: number;
  asymmetryCoefficient: number;
  customModuleSurcharge: number;
  installationFee: number;
  deliveryFee: number;
  minimumCharge: number;
  uncertaintyRatio: number;
  minimumBuffer: number;
  leadScoring: {
    budgetThreshold: number;
    preferredZonesRegex: string;
    points: {
      budgetAligned: number;
      localProject: number;
      needsInstallation: number;
      customComplexity: number;
      inspirationAssets: number;
      coreFurnitureType: number;
    };
  };
  delaysByComplexityWeeks: Record<'simple' | 'intermediaire' | 'avance', string>;
};

export const STUDIO_BUSINESS_CONFIG: StudioBusinessConfig = {
  basePriceByFurnitureType: {
    bibliotheque: 1800,
    'meuble-tv': 1450,
    'rangement-bas': 1200,
    'rangement-haut': 1300,
    'meuble-mural': 2200,
    'dressing-simple': 2400,
    'banquette-integree': 2000,
    autre: 1600
  },
  materialCoefficient: {
    melamine: 1,
    'placage-bois': 1.2,
    'bois-massif': 1.35,
    laque: 1.3
  },
  finishCoefficient: {
    'standard-mat': 1,
    satin: 1.08,
    'premium-laque': 1.2
  },
  moduleUnitPrice: 90,
  volumeUnitPrice: 180,
  doorUnitPrice: 95,
  drawerUnitPrice: 120,
  ledAddon: 320,
  asymmetryCoefficient: 1.1,
  customModuleSurcharge: 140,
  installationFee: 450,
  deliveryFee: 180,
  minimumCharge: 1600,
  uncertaintyRatio: 0.11,
  minimumBuffer: 250,
  leadScoring: {
    budgetThreshold: 2500,
    preferredZonesRegex: '(paris|idf|ile-de-france|hauts-de-seine|yvelines)',
    points: {
      budgetAligned: 25,
      localProject: 20,
      needsInstallation: 15,
      customComplexity: 15,
      inspirationAssets: 10,
      coreFurnitureType: 15
    }
  },
  delaysByComplexityWeeks: {
    simple: '4 à 6 semaines',
    intermediaire: '6 à 9 semaines',
    avance: '8 à 12 semaines'
  }
};
