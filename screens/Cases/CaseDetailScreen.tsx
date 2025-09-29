import RowComponent from '@/components/rowComponent';
import {Ionicons} from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Mock template table cho từng loại vụ án
const mockTemplates = {
  'Hình sự': {
    columns: [
      {key: 'stt', label: 'STT', flex: 0, center: true},
      {key: 'dieu', label: 'Điều', flex: 0, center: true},
      {key: 'noidung', label: 'Nội dung vụ án', flex: 0},
      {key: 'ngayQD', label: 'Ngày QĐ', flex: 0, center: true},
      {key: 'ngayHH', label: 'Ngày hết hạn', flex: 0, center: true},
      {key: 'canbo', label: 'Cán bộ thụ lý', flex: 0},
    ],
    rows: [
      {
        stt: '1',
        dieu: '174',
        noidung: 'Lừa đảo chiếm đoạtádasdaoisjdoaisjdoiajsdoiajsdoijasoidjasoidj...',
        ngayQD: '19/09/2024',
        ngayHH: '19/09/2025',
        canbo: 'Nguyễn Xuân Đức',
      },
      {
        stt: '2',
        dieu: '174',
        noidung: 'Lừa đảo khác...',
        ngayQD: '09/10/2024',
        ngayHH: '09/10/2025',
        canbo: 'Hồ Xuân Chung',
      },
    ],
  },
  'Dân sự': {
    columns: [
      {key: 'stt', label: 'STT', flex: 0.5, center: true},
      {key: 'dieu', label: 'Điều', flex: 0.7, center: true},
      {key: 'noidung', label: 'Nội dung vụ án', flex: 2},
      {key: 'ngayQD', label: 'Ngày QĐ', flex: 1, center: true},
      {key: 'ngayHH', label: 'Ngày hết hạn', flex: 1, center: true},
      {key: 'canbo', label: 'Cán bộ thụ lý', flex: 1.5}, // tự co giãn
    ],
    rows: [
      {
        stt: '1',
        noidung: 'Tranh chấp đất...',
        ngayQD: '01/08/2024',
        ngayHH: '01/09/2024',
        canbo: 'Nguyễn Văn B',
      },
    ],
  },
};

// Mock dữ liệu vụ án
const mockCase = {
  id: '1',
  code: 'CA001',
  name: 'Vụ án A',
  type: 'Hình sự',
  decisionDate: '2025-09-01',
  endDate: '2025-09-20',
  officer: {id: '1', name: 'Nguyen Van A'},
  status: 'Đang xử lý',
  stages: [
    {
      name: 'Giai đoạn 1',
      info: 'Điều tra ban đầu',
      start: '2025-09-01',
      end: '2025-09-10',
      completed: true,
    },
    {
      name: 'Giai đoạn 2',
      info: 'Xét xử sơ thẩm',
      start: '2025-09-11',
      end: '2025-09-15',
      completed: true,
    },
    {
      name: 'Giai đoạn 3',
      info: 'Xét xử phúc thẩm',
      start: '2025-09-16',
      end: '2025-09-20',
      completed: true,
    },
  ],
  plan: {
    filled: true,
    data: [
      {
        stt: '1',
        dieu: '174',
        noidung: 'Lừa đảo chiếm đoạt tài sản qua internet tại xã Thanh Hải, huyện Thanh Liêm...',
        ngayQD: '19/09/2024',
        ngayHH: '19/09/2025',
        canbo: 'Nguyễn Xuân Đức',
        loai: 'DBN',
      },
      {
        stt: '2',
        dieu: '174',
        noidung: 'Lừa đảo chiếm đoạt tài sản khác...',
        ngayQD: '09/10/2024',
        ngayHH: '09/10/2025',
        canbo: 'Hồ Xuân Chung',
        loai: 'DBN',
      },
    ],
  },
};

const currentUser = {id: '1', role: 'admin'}; // mock
type Column = {
  key: string;
  label: string;
  flex?: number;
  minWidth?: number;
  center?: boolean;
};

type RowData = {
  [key: string]: string;
};

