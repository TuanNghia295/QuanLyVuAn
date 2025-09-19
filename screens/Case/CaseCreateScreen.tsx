import StageDatePicker from '@/components/DatePicker/StageDatePicker';
import RenderModalDropdown from '@/components/Modal/DropdownModal';
import {COLOR} from '@/constants/color';
import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as yup from 'yup';

// Mock data
const statusOptions = [
  {label: 'Chưa xử lý', value: 'pending'},
  {label: 'Đang xử lý', value: 'processing'},
  {label: 'Đã hoàn thành', value: 'completed'},
  {label: 'Quá hạn', value: 'overdue'},
];

const currentUser = {id: '1', name: 'Nguyen Van A', role: 'admin'};

const officerOptions = [
  {label: 'Nguyen Van A', value: '1'},
  {label: 'Tran Thi B', value: '2'},
  {label: 'Le Van C', value: '3'},
];

const schema = yup.object().shape({
  lawArticle: yup.string().required('Điều luật bắt buộc'),
  content: yup.string().required('Nội dung bắt buộc'),
  decisionDate: yup.string().required('Ngày ra quyết định'),
  endDate: yup.string().required('Ngày hết hạn'),
  officer: yup.string().required('Cán bộ thụ lý'),
  crimeType: yup.string().required('Loại tội phạm'),
  status: yup.string().required('Trạng thái'),
  stages: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Tên giai đoạn'),
      timeline: yup.string().required('Timeline'),
      startTime: yup.string().required('Thời gian bắt đầu'),
      endTime: yup.string().required('Thời gian kết thúc'),
    }),
  ),
});
export default function CaseCreateScreen() {
  const inset = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      lawArticle: '',
      content: '',
      decisionDate: '',
      endDate: '',
      officer: '',
      crimeType: '',
      status: '',
      stages: [{name: '', timeline: '', startTime: '', endTime: ''}],
    },
    resolver: yupResolver(schema),
  });

  const {fields, append, remove} = useFieldArray({control, name: 'stages'});

  const [officerModal, setOfficerModal] = React.useState(false);
  const [statusModal, setStatusModal] = React.useState(false);

  const onSubmit = (data: any) => {
    alert('Đã tạo vụ án!\n' + JSON.stringify(data, null, 2));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Điều luật */}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>Điều luật</Text>
          <Controller
            control={control}
            name="lawArticle"
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.input}
                placeholder="Điều luật"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.lawArticle && <Text style={styles.error}>{errors.lawArticle.message}</Text>}
        </View>

        {/* Nội dung */}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>Nội dung</Text>
          <Controller
            control={control}
            name="content"
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.input}
                placeholder="Nội dung"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.content && <Text style={styles.error}>{errors.content.message}</Text>}
        </View>

        {/* Ngày ra quyết định */}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>Ngày ra quyết định</Text>
          <Controller
            control={control}
            name="decisionDate"
            render={({field: {onChange, value}}) => (
              <StageDatePicker label="Chọn ngày ra quyết định" value={value} onChange={onChange} />
            )}
          />
          {errors.decisionDate && <Text style={styles.error}>{errors.decisionDate.message}</Text>}
        </View>

        {/* Ngày hết hạn */}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>Ngày hết hạn</Text>
          <Controller
            control={control}
            name="endDate"
            render={({field: {onChange, value}}) => (
              <StageDatePicker label="Chọn hế hạn" value={value} onChange={onChange} />
            )}
          />
          {errors.endDate && <Text style={styles.error}>{errors.endDate.message}</Text>}
        </View>

        {/* Cán bộ thụ lý */}
        {currentUser.role === 'admin' ? (
          <View style={styles.fieldBox}>
            <Text style={styles.label}>Cán bộ thụ lý</Text>
            <Controller
              control={control}
              name="officer"
              render={({field: {onChange, value}}) => (
                <RenderModalDropdown
                  label="Cán bộ thụ lý"
                  options={officerOptions}
                  value={value}
                  onChange={onChange}
                  visible={officerModal}
                  setVisible={setOfficerModal}
                />
              )}
            />
          </View>
        ) : (
          <View style={styles.fieldBox}>
            <Text style={styles.label}>Cán bộ thụ lý</Text>
            <TextInput
              style={[styles.input, {backgroundColor: '#f1f5f9'}]}
              value={currentUser.name}
              editable={false}
            />
          </View>
        )}
        {errors.officer && <Text style={styles.error}>{errors.officer.message}</Text>}

        {/* Loại tội phạm */}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>Loại tội phạm</Text>
          <Controller
            control={control}
            name="crimeType"
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.input}
                placeholder="Loại tội phạm"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.crimeType && <Text style={styles.error}>{errors.crimeType.message}</Text>}
        </View>

        {/* Trạng thái vụ án */}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>Trạng thái vụ án</Text>
          <Controller
            control={control}
            name="status"
            render={({field: {onChange, value}}) => (
              <RenderModalDropdown
                label="Trạng thái vụ án"
                options={statusOptions}
                value={value}
                onChange={onChange}
                visible={statusModal}
                setVisible={setStatusModal}
              />
            )}
          />
        </View>
        {errors.status && <Text style={styles.error}>{errors.status.message}</Text>}
      </View>

      {/* Giai đoạn */}
      <Text style={styles.sectionTitle}>Các giai đoạn</Text>
      {fields.map((item, idx) => (
        <View key={item.id} style={styles.stageBox}>
          <Text style={styles.stageLabel}>Giai đoạn {idx + 1}</Text>

          {/* Tên giai đoạn */}
          <Text style={styles.label}>Tên giai đoạn</Text>
          <Controller
            control={control}
            name={`stages.${idx}.name`}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.input}
                placeholder="Tên giai đoạn"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.stages?.[idx]?.name && (
            <Text style={styles.error}>{errors.stages[idx].name.message}</Text>
          )}

          {/* Timeline */}
          <Text style={styles.label}>Timeline</Text>
          <Controller
            control={control}
            name={`stages.${idx}.timeline`}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.input}
                placeholder="Timeline"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.stages?.[idx]?.timeline && (
            <Text style={styles.error}>{errors.stages[idx].timeline.message}</Text>
          )}

          {/* Ngày bắt đầu */}
          <Text style={styles.label}>Ngày bắt đầu</Text>
          <Controller
            control={control}
            name={`stages.${idx}.startTime`}
            render={({field: {onChange, value}}) => (
              <StageDatePicker label="Chọn ngày bắt đầu" value={value} onChange={onChange} />
            )}
          />
          {errors.stages?.[idx]?.startTime && (
            <Text style={styles.error}>{errors.stages[idx].startTime.message}</Text>
          )}

          {/* Ngày kết thúc */}
          <Text style={styles.label}>Ngày kết thúc</Text>
          <Controller
            control={control}
            name={`stages.${idx}.endTime`}
            render={({field: {onChange, value}}) => (
              <StageDatePicker label="Chọn ngày kết thúc" value={value} onChange={onChange} />
            )}
          />
          {errors.stages?.[idx]?.endTime && (
            <Text style={styles.error}>{errors.stages[idx].endTime.message}</Text>
          )}

          <TouchableOpacity style={styles.removeBtn} onPress={() => remove(idx)}>
            <Text style={styles.removeText}>Xóa </Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.addBtn]}
        onPress={() => append({name: '', timeline: '', startTime: '', endTime: ''})}>
        <Text style={styles.addText}>Thêm giai đoạn</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveBtn, {marginBottom: inset.bottom + 16}]}
        onPress={handleSubmit(onSubmit)}>
        <Text style={styles.saveText}>Tạo vụ án</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#f8f9fa'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldBox: {marginBottom: 12},
  label: {fontWeight: 'bold', fontSize: 14, color: '#334155', marginBottom: 4},
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: '#f8fafc',
  },
  error: {color: COLOR.PRIMARY, fontSize: 13, marginTop: 4},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#2563eb', marginLeft: 16, marginTop: 18},
  stageBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  stageLabel: {fontWeight: 'bold', color: '#334155', marginBottom: 6},
  removeBtn: {
    marginTop: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  removeText: {color: COLOR.PRIMARY, fontWeight: 'bold'},
  addBtn: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  addText: {color: '#2563eb', fontWeight: 'bold'},
  saveBtn: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  saveText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});
