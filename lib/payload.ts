import { z } from 'zod';
import { calculateEstimate } from './pricing';
import { scoreLead } from './qualification';
import { AutomationPayload, ConfiguratorState } from './types';

export const leadFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  location: z.string().min(2),
  desiredTimeline: z.string().min(2),
  budget: z.coerce.number().min(500),
  stage: z.string().min(2),
  comments: z.string().optional(),
  hasAssets: z.boolean(),
  consent: z.literal(true)
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export function buildAutomationPayload(state: ConfiguratorState, lead: LeadFormValues): AutomationPayload {
  const estimate = calculateEstimate(state);
  const qualification = scoreLead(state, lead.budget, lead.location, lead.hasAssets);

  return {
    webhookVersion: 'v1',
    route: 'new-lead',
    tags: [state.furnitureType, qualification.projectMaturity, state.material],
    quoteRequest: {
      leadId: crypto.randomUUID(),
      date: new Date().toISOString(),
      source: 'configurateur-web',
      furnitureType: state.furnitureType,
      dimensions: state.dimensions,
      layout: state.layout,
      options: {
        led: state.options.led,
        doors: state.options.doors,
        drawers: state.options.drawers,
        backPanel: state.options.backPanel,
        wallFixings: state.options.wallFixings,
        complexity: state.options.complexity
      },
      material: state.material,
      finish: state.finish,
      customerBudget: lead.budget,
      location: lead.location,
      desiredTimeline: lead.desiredTimeline,
      needInstallation: state.options.installation,
      projectStage: lead.stage,
      comments: lead.comments,
      contact: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        consent: lead.consent
      },
      estimate,
      qualification
    }
  };
}