const CaseDetailScreen = () => {
  const [editMode, setEditMode] = useState(false);
  const [caseData, setCaseData] = useState(mockCase);
  const [edited, setEdited] = useState({...mockCase});

  // Cập nhật trạng thái vụ án (admin có thể chỉnh trực tiếp)
  const handleUpdateStatus = (newStatus: string) => {
    setCaseData({...caseData, status: newStatus});
  };

  // Xác nhận hoàn tất giai đoạn (user hoặc admin)
  const handleCompleteStage = (idx: number) => {
    const newStages = caseData.stages.map((s, i) => (i === idx ? {...s, completed: true} : s));
    // Tìm giai đoạn tiếp theo chưa hoàn tất
    const nextStageIdx = newStages.findIndex(s => !s.completed);
    let newStatus = 'Hoàn tất';
    if (nextStageIdx !== -1) newStatus = newStages[nextStageIdx].name;
    // Nếu còn thiếu thông tin hoặc kế hoạch chưa hoàn tất thì trạng thái là chưa đủ thông tin
    if (!caseData.plan.filled || newStages.some(s => !s.completed)) newStatus = 'Chưa đủ thông tin';
    setCaseData({...caseData, stages: newStages, status: newStatus});
  };

  // Lưu chỉnh sửa vụ án
  const handleSaveEdit = () => {
    setCaseData({...edited});
    setEditMode(false);
  };

  // Quyền chỉnh sửa
  const canEdit = currentUser.role === 'admin' || currentUser.id === caseData.officer.id;

  // Kiểm tra cảnh báo thiếu thông tin
  const showWarning = caseData.status === 'Chưa đủ thông tin';

  // Lấy template table theo loại vụ án
  const template = mockTemplates[caseData.type as keyof typeof mockTemplates];

  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

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
          <TextInput
            style={styles.input}
            value={edited.name}
            onChangeText={v => setEdited(e => ({...e, name: v}))}
            placeholder="Tên vụ án"
          />
          <TextInput
            style={styles.input}
            value={edited.code}
            onChangeText={v => setEdited(e => ({...e, code: v}))}
            placeholder="Số vụ án"
          />
          <TextInput
            style={styles.input}
            value={edited.type}
            onChangeText={v => setEdited(e => ({...e, type: v}))}
            placeholder="Loại án"
          />
          <TextInput
            style={styles.input}
            value={edited.decisionDate}
            onChangeText={v => setEdited(e => ({...e, decisionDate: v}))}
            placeholder="Ngày QĐ"
          />
          <TextInput
            style={styles.input}
            value={edited.endDate}
            onChangeText={v => setEdited(e => ({...e, endDate: v}))}
            placeholder="Ngày hết hạn"
          />
          <TextInput
            style={styles.input}
            value={edited.officer.name}
            onChangeText={v => setEdited(e => ({...e, officer: {...e.officer, name: v}}))}
            placeholder="Cán bộ thụ lý"
          />
          <View style={{flexDirection: 'row', gap: 12, marginTop: 12}}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}>
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
              <Text style={styles.saveBtnText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>
            Tên vụ án: <Text style={styles.value}>{caseData.name}</Text>
          </Text>
          <Text style={styles.label}>
            Số vụ án: <Text style={styles.value}>{caseData.code}</Text>
          </Text>
          <Text style={styles.label}>
            Loại án: <Text style={styles.value}>{caseData.type}</Text>
          </Text>
          <Text style={styles.label}>
            Ngày QĐ: <Text style={styles.value}>{caseData.decisionDate}</Text>
          </Text>
          <Text style={styles.label}>
            Ngày hết hạn: <Text style={styles.value}>{caseData.endDate}</Text>
          </Text>
          <Text style={styles.label}>
            Cán bộ thụ lý: <Text style={styles.value}>{caseData.officer.name}</Text>
          </Text>
          {/* Trạng thái vụ án */}
          <Text style={styles.label}>
            Trạng thái: <Text style={styles.status}>{caseData.status}</Text>
          </Text>
          {/* Nếu là admin thì cho phép chỉnh trực tiếp trạng thái */}
          {currentUser.role === 'admin' && (
            <View style={{marginBottom: 8}}>
              <Text style={{fontSize: 13, color: '#64748b'}}>Cập nhật trạng thái vụ án:</Text>
              <View style={{flexDirection: 'row', gap: 8, marginTop: 4}}></View>
              <RowComponent wrap="wrap" styles={{gap: 8}}>
                {['Chưa đủ thông tin', ...caseData.stages.map(s => s.name), 'Hoàn tất'].map(st => (
                  <TouchableOpacity
                    key={st}
                    style={{
                      backgroundColor: caseData.status === st ? '#2563eb' : '#e0e7ff',
                      borderRadius: 8,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                    }}
                    onPress={() => handleUpdateStatus(st)}>
                    <Text
                      style={{
                        color: caseData.status === st ? '#fff' : '#2563eb',
                        fontWeight: 'bold',
                      }}>
                      {st}
                    </Text>
                  </TouchableOpacity>
                ))}
              </RowComponent>
            </View>
          )}
          {canEdit && (
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
              <Ionicons name="create-outline" size={18} color="#2563eb" />
              <Text style={styles.editBtnText}>Sửa vụ án</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* Template table - auto resize khi xoay ngang màn hình */}
      {template && (
        <View style={styles.card}>
          <Text style={styles.label}>Thông tin theo mẫu vụ án:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View
              style={[
                styles.table,
                {
                  flexDirection: 'column',
                  minWidth: screenWidth > 600 ? '100%' : template.columns.length * 120,
                  width: screenWidth > 600 ? screenWidth : undefined,
                },
              ]}>
              {/* Header row */}
              <View style={[styles.row, styles.header, {flexDirection: 'row'}]}>
                {template.columns.map((col: Column) => (
                  <View
                    key={col.key}
                    style={{
                      width:
                        col.key === 'stt'
                          ? 50
                          : col.key === 'canbo'
                          ? 180
                          : screenWidth > 600
                          ? screenWidth / template.columns.length
                          : 120,
                      justifyContent:
                        col.key === 'canbo'
                          ? 'flex-start'
                          : col.center
                          ? 'center'
                          : col.key === 'noidung'
                          ? 'flex-start'
                          : 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[
                        styles.cell,
                        styles.headerText,
                        col.center && styles.textCenter,
                        col.key === 'noidung' && styles.textLeft,
                        col.key === 'canbo' && styles.textLeft,
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {col.label}
                    </Text>
                  </View>
                ))}
              </View>
              {/* Data rows */}
              {(caseData.plan.filled ? caseData.plan.data : template.rows).map(
                (row: RowData, rIdx: number) => (
                  <View key={rIdx} style={[styles.row, {flexDirection: 'row'}]}>
                    {template.columns.map((col: Column) => (
                      <View
                        key={col.key}
                        style={{
                          width:
                            col.key === 'stt'
                              ? 50
                              : col.key === 'canbo'
                              ? 180
                              : screenWidth > 600
                              ? screenWidth / template.columns.length
                              : 120,
                          justifyContent:
                            col.key === 'canbo'
                              ? 'flex-start'
                              : col.center
                              ? 'center'
                              : col.key === 'noidung'
                              ? 'flex-start'
                              : 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.cell,
                            col.center && styles.textCenter,
                            col.key === 'noidung' && styles.textLeft,
                            col.key === 'canbo' && styles.textLeft,
                          ]}
                          numberOfLines={col.key === 'noidung' ? 4 : col.key === 'canbo' ? 2 : 1}
                          ellipsizeMode={col.key === 'canbo' ? 'clip' : 'tail'}>
                          {row[col.key]}
                        </Text>
                      </View>
                    ))}
                  </View>
                ),
              )}
            </View>
          </ScrollView>
        </View>
      )}
      {/* Giai đoạn vụ án */}
      <View style={styles.card}>
        <Text style={styles.label}>Các giai đoạn vụ án (timeline):</Text>
        {caseData.stages.map((stage, idx) => (
          <View key={idx} style={styles.stageRow}>
            <View style={{flex: 1}}>
              <Text style={styles.stageName}>{stage.name}</Text>
              <Text style={styles.stageInfo}>Nội dung: {stage.info}</Text>
              <Text style={styles.stageInfo}>
                Thời gian: {stage.start} - {stage.end}
              </Text>
            </View>
            <Text style={styles.stageStatus}>{stage.completed ? 'Đã hoàn tất' : 'Đang xử lý'}</Text>
            {canEdit && !stage.completed && (
              <TouchableOpacity style={styles.completeBtn} onPress={() => handleCompleteStage(idx)}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.completeBtnText}>Xác nhận hoàn tất</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      {/* Kế hoạch vụ án (table nhập liệu) */}
      <View style={styles.card}>
        <Text style={styles.label}>Kế hoạch vụ án:</Text>
        {/* Nếu chưa nhập liệu thì hiển thị cảnh báo và form nhập */}
        {!caseData.plan.filled ? (
          <View>
            <Text style={styles.warningText}>Vui lòng nhập đầy đủ thông tin kế hoạch vụ án!</Text>
            {/* ...form nhập liệu kế hoạch... */}
          </View>
        ) : (
          <Text style={styles.value}>Kế hoạch đã hoàn tất</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#222', textAlign: 'center'},
  card: {backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, elevation: 2},
  label: {fontSize: 15, color: '#222', marginBottom: 4},
  value: {fontWeight: 'bold', color: '#2563eb'},
  status: {fontWeight: 'bold', color: '#22c55e'},
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  editBtnText: {color: '#2563eb', fontWeight: 'bold', fontSize: 15, marginLeft: 6},
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
    backgroundColor: '#f8fafc',
    marginBottom: 8,
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#94a3b8',
  },
  cancelBtnText: {color: '#64748b', fontWeight: 'bold', fontSize: 15},
  saveBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginLeft: 8,
  },
  saveBtnText: {color: '#fff', fontWeight: 'bold', fontSize: 15},
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  warningText: {color: '#ef4444', fontWeight: 'bold', fontSize: 14, marginLeft: 8},
  table: {width: '100%', borderRadius: 8, overflow: 'hidden'},
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
  stageRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8},
  stageName: {fontWeight: 'bold', color: '#222'},
  stageInfo: {color: '#64748b', fontSize: 13},
  stageStatus: {color: '#2563eb', fontWeight: 'bold', marginRight: 8},
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0ffe0',
    borderRadius: 8,
    padding: 6,
  },
  completeBtnText: {color: '#22c55e', fontWeight: 'bold', fontSize: 14, marginLeft: 4},
});

export default CaseDetailScreen;
