import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, Trash2, Activity } from 'lucide-react-native';
import { PatientService } from '@/services/PatientService';
import { PrescriptionService } from '@/services/PrescriptionService';
import { Patient, GlucoseRecord } from '@/types/Patient';

export default function MonitoringScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [glucose, setGlucose] = useState('');
  const [records, setRecords] = useState<GlucoseRecord[]>([]);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      const patients = await PatientService.loadPatients();
      const foundPatient = patients.find((p) => p.id === id);
      if (foundPatient) {
        setPatient(foundPatient);
      }
    } catch (error) {
      console.error('Error loading patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = () => {
    if (!glucose.trim() || isNaN(Number(glucose)) || !patient) {
      return;
    }

    const glucoseValue = Number(glucose);
    const correctionSuggestion = PrescriptionService.calculateCorrection(
      patient,
      glucoseValue
    );

    const newRecord: GlucoseRecord = {
      id: `${Date.now()}-${Math.random()}`,
      glucose: glucoseValue,
      timestamp: new Date(),
      correctionSuggestion,
    };

    setRecords([newRecord, ...records]);
    setGlucose('');
  };

  const handleClearHistory = () => {
    setRecords([]);
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (!patient) {
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
          <Text style={styles.headerTitle}>Acompanhamento</Text>
          <Text style={styles.headerSubtitle}>{patient.name}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Activity size={24} color="#1976D2" />
            <Text style={styles.cardTitle}>Registrar Glicemia</Text>
          </View>

          <Text style={styles.label}>Glicemia (mg/dL)</Text>
          <TextInput
            style={styles.input}
            value={glucose}
            onChangeText={setGlucose}
            placeholder="Digite o valor da glicemia"
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddRecord}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {records.length > 0 && (
          <>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Histórico de Registros</Text>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearHistory}>
                <Trash2 size={18} color="#D32F2F" />
                <Text style={styles.clearButtonText}>Limpar histórico</Text>
              </TouchableOpacity>
            </View>

            {records.map((record) => (
              <View key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordGlucose}>{record.glucose} mg/dL</Text>
                  <Text style={styles.recordDate}>
                    {formatDateTime(record.timestamp)}
                  </Text>
                </View>
                <View style={styles.suggestionContainer}>
                  <Text style={styles.suggestionLabel}>Sugestão de correção:</Text>
                  <Text style={styles.suggestionValue}>
                    {record.correctionSuggestion}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {records.length === 0 && (
          <View style={styles.emptyState}>
            <Activity size={48} color="#BDBDBD" />
            <Text style={styles.emptyStateText}>
              Nenhum registro ainda. Adicione uma medição acima.
            </Text>
          </View>
        )}
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#D32F2F',
    marginLeft: 4,
    fontWeight: '600',
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordGlucose: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1976D2',
  },
  recordDate: {
    fontSize: 12,
    color: '#757575',
  },
  suggestionContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
  },
  suggestionLabel: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 4,
  },
  suggestionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
  },
});
