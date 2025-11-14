import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { PatientService } from '@/services/PatientService';
import { Patient } from '@/types/Patient';

export default function PatientFormScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [gender, setGender] = useState('');
  const [admissionLocation, setAdmissionLocation] = useState('');

  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const genderOptions = ['Masculino', 'Feminino', 'Outro'];
  const locationOptions = ['Enfermaria', 'UTI', 'Outros'];

  const validate = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return false;
    }
    if (!age.trim() || isNaN(Number(age))) {
      Alert.alert('Erro', 'A idade é obrigatória e deve ser um número');
      return false;
    }
    if (!weight.trim() || isNaN(Number(weight))) {
      Alert.alert('Erro', 'O peso é obrigatório e deve ser um número');
      return false;
    }
    if (!gender) {
      Alert.alert('Erro', 'O sexo é obrigatório');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const patient: Patient = {
      id: PatientService.generateId(),
      name: name.trim(),
      age: Number(age),
      weight: Number(weight),
      gender,
      height: height ? Number(height) : undefined,
      creatinine: creatinine ? Number(creatinine) : undefined,
      admissionLocation: admissionLocation || undefined,
    };

    try {
      await PatientService.addPatient(patient);
      Alert.alert('Sucesso', 'Paciente salvo com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o paciente');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Paciente</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite o nome do paciente"
          />

          <Text style={styles.label}>Idade *</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Digite a idade"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Peso (kg) *</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Digite o peso"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="Digite a altura (opcional)"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Creatinina (mg/dL)</Text>
          <TextInput
            style={styles.input}
            value={creatinine}
            onChangeText={setCreatinine}
            placeholder="Digite a creatinina (opcional)"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Sexo *</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowGenderPicker(!showGenderPicker)}>
            <Text style={gender ? styles.dropdownText : styles.dropdownPlaceholder}>
              {gender || 'Selecione o sexo'}
            </Text>
          </TouchableOpacity>
          {showGenderPicker && (
            <View style={styles.pickerContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.pickerOption}
                  onPress={() => {
                    setGender(option);
                    setShowGenderPicker(false);
                  }}>
                  <Text style={styles.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Local de internação</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowLocationPicker(!showLocationPicker)}>
            <Text
              style={
                admissionLocation ? styles.dropdownText : styles.dropdownPlaceholder
              }>
              {admissionLocation || 'Selecione o local'}
            </Text>
          </TouchableOpacity>
          {showLocationPicker && (
            <View style={styles.pickerContainer}>
              {locationOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.pickerOption}
                  onPress={() => {
                    setAdmissionLocation(option);
                    setShowLocationPicker(false);
                  }}>
                  <Text style={styles.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Paciente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  dropdownText: {
    fontSize: 16,
    color: '#212121',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#212121',
  },
  saveButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
