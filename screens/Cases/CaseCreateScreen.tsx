// CaseCreateScreen.v2.tsx
import StaffSelectModal from '@/components/Modal/StaffSelectModal';
import {COLOR} from '@/constants/color';
import {useCreateCase} from '@/hooks/useCase';
import {useGetTemplateById} from '@/hooks/useTemPlates';
import {router, useLocalSearchParams} from 'expo-router';
import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// --- Interfaces (mở rộng) ---
type FieldType = 'text' | 'textarea' | 'date' | 'number' | 'select';

interface Field {
  id: string;
  fieldName: string;
  fieldLabel: string;
  description?: string | null;
  fieldType: FieldType;
  isRequired: boolean;
  placeholder?: string | null;
  options?: {label: string; value: string}[]; // cho select
  defaultValue?: any;
}

interface Group {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
}

interface Template {
  id: string;
  title: string;
  description?: string;
  groups: Group[];
}

const CaseCreateScreenV2 = () => {
  const inset = useSafeAreaInsets();
  const {caseId} = useLocalSearchParams();
  const id = Array.isArray(caseId) ? caseId[0] : caseId;

  // debug logs để tìm nguyên nhân group không hiển thị
  // (giữ lại khi debug, xóa khi production)

  console.log('route caseId:', caseId, 'id used:', id);

  const {
    data: templateRaw,
    isLoading: isTemplateLoading,
    error: templateError,
  } = useGetTemplateById(id) as {data?: Template | any; isLoading: boolean; error?: any};

  // nếu hook trả về wrapper {data: { data: Template }} handle cả 2 trường hợp:
  const template: Template | undefined = useMemo(() => {
    if (!templateRaw) return undefined;
    // nếu templateRaw.data tồn tại, dùng nó
    if (templateRaw?.data && typeof templateRaw.data === 'object' && templateRaw.data.groups) {
      return templateRaw.data as Template;
    }
    // nếu templateRaw trực tiếp có groups
    if (templateRaw.groups) {
      return templateRaw as Template;
    }
    // otherwise return undefined
    return undefined;
  }, [templateRaw]);

  // debug shape

  console.log('template resolved:', template);

  console.log('groups type:', typeof template?.groups, 'groups len:', template?.groups?.length);

  // basic form
  const [basicForm, setBasicForm] = useState({
    title: '',
    soBiCan: '',
    applicableLaw: '',
    crimeType: '',
    moTa: '',
  });

  // staff modal
  const [officerModal, setOfficerModal] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<{id: string; fullName: string} | null>(
    null,
  );

  // dynamic fields state keyed by field.id
  const [dynamicFields, setDynamicFields] = useState<{[fieldId: string]: any}>({});

  // date picker state
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDateFieldId, setSelectedDateFieldId] = useState<string | null>(null);

  // select modal
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [selectOptions, setSelectOptions] = useState<{label: string; value: string}[]>([]);
  const [selectFieldId, setSelectFieldId] = useState<string | null>(null);

  const {mutate: createCase, isPending: isCreating} = useCreateCase();

  // init dynamicFields from template defaults when template loaded
  useEffect(() => {
    if (!template) return;
    const initial: {[k: string]: any} = {};
    template.groups.forEach(group => {
      group.fields.forEach(field => {
        if (field.defaultValue !== undefined && field.defaultValue !== null) {
          // nếu defaultValue là date string, convert về Date
          if (field.fieldType === 'date') {
            initial[field.id] = new Date(field.defaultValue);
          } else {
            initial[field.id] = field.defaultValue;
          }
        } else {
          initial[field.id] = '';
        }
      });
    });
    setDynamicFields(initial);
  }, [template]);

  const handleBasicChange = (k: keyof typeof basicForm, v: string) =>
    setBasicForm(prev => ({...prev, [k]: v}));

  const handleDynamicFieldChange = (fieldId: string, value: any) =>
    setDynamicFields(prev => ({...prev, [fieldId]: value}));

  const handleSelectOfficer = (staff: any) => {
    setSelectedOfficer(staff);
    setOfficerModal(false);
  };

  // Validation
  const validateForm = (): {ok: boolean; message?: string} => {
    if (!basicForm.title || basicForm.title.trim() === '') {
      return {ok: false, message: 'Vui lòng nhập tên vụ án'};
    }
    if (!selectedOfficer) {
      return {ok: false, message: 'Vui lòng chọn cán bộ thụ lý'};
    }
    // dynamic required
    for (const group of template?.groups || []) {
      for (const field of group.fields) {
        if (field.isRequired) {
          const val = dynamicFields[field.id];
          if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
            return {ok: false, message: `Vui lòng nhập ${field.fieldLabel}`};
          }
        }
      }
    }
    return {ok: true};
  };

  // map dynamic fields -> payload compatible
  const mapDynamicFields = () =>
    (template?.groups || []).flatMap(group =>
      group.fields.map(field => {
        const raw = dynamicFields[field.id];
        let value: string | undefined;
        if (raw === undefined || raw === null || raw === '') {
          value = undefined;
        } else if (field.fieldType === 'date' && raw instanceof Date) {
          value = raw.toISOString();
        } else {
          value = String(raw);
        }
        return {
          groupId: group.id,
          fieldLabel: field.fieldLabel,
          fieldName: field.fieldName,
          fieldType: field.fieldType,
          isEdit: false,
          isRequired: field.isRequired,
          placeholder: field.placeholder ?? '',
          defaultValue: field.defaultValue ?? '',
          description: field.description ?? '',
          value,
        };
      }),
    );

  const handleSubmit = () => {
    const v = validateForm();
    if (!v.ok) {
      Alert.alert('Lỗi', v.message || 'Vui lòng kiểm tra lại thông tin');
      return;
    }
    const payload = {
      name: basicForm.title,
      templateId: template?.id || '',
      applicableLaw: basicForm.applicableLaw || 'Điều 1, Luật Hình sự',
      numberOfDefendants: basicForm.soBiCan || '0',
      crimeType: basicForm.crimeType || 'Tội phạm hình sự',
      description: basicForm.moTa || '',
      status: 'PENDING',
      userId: selectedOfficer?.id || '',
      fields: mapDynamicFields(),
    };

    console.log('📦 Data gửi lên', JSON.stringify(payload, null, 2));

    createCase(payload, {
      onSuccess: () => {
        Alert.alert('Thành công', 'Tạo vụ án thành công');
        // reset form nếu muốn tạo tiếp
        setBasicForm({title: '', soBiCan: '', applicableLaw: '', crimeType: '', moTa: ''});
        setDynamicFields({});
        setSelectedOfficer(null);
        router.back(); // hoặc có thể giữ lại và clear
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || 'Có lỗi khi tạo vụ án';
        Alert.alert('Lỗi', msg);
      },
    });
  };

  // UI helpers
  if (isTemplateLoading) {
    return (
      <View style={[styles.center, {flex: 1}]}>
        <ActivityIndicator size="large" />
        <Text style={{marginTop: 12}}>Đang tải mẫu vụ án...</Text>
      </View>
    );
  }

  if (!template) {
    return (
      <View style={[styles.center, {flex: 1, padding: 16}]}>
        <Text>Không tìm thấy mẫu vụ án. Kiểm tra lại id hoặc logs.</Text>
        <Text style={{marginTop: 8, color: '#666'}}>Xem console logs để debug.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
      <ScrollView contentContainerStyle={[styles.container, {paddingBottom: inset.bottom + 24}]}>
        <Text style={styles.sectionTitle}>{template.title}</Text>
        {template.description ? (
          <Text style={styles.sectionDesc}>{template.description}</Text>
        ) : null}

        {/* Basic fields */}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>
            Tên vụ án <Text style={{color: 'red'}}>*</Text>
          </Text>
          <TextInput
            value={basicForm.title}
            onChangeText={t => handleBasicChange('title', t)}
            placeholder="Nhập tên vụ án"
            placeholderTextColor={COLOR.GRAY4}
            style={styles.input}
          />
        </View>

        {/* other basic */}
        <View style={styles.twoCols}>
          <View style={{flex: 1, marginRight: 8}}>
            <Text style={styles.label}>Số bị can</Text>
            <TextInput
              value={basicForm.soBiCan}
              onChangeText={t => handleBasicChange('soBiCan', t)}
              placeholder="Nhập số"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor={COLOR.GRAY4}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.label}>Loại tội</Text>
            <TextInput
              value={basicForm.crimeType}
              onChangeText={t => handleBasicChange('crimeType', t)}
              placeholder="Nhập loại tội"
              style={styles.input}
              placeholderTextColor={COLOR.GRAY4}
            />
          </View>
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Điều luật</Text>
          <TextInput
            value={basicForm.applicableLaw}
            onChangeText={t => handleBasicChange('applicableLaw', t)}
            placeholder="Nhập điều luật"
            style={styles.input}
            placeholderTextColor={COLOR.GRAY4}
          />
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Mô tả</Text>
          <TextInput
            value={basicForm.moTa}
            onChangeText={t => handleBasicChange('moTa', t)}
            placeholder="Mô tả vụ án"
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholderTextColor={COLOR.GRAY4}
          />
        </View>

        {/* Officer */}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>Cán bộ thụ lý</Text>
          <TouchableOpacity onPress={() => setOfficerModal(true)}>
            <TextInput
              value={selectedOfficer ? selectedOfficer.fullName : ''}
              placeholder="Chọn cán bộ"
              editable={false}
              pointerEvents="none"
              style={styles.input}
              placeholderTextColor={COLOR.GRAY4}
            />
          </TouchableOpacity>
          <StaffSelectModal
            visible={officerModal}
            onClose={() => setOfficerModal(false)}
            onSelect={handleSelectOfficer}
          />
        </View>

        {/* Dynamic groups */}
        {template.groups.map(group => (
          <View key={group.id} style={styles.groupBox}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.description ? <Text style={styles.groupDesc}>{group.description}</Text> : null}

            {group.fields.map(field => {
              const value = dynamicFields[field.id];
              return (
                <View key={field.id} style={styles.fieldBox}>
                  <Text style={styles.label}>
                    {field.fieldLabel} {field.isRequired && <Text style={{color: 'red'}}>*</Text>}
                  </Text>

                  {field.fieldType === 'date' ? (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedDateFieldId(field.id);
                          setDatePickerVisible(true);
                        }}>
                        <TextInput
                          style={styles.input}
                          value={value ? moment(value).format('DD/MM/YYYY') : ''}
                          placeholder={field.placeholder || `Chọn ${field.fieldLabel}`}
                          editable={false}
                          placeholderTextColor={COLOR.GRAY4}
                        />
                      </TouchableOpacity>
                    </>
                  ) : field.fieldType === 'select' ? (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectOptions(field.options ?? []);
                          setSelectFieldId(field.id);
                          setSelectModalVisible(true);
                        }}>
                        <TextInput
                          style={styles.input}
                          value={
                            value
                              ? (field.options ?? []).find(o => o.value === value)?.label ?? value
                              : ''
                          }
                          placeholder={field.placeholder || `Chọn ${field.fieldLabel}`}
                          editable={false}
                          placeholderTextColor={COLOR.GRAY4}
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TextInput
                      style={[styles.input, field.fieldType === 'textarea' ? styles.textArea : {}]}
                      placeholder={field.placeholder || `Nhập ${field.fieldLabel}`}
                      value={value ?? ''}
                      onChangeText={t =>
                        handleDynamicFieldChange(
                          field.id,
                          field.fieldType === 'number' ? t.replace(/[^0-9]/g, '') : t,
                        )
                      }
                      keyboardType={field.fieldType === 'number' ? 'numeric' : 'default'}
                      multiline={field.fieldType === 'textarea'}
                      numberOfLines={field.fieldType === 'textarea' ? 4 : 1}
                      placeholderTextColor={COLOR.GRAY4}
                    />
                  )}
                </View>
              );
            })}
          </View>
        ))}

        {/* Save button */}
        <TouchableOpacity
          disabled={isCreating}
          onPress={handleSubmit}
          style={[
            styles.saveBtn,
            isCreating ? {opacity: 0.7} : {},
            {marginBottom: inset.bottom ? inset.bottom : 24},
          ]}>
          {isCreating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Tạo vụ án</Text>
          )}
        </TouchableOpacity>

        {/* Date Picker */}
        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          date={
            selectedDateFieldId && dynamicFields[selectedDateFieldId]
              ? new Date(dynamicFields[selectedDateFieldId])
              : new Date()
          }
          onConfirm={d => {
            setDatePickerVisible(false);
            if (selectedDateFieldId) {
              handleDynamicFieldChange(selectedDateFieldId, d);
            }
          }}
          onCancel={() => setDatePickerVisible(false)}
        />

        {/* Select Modal */}
        <Modal visible={selectModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>Chọn</Text>
              <FlatList
                data={selectOptions}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (selectFieldId) handleDynamicFieldChange(selectFieldId, item.value);
                      setSelectModalVisible(false);
                    }}
                    style={{paddingVertical: 12}}>
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: '#eee'}} />}
              />
              <TouchableOpacity
                style={{marginTop: 12}}
                onPress={() => setSelectModalVisible(false)}>
                <Text style={{color: '#2563eb', textAlign: 'center'}}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#f8f9fa', padding: 16},
  center: {alignItems: 'center', justifyContent: 'center'},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', color: '#2563eb', marginBottom: 4},
  sectionDesc: {fontSize: 14, color: '#64748b', marginBottom: 16},
  fieldBox: {marginBottom: 12},
  twoCols: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  label: {fontWeight: 'bold', fontSize: 14, color: '#334155', marginBottom: 6},
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#334155',
  },
  groupBox: {backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 16},
  groupTitle: {fontSize: 16, fontWeight: '700', color: '#1e40af', marginBottom: 8},
  groupDesc: {fontSize: 13, color: '#64748b', marginBottom: 8},
  saveBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveText: {color: '#fff', fontWeight: '700', fontSize: 16},
  textArea: {minHeight: 100, textAlignVertical: 'top'},
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end'},
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '60%',
  },
});

export default CaseCreateScreenV2;
