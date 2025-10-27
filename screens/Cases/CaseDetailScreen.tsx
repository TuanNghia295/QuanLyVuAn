import RowComponent from '@/components/rowComponent';
import TextComponent from '@/components/textComponent';
import {useCaseDetail, usePlanCase, useUpdateCase} from '@/hooks/useCase';
import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams} from 'expo-router';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Map status từ API
const STATUS_MAP = {
  PENDING: 'Chờ xử lý',
  IN_PROGRESS: 'Đang xử lý',
  ON_HOLD: 'Tạm hoãn',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
};

// Reverse map để convert từ tiếng Việt về API status
const REVERSE_STATUS_MAP = {
  'Chờ xử lý': 'PENDING',
  'Đang xử lý': 'IN_PROGRESS',
  'Tạm hoãn': 'ON_HOLD',
  'Hoàn tất': 'COMPLETED',
  'Đã hủy': 'CANCELLED',
};

const currentUser = {id: '7a7c50eb-bb00-4bf3-bbad-88515b8302c6', role: 'admin'};

// Hàm format date từ ISO string
const formatDate = (isoDate: string) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Hàm convert date từ dd/mm/yyyy sang ISO string
const parseDate = (dateStr: string) => {
  if (!dateStr) return new Date().toISOString();
  const parts = dateStr.split('/');
  if (parts.length !== 3) return new Date().toISOString();
  const [day, month, year] = parts;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
};

// Hàm transform API data sang format cũ
const transformApiData = (apiData: any, planCaseData?: any) => {
  if (!apiData) return null;

  return {
    id: apiData.id,
    code: apiData.code || (apiData.id ? apiData.id.slice(0, 8).toUpperCase() : ''),
    name: apiData.name || '',
    type: apiData.template?.title || '',
    decisionDate: apiData.startDate ? formatDate(apiData.startDate) : '',
    endDate: apiData.endDate ? formatDate(apiData.endDate) : '',
    officer: apiData.assignee
      ? {id: apiData.assignee.id, name: apiData.assignee.fullName}
      : {id: '', name: ''},
    status: STATUS_MAP[apiData.status as keyof typeof STATUS_MAP] || apiData.status || '',
    applicableLaw: apiData.applicableLaw || '',
    numberOfDefendants: apiData.numberOfDefendants || '',
    crimeType: apiData.crimeType || '',
    description: apiData.description || '',
    order: apiData.order || '',
    isCompleted: apiData.isCompleted ?? apiData.status === 'COMPLETED',
    groups: apiData.groups || apiData.template?.groups || [],
    stages: Array.isArray(apiData.phases)
      ? apiData.phases.map((phase: any) => ({
          name: phase.name,
          info: phase.description,
          start: phase.startDate ? formatDate(phase.startDate) : '',
          end: phase.endDate ? formatDate(phase.endDate) : '',
          completed: !!phase.isCompleted,
          note: phase.note,
          order: phase.order,
          tasks: phase.tasks,
        }))
      : [],
    template: apiData.template || null,
    planCase: planCaseData || null,
  };
};

