import { Patient, PrescriptionResult } from '@/types/Patient';

export class PrescriptionService {
  static generatePrescription(
    patient: Patient,
    currentGlucoseMgDl?: number
  ): PrescriptionResult {
    const TDD = patient.weight * 0.5;
    const basalDose = patient.weight * 0.2;
    const correctionFactor = 1500.0 / TDD;
    const targetGlucose = 140.0;

    let correctionDose = 'Conforme Glicemia (esquema de correção)';

    if (currentGlucoseMgDl !== undefined) {
      const diff = currentGlucoseMgDl - targetGlucose;
      if (diff > 0) {
        const calculatedDose = diff / correctionFactor;
        correctionDose = `${calculatedDose.toFixed(1)} UI (AGORA)`;
      } else {
        correctionDose = 'Nenhuma';
      }
    }

    return {
      basalItem: {
        insulinName: 'Insulina NPH (Basal)',
        dose: `${basalDose.toFixed(1)} UI`,
        route: 'SC',
        schedule: 'Aplicar às 22:00',
      },
      correctionItem: {
        insulinName: 'Insulina Regular (Correção)',
        dose: correctionDose,
        route: 'SC',
        schedule: 'Antes do café, almoço e jantar (AC) e se Glicemia > 140 mg/dL',
      },
      monitoring:
        'Monitorização glicêmica capilar: antes das refeições e à noite (mínimo 4x/dia).',
      hypoglycemia:
        'Hipoglicemia: oferecer 15 g de carboidrato por via oral (se seguro), reavaliar em 15 min; se grave, seguir protocolo institucional.',
    };
  }

  static calculateCorrection(
    patient: Patient,
    currentGlucoseMgDl: number
  ): string {
    const TDD = patient.weight * 0.5;
    const correctionFactor = 1500.0 / TDD;
    const targetGlucose = 140.0;
    const diff = currentGlucoseMgDl - targetGlucose;

    if (diff > 0) {
      const calculatedDose = diff / correctionFactor;
      return `${calculatedDose.toFixed(1)} UI (AGORA)`;
    }
    return 'Nenhuma';
  }
}
