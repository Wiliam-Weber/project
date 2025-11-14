export interface Patient {
  id: string;
  name: string;
  age: number;
  weight: number;
  gender: string;
  height?: number;
  creatinine?: number;
  admissionLocation?: string;
}

export interface PrescriptionItem {
  insulinName: string;
  dose: string;
  route: string;
  schedule: string;
}

export interface PrescriptionResult {
  basalItem: PrescriptionItem;
  correctionItem: PrescriptionItem;
  monitoring: string;
  hypoglycemia: string;
}

export interface GlucoseRecord {
  id: string;
  glucose: number;
  timestamp: Date;
  correctionSuggestion: string;
}