const CaseDetailScreen = () => {
  const {id} = useLocalSearchParams<{id?: string}>();
  const [editMode, setEditMode] = useState(false);
  const {data: planCaseData} = usePlanCase(id || '');
  const {data: apiCaseDetail, isLoading} = useCaseDetail(id ? {id} : undefined);
  const {mutate: onUpdateCase, isPending} = useUpdateCase();
  useEffect(() => {
    if (apiCaseDetail) {
      console.log('🧾 Case detail raw:', JSON.stringify(apiCaseDetail, null, 2));
    }
  }, [apiCaseDetail]);
  // Transform API data
  const transformedData = useMemo(() => {
    return transformApiData(apiCaseDetail, planCaseData);
  }, [apiCaseDetail, planCaseData]);

  // Always non-null after loading
  const [caseData, setCaseData] = useState(transformedData!);
  const [edited, setEdited] = useState(transformedData!);
  // State cho DateTimePickerModal
  const [datePickerVisible, setDatePickerVisible] = useState<null | 'decisionDate' | 'endDate'>(
    null,
  );

  // Update khi API data thay đổi
  useEffect(() => {
    if (transformedData) {
      setCaseData(transformedData);
      setEdited(transformedData);
    }
  }, [transformedData]);

  // Cập nhật trạng thái vụ án (admin có thể chỉnh trực tiếp)
  const handleUpdateStatus = (newStatus: string) => {
    if (!id) return;

    // Chuyển đổi status sang API format
    const apiStatus = REVERSE_STATUS_MAP[newStatus as keyof typeof REVERSE_STATUS_MAP] || 'PENDING';
    const isCompleted = apiStatus === 'COMPLETED';

    // Tạo payload để update
    const updatePayload = {
      name: caseData.name,
      description: caseData.description || '',
      order: caseData.order || '',
      startDate: parseDate(caseData.decisionDate),
      endDate: parseDate(caseData.endDate),
      isCompleted: isCompleted,
      tasks: [], // Có thể thêm tasks nếu cần
    };

    // Gọi API update
    onUpdateCase(
      {id, body: updatePayload},
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Cập nhật trạng thái vụ án thành công');
          setCaseData(prev => ({...prev, status: newStatus, isCompleted}));
        },
        onError: () => {
          Alert.alert('Lỗi', 'Không thể cập nhật trạng thái vụ án');
        },
      },
    );
  };

  // Xác nhận hoàn tất giai đoạn
  const handleCompleteStage = (idx: number) => {
    const newStages = caseData.stages.map((s: any, i: number) =>
      i === idx ? {...s, completed: true} : s,
    );
    const nextStageIdx = newStages.findIndex((s: any) => !s.completed);
    let newStatus = 'Hoàn tất';
    if (nextStageIdx !== -1) newStatus = newStages[nextStageIdx].name;
    if (!caseData.planCase.filled || newStages.some((s: any) => !s.completed))
      newStatus = 'Chưa đủ thông tin';

    setCaseData(prev => ({...prev, stages: newStages, status: newStatus}));

    // Nếu hoàn tất tất cả giai đoạn, update status lên API
    if (newStatus === 'Hoàn tất') {
      handleUpdateStatus('Hoàn tất');
    }
  };

  // Lưu chỉnh sửa vụ án
  const handleSaveEdit = () => {
    if (!id) return;

    // Tạo payload để update
    const updatePayload = {
      name: edited.name,
      description: edited.description || '',
      order: edited.order || '',
      startDate: parseDate(edited.decisionDate),
      endDate: parseDate(edited.endDate),
      isCompleted: edited.isCompleted || false,
      tasks: [],
    };

    // Gọi API update
    onUpdateCase(
      {id, body: updatePayload},
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Cập nhật thông tin vụ án thành công');
          setCaseData(edited);
          setEditMode(false);
        },
        onError: error => {
          Alert.alert('Lỗi', 'Không thể cập nhật thông tin vụ án');
          console.error('Update error:', error);
        },
      },
    );
  };

  // Quyền chỉnh sửa
  const canEdit = currentUser.role === 'admin' || currentUser.id === caseData?.officer?.id;

  // Kiểm tra cảnh báo thiếu thông tin
  const showWarning = caseData?.status === 'Chưa đủ thông tin';

  // Loading state
  if (isLoading || !caseData) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{marginTop: 12, color: '#64748b'}}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#f8fafc'}} contentContainerStyle={{padding: 16}}>
      {showWarning && (
        <View style={styles.warningBox}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.warningText}>
            Vụ án chưa đủ thông tin hoặc chưa hoàn tất các giai đoạn/kế hoạch!
          </Text>
        </View>
      )}

      {/* Thông tin vụ án */}
      {editMode ? (
        <View style={styles.card}>
          <Text style={styles.editTitle}>Chỉnh sửa thông tin vụ án</Text>

          {/* Trạng thái vụ án */}
          <Text style={styles.inputLabel}>Trạng thái</Text>
          <RowComponent wrap="wrap" styles={{gap: 8}}>
            {Object.values(STATUS_MAP).map(st => (
              <TouchableOpacity
                key={st}
                style={{
                  backgroundColor: edited.status === st ? '#2563eb' : '#e0e7ff',
                  borderRadius: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                }}
                onPress={() => setEdited(e => ({...e!, status: st}))}
                disabled={isPending}>
                <Text
                  style={{
                    color: edited.status === st ? '#fff' : '#2563eb',
                    fontWeight: 'bold',
                    fontSize: 13,
                  }}>
                  {st}
                </Text>
              </TouchableOpacity>
            ))}
          </RowComponent>

          {/* Các trường cơ bản */}
          <Text style={styles.inputLabel}>Tên vụ án *</Text>
          <TextInput
            style={styles.input}
            value={edited.name}
            onChangeText={v => setEdited(e => ({...e!, name: v}))}
            placeholder="Nhập tên vụ án"
          />

          <Text style={styles.inputLabel}>Mô tả</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={edited.description}
            onChangeText={v => setEdited(e => ({...e!, description: v}))}
            placeholder="Nhập mô tả vụ án"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.inputLabel}>Điều luật</Text>
          <TextInput
            style={styles.input}
            value={edited.applicableLaw}
            onChangeText={v => setEdited(e => ({...e!, applicableLaw: v}))}
            placeholder="Nhập điều luật"
          />

          <Text style={styles.inputLabel}>Số bị cáo</Text>
          <TextInput
            style={styles.input}
            value={edited.numberOfDefendants}
            onChangeText={v => setEdited(e => ({...e!, numberOfDefendants: v}))}
            placeholder="Nhập số bị cáo"
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>Loại tội phạm</Text>
          <TextInput
            style={styles.input}
            value={edited.crimeType}
            onChangeText={v => setEdited(e => ({...e!, crimeType: v}))}
            placeholder="Nhập loại tội phạm"
          />

          {/* Ngày bắt đầu/kết thúc */}
          <Text style={styles.inputLabel}>Ngày bắt đầu (dd/mm/yyyy)</Text>
          <TouchableOpacity
            onPress={() => setDatePickerVisible('decisionDate')}
            activeOpacity={0.7}>
            <View pointerEvents="none">
              <TextInput
                style={styles.input}
                value={edited.decisionDate}
                editable={false}
                placeholder="01/01/2024"
              />
            </View>
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Ngày kết thúc (dd/mm/yyyy)</Text>
          <TouchableOpacity onPress={() => setDatePickerVisible('endDate')} activeOpacity={0.7}>
            <View pointerEvents="none">
              <TextInput
                style={styles.input}
                value={edited.endDate}
                editable={false}
                placeholder="31/12/2024"
              />
            </View>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={datePickerVisible !== null}
            mode="date"
            date={(() => {
              if (datePickerVisible === 'decisionDate') {
                const parts = edited.decisionDate?.split('/') || [];
                if (parts.length === 3) {
                  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                }
              } else if (datePickerVisible === 'endDate') {
                const parts = edited.endDate?.split('/') || [];
                if (parts.length === 3) {
                  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                }
              }
              return new Date();
            })()}
            onConfirm={date => {
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              const formatted = `${day}/${month}/${year}`;
              if (datePickerVisible === 'decisionDate') {
                setEdited(e => ({...e, decisionDate: formatted}));
              } else if (datePickerVisible === 'endDate') {
                setEdited(e => ({...e, endDate: formatted}));
              }
              setDatePickerVisible(null);
            }}
            onCancel={() => setDatePickerVisible(null)}
            locale="vi"
          />

          {/* Nhóm và trường động */}
          {Array.isArray(edited.groups) && edited.groups.length > 0 && (
            <View style={{marginTop: 16}}>
              <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
              {edited.groups.map((group: any, gIdx: number) => (
                <View key={group.id || gIdx} style={{marginTop: gIdx > 0 ? 16 : 8}}>
                  <Text style={styles.groupTitle}>{group.title}</Text>
                  {group.description && <Text style={styles.groupDesc}>{group.description}</Text>}
                  {Array.isArray(group.fields) && group.fields.length > 0 && (
                    <View>
                      {group.fields.map((field: any, fIdx: number) => (
                        <View key={field.id || fIdx} style={{marginBottom: 8}}>
                          <Text style={styles.inputLabel}>
                            {field.fieldLabel}
                            {field.isRequired ? ' *' : ''}
                          </Text>
                          <TextInput
                            style={styles.input}
                            value={field.fieldValue}
                            onChangeText={v => {
                              setEdited(e => {
                                const newGroups = [...e.groups];
                                newGroups[gIdx] = {
                                  ...newGroups[gIdx],
                                  fields: newGroups[gIdx].fields.map((fld: any, idx: number) =>
                                    idx === fIdx ? {...fld, fieldValue: v} : fld,
                                  ),
                                };
                                return {...e, groups: newGroups};
                              });
                            }}
                            placeholder={field.placeholder || ''}
                            editable={field.isEditable}
                          />
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={{flexDirection: 'row', gap: 12, marginTop: 16}}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setEdited({...caseData});
                setEditMode(false);
              }}
              disabled={isPending}>
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, isPending && styles.saveBtnDisabled]}
              onPress={handleSaveEdit}
              disabled={isPending}>
              {isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}>
            <Text style={styles.sectionTitle}>Thông tin vụ án</Text>
            {canEdit && (
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
                <Ionicons name="create-outline" size={18} color="#2563eb" />
                <Text style={styles.editBtnText}>Sửa</Text>
              </TouchableOpacity>
            )}
          </View>

          <RowComponent wrap="wrap">
            <TextComponent styles={styles.label} text="Tên vụ án:" />
            <TextComponent title size={14} text={caseData.name} />
          </RowComponent>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mã vụ án:</Text>
            <Text style={styles.value}>{caseData.code}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Loại án:</Text>
            <Text style={styles.value}>{caseData.type}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Điều luật:</Text>
            <Text style={styles.value}>{caseData.applicableLaw}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Loại tội phạm:</Text>
            <Text style={styles.value}>{caseData.crimeType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số bị cáo:</Text>
            <Text style={styles.value}>{caseData.numberOfDefendants}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày bắt đầu:</Text>
            <Text style={styles.value}>{caseData.decisionDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày kết thúc:</Text>
            <Text style={styles.value}>{caseData.endDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Cán bộ thụ lý:</Text>
            <Text style={styles.value}>{caseData.officer.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Trạng thái:</Text>
            <Text style={[styles.status, getStatusStyle(caseData.status)]}>{caseData.status}</Text>
          </View>

          {caseData.description && (
            <View style={[styles.infoRow, {flexDirection: 'column', alignItems: 'flex-start'}]}>
              <Text style={styles.label}>Mô tả:</Text>
              <Text style={[{marginTop: 4}]}>{caseData.description}</Text>
            </View>
          )}

          {/* Cập nhật trạng thái (admin only) */}
        </View>
      )}

      {/* Thông tin từ Groups */}
      {caseData.groups && caseData.groups.length > 0 && (
        <>
          {console.log('✅ Groups in render:', caseData.groups)}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
            {caseData.groups.map((group: any, gIdx: any) => (
              <View key={group.id} style={{marginTop: gIdx > 0 ? 16 : 8}}>
                <Text style={styles.groupTitle}>{group.title}</Text>
                {group.description && <Text style={styles.groupDesc}>{group.description}</Text>}
                {group.fields &&
                  group.fields.map((field: any) => (
                    <View key={field.id} style={styles.infoRow}>
                      <Text style={styles.label}>{field.fieldLabel}:</Text>
                      <Text style={styles.value}>
                        {field.fieldType === 'date'
                          ? formatDate(new Date(field.fieldValue).toString())
                          : field.fieldValue || 'Chưa có dữ liệu'}
                      </Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        </>
      )}

      {/* Giai đoạn vụ án */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Các giai đoạn vụ án</Text>
        {caseData.stages.map((stage: any, idx: number) => (
          <View key={idx} style={styles.stageRow}>
            <View style={{flex: 1}}>
              <Text style={styles.stageName}>{stage.name}</Text>
              <Text style={styles.stageInfo}>Nội dung: {stage.info}</Text>
              <Text style={styles.stageInfo}>
                Thời gian: {stage.start} - {stage.end}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={[styles.stageStatus, stage.completed && {color: '#22c55e'}]}>
                {stage.completed ? 'Đã hoàn tất' : 'Đang xử lý'}
              </Text>
              {canEdit && !stage.completed && (
                <TouchableOpacity
                  style={styles.completeBtn}
                  onPress={() => handleCompleteStage(idx)}
                  disabled={isPending}>
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                  <Text style={styles.completeBtnText}>Xác nhận</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Kế hoạch vụ án */}
      <View style={styles.card}>
        <View style={styles.planHeader}>
          <Text style={styles.sectionTitle}>Kế hoạch vụ án</Text>
        </View>

        {!caseData.planCase ? (
          <View style={styles.emptyPlanBox}>
            <Ionicons name="alert-circle-outline" size={48} color="#f59e0b" />
            <Text style={styles.emptyPlanTitle}>Chưa có kế hoạch</Text>
            <Text style={styles.emptyPlanText}>
              Vui lòng nhập đầy đủ thông tin kế hoạch vụ án trên máy tính
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.planCompleteBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text style={styles.planCompleteText}>Kế hoạch đã hoàn tất</Text>
            </View>

            <View style={styles.planSection}>
              <View style={styles.planItemHeader}>
                <Ionicons name="search" size={18} color="#2563eb" />
                <Text style={styles.planItemTitle}>Kết quả điều tra</Text>
              </View>
              <Text style={styles.planItemContent}>
                {caseData.planCase.investigationResult || 'Chưa có dữ liệu'}
              </Text>
            </View>

            <View style={styles.planSection}>
              <View style={styles.planItemHeader}>
                <Ionicons name="archive" size={18} color="#2563eb" />
                <Text style={styles.planItemTitle}>Vật chứng</Text>
              </View>
              {Array.isArray(caseData.planCase.exhibits) &&
              caseData.planCase.exhibits.length > 0 ? (
                <View style={styles.planList}>
                  {caseData.planCase.exhibits.map((item: string, idx: number) => (
                    <View key={idx} style={styles.planListItem}>
                      <View style={styles.planBullet} />
                      <Text style={styles.planListText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.planItemEmpty}>Chưa có dữ liệu</Text>
              )}
            </View>

            <View style={styles.planSection}>
              <View style={styles.planItemHeader}>
                <Ionicons name="flag" size={18} color="#2563eb" />
                <Text style={styles.planItemTitle}>Mục đích điều tra tiếp theo</Text>
              </View>
              <Text style={styles.planItemContent}>
                {caseData.planCase.nextInvestigationPurpose || 'Chưa có dữ liệu'}
              </Text>
            </View>

            <View style={styles.planSection}>
              <View style={styles.planItemHeader}>
                <Ionicons name="list" size={18} color="#2563eb" />
                <Text style={styles.planItemTitle}>Nội dung điều tra tiếp theo</Text>
              </View>
              {Array.isArray(caseData.planCase.nextInvestigationContent) &&
              caseData.planCase.nextInvestigationContent.length > 0 ? (
                <View style={styles.planList}>
                  {caseData.planCase.nextInvestigationContent.map((item: string, idx: number) => (
                    <View key={idx} style={styles.planListItem}>
                      <View style={styles.planBullet} />
                      <Text style={styles.planListText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.planItemEmpty}>Chưa có dữ liệu</Text>
              )}
            </View>

            <View style={styles.planSection}>
              <View style={styles.planItemHeader}>
                <Ionicons name="people" size={18} color="#2563eb" />
                <Text style={styles.planItemTitle}>Lực lượng tham gia</Text>
              </View>
              {Array.isArray(caseData.planCase.participatingForces) &&
              caseData.planCase.participatingForces.length > 0 ? (
                <View style={styles.planList}>
                  {caseData.planCase.participatingForces.map((item: string, idx: number) => (
                    <View key={idx} style={styles.planListItem}>
                      <View style={styles.planBullet} />
                      <Text style={styles.planListText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.planItemEmpty}>Chưa có dữ liệu</Text>
              )}
            </View>

            <View style={styles.planMetadata}>
              <View style={styles.planMetadataItem}>
                <Ionicons name="calendar-outline" size={16} color="#64748b" />
                <Text style={styles.planMetadataLabel}>Ngày tạo:</Text>
                <Text style={styles.planMetadataValue}>
                  {caseData.planCase.createdAt
                    ? formatDate(caseData.planCase.createdAt)
                    : 'Chưa có dữ liệu'}
                </Text>
              </View>
              <View style={styles.planMetadataItem}>
                <Ionicons name="refresh-outline" size={16} color="#64748b" />
                <Text style={styles.planMetadataLabel}>Cập nhật:</Text>
                <Text style={styles.planMetadataValue}>
                  {caseData.planCase.updatedAt
                    ? formatDate(caseData.planCase.updatedAt)
                    : 'Chưa có dữ liệu'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Helper function để lấy style cho status
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Hoàn tất':
      return {color: '#22c55e'};
    case 'Đang xử lý':
      return {color: '#2563eb'};
    case 'Chờ xử lý':
      return {color: '#f59e0b'};
    case 'Tạm hoãn':
      return {color: '#f59e0b'};
    case 'Đã hủy':
      return {color: '#ef4444'};
    default:
      return {color: '#64748b'};
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 8},
  editTitle: {fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 16},
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {fontSize: 14, color: '#64748b', fontWeight: '500'},
  value: {fontWeight: '600', color: '#334155', fontSize: 14, flex: 1, textAlign: 'right'},
  status: {fontWeight: 'bold', fontSize: 14},
  groupTitle: {fontSize: 15, fontWeight: 'bold', color: '#2563eb', marginTop: 4, marginBottom: 4},
  groupDesc: {fontSize: 13, color: '#64748b', marginTop: 2, marginBottom: 8},
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editBtnText: {color: '#2563eb', fontWeight: 'bold', fontSize: 13, marginLeft: 4},
  inputLabel: {fontSize: 13, color: '#64748b', fontWeight: '600', marginBottom: 6, marginTop: 8},
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f8fafc',
    marginBottom: 4,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#94a3b8',
    alignItems: 'center',
  },
  cancelBtnText: {color: '#64748b', fontWeight: 'bold', fontSize: 15},
  saveBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  saveBtnText: {color: '#fff', fontWeight: 'bold', fontSize: 15},
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  warningText: {color: '#ef4444', fontWeight: '600', fontSize: 13, marginLeft: 8, flex: 1},
  table: {width: '100%', borderRadius: 8, overflow: 'hidden', marginTop: 8},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  header: {backgroundColor: '#f1f5f9'},
  cell: {
    color: '#334155',
    fontSize: 13,
    padding: 8,
    width: 120,
    textAlign: 'center',
  },
  headerText: {fontWeight: 'bold', color: '#2563eb'},
  textCenter: {textAlign: 'center'},
  textLeft: {textAlign: 'left'},
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  stageName: {fontWeight: 'bold', color: '#222', fontSize: 14, marginBottom: 4},
  stageInfo: {color: '#64748b', fontSize: 13, marginTop: 2},
  stageStatus: {color: '#64748b', fontWeight: '600', marginBottom: 4, fontSize: 13},
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  completeBtnText: {color: '#22c55e', fontWeight: 'bold', fontSize: 12, marginLeft: 4},
  // Plan Case Styles - CÁC STYLES MỚI
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  emptyPlanBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fef3c7',
    borderStyle: 'dashed',
  },
  emptyPlanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyPlanText: {
    fontSize: 13,
    color: '#92400e',
    textAlign: 'center',
  },
  planCompleteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  planCompleteText: {
    color: '#22c55e',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  planSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  planItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  planItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  planItemContent: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    paddingLeft: 26,
  },
  planItemEmpty: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
    paddingLeft: 26,
  },
  planList: {
    paddingLeft: 26,
  },
  planListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  planBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
    marginTop: 7,
    marginRight: 8,
  },
  planListText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  planMetadata: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  planMetadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  planMetadataLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  planMetadataValue: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
});

export default CaseDetailScreen;
