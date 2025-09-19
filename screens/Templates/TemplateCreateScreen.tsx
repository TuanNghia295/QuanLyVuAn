import {COLOR} from '@/constants/color';
import {yupResolver} from '@hookform/resolvers/yup';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import * as Yup from 'yup';

type TemplateForm = {
  name: string;
  summary: string;
  purpose: string;
  methods: string;
  duration: string;
  resources?: string;
  report?: string;
  participants?: string;
};

const schema = Yup.object().shape({
  name: Yup.string().required('Tên mẫu là bắt buộc'),
  summary: Yup.string().required('Tóm tắt vụ án là bắt buộc'),
  purpose: Yup.string().required('Mục đích, yêu cầu là bắt buộc'),
  methods: Yup.string().required('Biện pháp điều tra là bắt buộc'),
  duration: Yup.string().required('Thời gian điều tra là bắt buộc'),
});

const TemplateCreateScreen = () => {
  const [step, setStep] = useState(1);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<TemplateForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      summary: '',
      purpose: '',
      methods: '',
      duration: '',
      resources: '',
      report: '',
      participants: '',
    },
  });

  const onSubmit = (data: TemplateForm) => {
    console.log('Template created:', data);
  };

  // Helper render input
  const renderInput = (label: string, name: keyof TemplateForm, multiline = false) => (
    <View style={{marginBottom: 16}}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={[styles.input, multiline && styles.textarea]}
            placeholder={`Nhập ${label.toLowerCase()}...`}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={multiline}
          />
        )}
      />
      {errors[name] && <Text style={styles.error}>{errors[name]?.message}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mẫu Vụ án (Bước {step}/4)</Text>

      {/* Step 1 */}
      {step === 1 && (
        <>
          {renderInput('Tên mẫu', 'name')}
          {renderInput('Tóm tắt vụ án', 'summary', true)}
        </>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          {renderInput('Mục đích, yêu cầu', 'purpose', true)}
          {renderInput('Biện pháp điều tra', 'methods', true)}
        </>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <>
          {renderInput('Thời gian điều tra', 'duration')}
          {renderInput('Phương tiện, kinh phí', 'resources')}
          {renderInput('Chế độ báo cáo', 'report')}
        </>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <>
          {renderInput('Người tham gia', 'participants')}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitText}>Lưu Template</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Navigation buttons */}
      <View style={styles.navRow}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.navBtn, {backgroundColor: COLOR.GRAY1}]}
            onPress={() => setStep(step - 1)}>
            <Text style={styles.navText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < 4 && (
          <TouchableOpacity
            style={[styles.navBtn, {backgroundColor: COLOR.PRIMARY}]}
            onPress={() => setStep(step + 1)}>
            <Text style={styles.navText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 16},
  label: {fontSize: 14, fontWeight: '600', marginBottom: 6},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  textarea: {height: 100, textAlignVertical: 'top'},
  error: {color: 'red', fontSize: 12, marginTop: 4},
  submitBtn: {
    backgroundColor: COLOR.PRIMARY,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: {color: '#fff', fontWeight: 'bold'},
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  navBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  navText: {color: '#fff', fontWeight: 'bold'},
});

export default TemplateCreateScreen;
