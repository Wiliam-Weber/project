import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient } from '@/types/Patient';

const STORAGE_KEY = '@insuguia_patients';

export class PatientService {
  static async savePatients(patients: Patient[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(patients);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving patients:', e);
      throw e;
    }
  }

  static async loadPatients(): Promise<Patient[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error loading patients:', e);
      return [];
    }
  }

  static async addPatient(patient: Patient): Promise<void> {
    const patients = await this.loadPatients();
    patients.push(patient);
    await this.savePatients(patients);
  }

  static async deletePatient(patientId: string): Promise<void> {
    const patients = await this.loadPatients();
    const filtered = patients.filter((p) => p.id !== patientId);
    await this.savePatients(filtered);
  }

  static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
