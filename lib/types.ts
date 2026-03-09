export type FurnitureType =
  | 'bibliotheque'
  | 'meuble-tv'
  | 'rangement-bas'
  | 'rangement-haut'
  | 'meuble-mural'
  | 'dressing-simple'
  | 'banquette-integree'
  | 'autre';

export type ConfigurationDimensions = {
  widthCm: number;
  heightCm: number;
  depthCm: number;
};

export type ModuleLayout = {
  columns: number;
  rows: number;
  openModules: number;
  closedModules: number;
  asymmetry: boolean;
  customLargeModules: number;
};

export type MaterialOption = 'melamine' | 'placage-bois' | 'bois-massif' | 'laque';
export type FinishOption = 'standard-mat' | 'satin' | 'premium-laque';

export type PricingEstimate = {
  estimatedBase: number;
  lowRange: number;
  highRange: number;
  complexityLevel: 'simple' | 'intermediaire' | 'avance';
  drivers: string[];
};

export type LeadQualification = {
  budgetAligned: boolean;
  localProject: boolean;
  projectMaturity: 'faible' | 'moyenne' | 'elevee';
  hasInspirationAssets: boolean;
  needsInstallation: boolean;
  score: number;
};

export type QuoteRequestPayload = {
  leadId: string;
  date: string;
  source: 'configurateur-web';
  furnitureType: FurnitureType;
  dimensions: ConfigurationDimensions;
  layout: ModuleLayout;
  options: {
    led: boolean;
    doors: number;
    drawers: number;
    backPanel: boolean;
    wallFixings: boolean;
  };
  material: MaterialOption;
  finish: FinishOption;
  customerBudget: number;
  location: string;
  desiredTimeline: string;
  needInstallation: boolean;
  projectStage: string;
  comments?: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    consent: boolean;
  };
  estimate: PricingEstimate;
  qualification: LeadQualification;
};

export type AutomationPayload = {
  webhookVersion: 'v1';
  route: 'new-lead';
  quoteRequest: QuoteRequestPayload;
  tags: string[];
};

export type ConfiguratorState = {
  furnitureType: FurnitureType;
  dimensions: ConfigurationDimensions;
  layout: ModuleLayout;
  material: MaterialOption;
  finish: FinishOption;
  options: {
    led: boolean;
    doors: number;
    drawers: number;
    backPanel: boolean;
    wallFixings: boolean;
    installation: boolean;
    delivery: boolean;
  };
};
