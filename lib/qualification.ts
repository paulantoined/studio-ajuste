import { STUDIO_BUSINESS_CONFIG } from './business-config';
import { ConfiguratorState, LeadQualification } from './types';

export function scoreLead(input: ConfiguratorState, budget: number, location: string, hasAssets: boolean): LeadQualification {
  const { leadScoring } = STUDIO_BUSINESS_CONFIG;
  let score = 0;
  const budgetAligned = budget >= leadScoring.budgetThreshold;
  const localProject = new RegExp(leadScoring.preferredZonesRegex, 'i').test(location);

  if (budgetAligned) score += leadScoring.points.budgetAligned;
  if (localProject) score += leadScoring.points.localProject;
  if (input.options.installation) score += leadScoring.points.needsInstallation;
  if (input.layout.asymmetry || input.layout.customLargeModules > 0 || input.options.complexity.cableManagementLevel > 0 || input.options.complexity.hiddenCompartments) score += leadScoring.points.customComplexity;
  if (hasAssets) score += leadScoring.points.inspirationAssets;
  if (input.furnitureType === 'bibliotheque' || input.furnitureType === 'meuble-tv') score += leadScoring.points.coreFurnitureType;

  const projectMaturity: LeadQualification['projectMaturity'] = score >= 70 ? 'elevee' : score >= 45 ? 'moyenne' : 'faible';

  return {
    budgetAligned,
    localProject,
    projectMaturity,
    hasInspirationAssets: hasAssets,
    needsInstallation: input.options.installation,
    score
  };
}
