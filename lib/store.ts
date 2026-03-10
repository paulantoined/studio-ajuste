'use client';

import { create } from 'zustand';
import { ConfiguratorState } from './types';

type WizardStore = {
  step: number;
  state: ConfiguratorState;
  setStep: (step: number) => void;
  patchState: (partial: Partial<ConfiguratorState>) => void;
  patchNested: <K extends keyof ConfiguratorState>(key: K, partial: Partial<ConfiguratorState[K]>) => void;
};

const initialState: ConfiguratorState = {
  furnitureType: 'bibliotheque',
  dimensions: { widthCm: 240, heightCm: 240, depthCm: 35 },
  layout: { columns: 4, rows: 4, openModules: 10, closedModules: 6, asymmetry: false, customLargeModules: 0 },
  material: 'placage-bois',
  finish: 'standard-mat',
  options: {
    led: false,
    doors: 2,
    drawers: 0,
    backPanel: true,
    wallFixings: true,
    installation: true,
    delivery: true,
    complexity: {
      hiddenCompartments: false,
      acousticPanel: false,
      floatingDesign: false,
      metalFrame: false,
      cableManagementLevel: 1
    }
  }
};

export const useWizardStore = create<WizardStore>((set) => ({
  step: 0,
  state: initialState,
  setStep: (step) => set({ step }),
  patchState: (partial) => set((s) => ({ state: { ...s.state, ...partial } })),
  patchNested: (key, partial) =>
    set((s) => ({
      state: {
        ...s.state,
        [key]: { ...(s.state[key] as object), ...(partial as object) }
      }
    }))
}));
