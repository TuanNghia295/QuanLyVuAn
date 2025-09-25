import {Ionicons} from '@expo/vector-icons';
import React, {useState} from 'react';
import {Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

type Column = {
  key: string;
  label: string;
  width: number;
  center?: boolean;
};

type RowData = {
  [key: string]: string;
};

const initialColumns: Column[] = [
  {key: 'stt', label: 'STT', width: 50, center: true},
  {key: 'dieu', label: 'Điều', width: 70, center: true},
  {key: 'noidung', label: 'Nội dung vụ án', width: 260},
  {key: 'ngayQD', label: 'Ngày QĐ', width: 120, center: true},
  {key: 'ngayHH', label: 'Ngày hết hạn', width: 120, center: true},
  {key: 'canbo', label: 'Cán bộ thụ lý', width: 160},
  {key: 'loai', label: 'Loại', width: 100, center: true},
];

const initialRows: RowData[] = [
  {
    stt: '1',
    dieu: '174',
    noidung:
      'Vụ lừa đảo chiếm đoạt tài sản qua internet xảy ra tại xã Thanh Hải, huyện Thanh Liêm...',
    ngayQD: '19/09/2024',
    ngayHH: '19/09/2025',
    canbo: 'Nguyễn Xuân Đức',
    loai: 'DBN',
  },
  {
    stt: '2',
    dieu: '174',
    noidung: 'Vụ lừa đảo chiếm đoạt tài sản khác...',
    ngayQD: '09/10/2024',
    ngayHH: '09/10/2025',
    canbo: 'Hồ Xuân Chung',
    loai: 'DBN',
  },
];

const TemplateDetailScreen = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [rows, setRows] = useState<RowData[]>(initialRows);
  const [backup, setBackup] = useState<{columns: Column[]; rows: RowData[]} | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteColModal, setShowDeleteColModal] = useState(false);
  const [colToDeleteIdx, setColToDeleteIdx] = useState<number | null>(null);

  // Update column label
  const updateColumnLabel = (idx: number, value: string) => {
    setColumns(cols => cols.map((c, i) => (i === idx ? {...c, label: value} : c)));
  };

  // Update cell
  const updateCell = (rowIdx: number, colKey: string, value: string) => {
    setRows(rows => rows.map((row, r) => (r === rowIdx ? {...row, [colKey]: value} : row)));
  };

  // Add new row
  const addRow = () => {
    const newRow: RowData = {};
    columns.forEach(col => {
      newRow[col.key] = '';
    });
    setRows([...rows, newRow]);
  };

  // Remove row
  const removeRow = (rowIdx: number) => {
    setRows(rows => rows.filter((_, i) => i !== rowIdx));
  };

  // Add column
  const addColumn = () => {
    const newKey = `col${columns.length + 1}`;
    setColumns([...columns, {key: newKey, label: 'Tên cột mới', width: 120}]);
    setRows(rows =>
      rows.map(row => ({
        ...row,
        [newKey]: '',
      })),
    );
  };

  // Handle edit
  const handleEdit = () => {
    setBackup({columns: [...columns], rows: [...rows]});
    setEditMode(true);
  };

  const handleCancel = () => {
    if (backup) {
      setColumns(backup.columns);
      setRows(backup.rows);
      setBackup(null);
    }
    setEditMode(false);
  };

  // Remove column with confirm
  const handleDeleteCol = (idx: number) => {
    const key = columns[idx].key;
    const hasData = rows.some(row => row[key] && row[key].trim() !== '');
    if (hasData) {
      setColToDeleteIdx(idx);
      setShowDeleteColModal(true);
    } else {
      actuallyDeleteCol(idx);
    }
  };

  const actuallyDeleteCol = (idx: number) => {
    const keyToRemove = columns[idx].key;
    setColumns(columns => columns.filter((_, i) => i !== idx));
    setRows(rows =>
      rows.map(row => {
        const newRow = {...row};
        delete newRow[keyToRemove];
        return newRow;
      }),
    );
    setShowDeleteColModal(false);
    setColToDeleteIdx(null);
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#f9fafb'}}
      contentContainerStyle={{paddingBottom: 32}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.row, styles.header]}>
            {columns.map((col, idx) => (
              <View key={col.key} style={{width: col.width, minWidth: 110}}>
                {editMode ? (
                  <View style={styles.headerCellContainer}>
                    <View key={idx} style={styles.tableHeaderCell}>
                      <TextInput
                        style={[styles.cell, styles.headerText, col.center && styles.textCenter]}
                        value={col.label}
                        onChangeText={v => updateColumnLabel(idx, v)}
                        placeholder="Tên cột"
                        placeholderTextColor="#94a3b8"
                      />
                      <TouchableOpacity onPress={() => handleDeleteCol(idx)}>
                        <Ionicons name="close-circle" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <Text style={[styles.cell, styles.headerText, col.center && styles.textCenter]}>
                    {col.label}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Rows */}
          {rows.map((row, rIdx) => (
            <View key={rIdx} style={styles.row}>
              {columns.map(col => (
                <View key={col.key} style={{width: col.width, minWidth: 110}}>
                  {editMode ? (
                    <TextInput
                      style={[styles.cell, col.center && styles.textCenter]}
                      value={row[col.key] ?? ''}
                      onChangeText={v => updateCell(rIdx, col.key, v)}
                      multiline={col.key === 'noidung'}
                      numberOfLines={col.key === 'noidung' ? 3 : 1}
                      placeholder={col.label}
                      placeholderTextColor="#94a3b8"
                    />
                  ) : (
                    <Text
                      style={[styles.cell, col.center && styles.textCenter]}
                      numberOfLines={col.key === 'noidung' ? 4 : 2}>
                      {row[col.key]}
                    </Text>
                  )}
                </View>
              ))}
              {editMode && (
                <TouchableOpacity style={styles.deleteRowBtn} onPress={() => removeRow(rIdx)}>
                  <Ionicons name="trash" size={20} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action buttons */}
      {editMode && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconAddBtn} onPress={addRow}>
            <Ionicons name="add-circle" size={24} color="#2563eb" />
            <Text style={styles.iconAddText}>Thêm dòng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconAddBtn} onPress={addColumn}>
            <Ionicons name="add-circle" size={24} color="#2563eb" />
            <Text style={styles.iconAddText}>Thêm cột</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        {editMode ? (
          <View style={{flexDirection: 'row', gap: 12}}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                setEditMode(false);
                setBackup(null);
              }}>
              <Text style={styles.editBtnText}>Lưu mẫu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
            <Text style={styles.editBtnText}>Sửa mẫu</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal xác nhận xóa cột */}
      <Modal visible={showDeleteColModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận xóa cột</Text>
            <Text style={{textAlign: 'center', marginBottom: 16}}>
              Cột này đang có dữ liệu. Bạn có chắc chắn muốn xóa?
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12}}>
              <TouchableOpacity
                onPress={() => {
                  setShowDeleteColModal(false);
                }}
                style={styles.modalBtnCancel}>
                <Text style={{color: '#64748b'}}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => colToDeleteIdx !== null && actuallyDeleteCol(colToDeleteIdx)}
                style={styles.modalBtnDelete}>
                <Text style={{color: '#ef4444'}}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    minHeight: 44,
  },
  header: {
    backgroundColor: '#e0f2fe',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    color: '#2563eb',
  },
  headerCellContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    paddingRight: 2,
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
    flexShrink: 1,
    fontSize: 13,
    backgroundColor: 'transparent',
  },
  textCenter: {
    textAlign: 'center',
  },
  deleteRowBtn: {
    marginLeft: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  deleteColBtn: {
    marginLeft: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  iconAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    elevation: 2,
  },
  iconAddText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  editBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#94a3b8',
  },
  cancelBtnText: {
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2563eb',
    textAlign: 'center',
  },
  modalBtnCancel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  modalBtnDelete: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  tableHeaderCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 6,
    marginRight: 4,
    minWidth: 110,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 13,
    flex: 1,
  },
});

export default TemplateDetailScreen;
