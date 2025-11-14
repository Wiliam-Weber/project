import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Syringe,
  Activity,
  AlertTriangle,
  ClipboardList,
  LogOut,
} from 'lucide-react-native';
import { PatientService } from '@/services/PatientService';
import { PrescriptionService } from '@/services/PrescriptionService';
import { Patient, PrescriptionResult } from '@/types/Patient';

export default function PrescriptionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [prescription, setPrescription] = useState<PrescriptionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientAndPrescription();
  }, [id]);

  const loadPatientAndPrescription = async () => {
    try {
      const patients = await PatientService.loadPatients();
      const foundPatient = patients.find((p) => p.id === id);
      if (foundPatient) {
        setPatient(foundPatient);
        const result = PrescriptionService.generatePrescription(foundPatient);
        setPrescription(result);
      }
    } catch (error) {
      console.error('Error loading prescription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDischarge = () => {
    Alert.alert(
      'Dar Alta ao Paciente',
      `Tem certeza que deseja dar alta a ${patient?.name}?\n\nEsta ação não pode ser desfeita.`,
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Dar Alta',
          onPress: async () => {
            try {
              await PatientService.deletePatient(patient!.id);
              Alert.alert('Sucesso', `${patient?.name} recebeu alta com sucesso!`, [
                {
                  text: 'OK',
                  onPress: () => {
                    router.back();
                  },
                },
              ]);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível dar alta ao paciente');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (!patient || !prescription) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Paciente não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Prescrição</Text>
          <Text style={styles.headerSubtitle}>{patient.name}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ClipboardList size={24} color="#1976D2" />
            <Text style={styles.cardTitle}>Plano Terapêutico</Text>
          </View>

          <View style={styles.prescriptionItem}>
            <View style={styles.itemHeader}>
              <Syringe size={20} color="#1976D2" />
              <Text style={styles.insulinName}>{prescription.basalItem.insulinName}</Text>
            </View>
            <Text style={styles.itemDetail}>Dose: {prescription.basalItem.dose}</Text>
            <Text style={styles.itemDetail}>Via: {prescription.basalItem.route}</Text>
            <Text style={styles.itemDetail}>
              Horário: {prescription.basalItem.schedule}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.prescriptionItem}>
            <View style={styles.itemHeader}>
              <Syringe size={20} color="#1976D2" />
              <Text style={styles.insulinName}>
                {prescription.correctionItem.insulinName}
              </Text>
            </View>
            <Text style={styles.itemDetail}>
              Dose: {prescription.correctionItem.dose}
            </Text>
            <Text style={styles.itemDetail}>
              Via: {prescription.correctionItem.route}
            </Text>
            <Text style={styles.itemDetail}>
              Horário: {prescription.correctionItem.schedule}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Activity size={24} color="#1976D2" />
            <Text style={styles.cardTitle}>Orientações Adicionais</Text>
          </View>

          <View style={styles.orientationItem}>
            <View style={styles.itemHeader}>
              <Activity size={20} color="#2E7D32" />
              <Text style={styles.orientationTitle}>Monitorização</Text>
            </View>
            <Text style={styles.orientationText}>{prescription.monitoring}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.orientationItem}>
            <View style={styles.itemHeader}>
              <AlertTriangle size={20} color="#D32F2F" />
              <Text style={styles.orientationTitle}>Conduta para Hipoglicemia</Text>
            </View>
            <Text style={styles.orientationText}>{prescription.hypoglycemia}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.monitoringButton}
          onPress={() => router.push(`/(tabs)/monitoring/${patient.id}`)}>
          <Text style={styles.monitoringButtonText}>
            Acompanhamento diário (simulado)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dischargeButton}
          onPress={handleDischarge}>
          <LogOut size={20} color="#FFFFFF" />
          <Text style={styles.dischargeButtonText}>Dar Alta ao Paciente</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Observação: Protótipo acadêmico sem validade clínica.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 12,
  },
  prescriptionItem: {
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insulinName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 8,
  },
  itemDetail: {
    fontSize: 14,
    color: '#616161',
    marginLeft: 28,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  orientationItem: {
    marginBottom: 16,
  },
  orientationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 8,
  },
  orientationText: {
    fontSize: 14,
    color: '#616161',
    marginLeft: 28,
    marginTop: 8,
    lineHeight: 20,
  },
  monitoringButton: {
    backgroundColor: '#1976D2',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  monitoringButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dischargeButton: {
    backgroundColor: '#D32F2F',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dischargeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
  },
});
