import { ConfiguratorState, LeadQualification } from './types';

export function scoreLead(input: ConfiguratorState, budget: number, location: string, hasAssets: boolean): LeadQualification {
  let score = 0;
  const budgetAligned = budget >= 2500;
  const localProject = /(paris|idf|ile-de-france|hauts-de-seine|yvelines)/i.test(location);

  if (budgetAligned) score += 25;
  if (localProject) score += 20;
  if (input.options.installation) score += 15;
  if (input.layout.asymmetry || input.layout.customLargeModules > 0) score += 15;
  if (hasAssets) score += 10;
  if (input.furnitureType === 'bibliotheque' || input.furnitureType === 'meuble-tv') score += 15;

  const projectMaturity: LeadQualification['projectMaturity'] =
    score >= 70 ? 'elevee' : score >= 45 ? 'moyenne' : 'faible';

  return {
    budgetAligned,
    localProject,
    projectMaturity,
    hasInspirationAssets: hasAssets,
    needsInstallation: input.options.installation,
    score
  };
}
