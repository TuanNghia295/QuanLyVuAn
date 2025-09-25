import {Ionicons} from '@expo/vector-icons';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

const defaultColumns = [
  'STT',
  'Điều',
  'Nội dung vụ án',
  'Số bị can',
  'Ngày ra quyết định',
  'Ngày hết hạn',
  'Cán bộ thụ lý',
  'Loại TP',
];

const TemplateCreateScreen = () => {
  const [columns, setColumns] = useState([...defaultColumns]);
  const [rows, setRows] = useState([Array(defaultColumns.length).fill('')]);
  const [templateName, setTemplateName] = useState('');
  const [type, setType] = useState('');

  // Thêm cột
  const addColumn = () => {
    setColumns([...columns, `Cột ${columns.length + 1}`]);
    setRows(rows.map(row => [...row, '']));
  };
  // Xóa cột
  const removeColumn = (idx: number) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter((_, i) => i !== idx));
    setRows(rows.map(row => row.filter((_, i) => i !== idx)));
  };
  // Thêm dòng
  const addRow = () => {
    setRows([...rows, Array(columns.length).fill('')]);
  };
  // Xóa dòng
  const removeRow = (idx: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== idx));
  };
  // Sửa dữ liệu bảng
  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    setRows(rows =>
      rows.map((row, r) =>
        r === rowIdx ? row.map((cell, c) => (c === colIdx ? value : cell)) : row,
      ),
    );
  };

  // Lưu template (mock)
  const handleSaveTemplate = () => {
    // TODO: gửi dữ liệu lên server hoặc lưu vào state
    alert('Đã tạo mẫu vụ án!');
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#f8fafc'}}
      contentContainerStyle={{paddingBottom: 32}}>
      <Text style={styles.title}>Tạo mẫu vụ án mới</Text>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Tên mẫu vụ án"
          value={templateName}
          onChangeText={setTemplateName}
        />
        <TextInput
          style={styles.input}
          placeholder="Loại vụ án (VD: DBNT, RNT)"
          value={type}
          onChangeText={setType}
        />
      </View>
      <View style={styles.tableWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.tableRow}>
              {columns.map((col, idx) => (
                <View key={idx} style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>{col}</Text>
                  <TouchableOpacity onPress={() => removeColumn(idx)}>
                    <Ionicons name="close-circle" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addColBtn} onPress={addColumn}>
                <Ionicons name="add-circle" size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>
            {rows.map((row, rIdx) => (
              <View key={rIdx} style={styles.tableRow}>
                {row.map((cell, cIdx) => (
                  <View key={cIdx} style={styles.tableCell}>
                    <TextInput
                      style={[styles.cellInput, {width: 120}]}
                      value={cell}
                      onChangeText={v => updateCell(rIdx, cIdx, v)}
                      multiline={true}
                      numberOfLines={columns[cIdx] === 'Nội dung vụ án' ? 3 : 1}
                      placeholder={columns[cIdx]}
                      placeholderTextColor="#94a3b8"
                      textAlignVertical="top"
                      scrollEnabled={true}
                    />
                  </View>
                ))}
                <TouchableOpacity style={styles.removeRowBtn} onPress={() => removeRow(rIdx)}>
                  <Ionicons name="remove-circle" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addRowBtn} onPress={addRow}>
              <Ionicons name="add-circle" size={20} color="#2563eb" />
              <Text style={styles.addRowText}>Thêm dòng</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTemplate}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.saveBtnText}>Tạo mẫu vụ án</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 12,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
    backgroundColor: '#f8fafc',
  },
  tableWrap: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    marginBottom: 12,
    elevation: 2,
    minWidth: 340,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tableHeaderCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
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
  addColBtn: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 6,
    marginLeft: 4,
  },
  tableCell: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 6,
    marginRight: 4,
    minWidth: 110,
  },
  cellInput: {
    fontSize: 13,
    color: '#334155',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    padding: 4,
    minHeight: 32,
    width: 120,
    maxHeight: 120,
  },
  addRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  addRowText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  removeRowBtn: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 4,
    marginLeft: 4,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'center',
    marginTop: 12,
    elevation: 2,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default TemplateCreateScreen;
