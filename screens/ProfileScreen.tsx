import LoadingComponent from '@/components/LoadingComponent';
import {COLOR} from '@/constants/color';
import {useLogout} from '@/hooks/useAuth';
import {yupResolver} from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as yup from 'yup';

// Mock: current user
const currentUser = {
  id: '1',
  name: 'Nguyen Van A',
  email: 'admin@example.com',
  phone: '0912345678',
  role: 'admin',
  status: 'active',
};

const ProfileScreen = () => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const {mutate: onLogOut, isPending: isLoggingOut} = useLogout();

  // Validation schema
  const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập họ và tên'),
    phone: yup
      .string()
      .required('Vui lòng nhập số điện thoại')
      .matches(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
    password: yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      name: currentUser.name,
      phone: currentUser.phone,
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const handleEditSave = (data: any) => {
    Alert.alert('Cập nhật', 'Thông tin đã được lưu (mock)!');
    setEditModalVisible(false);
    reset();
  };

  const handleCreateReferral = () => {
    const code = 'REF' + Math.floor(100000 + Math.random() * 900000);
    setReferralCode(code);
    Alert.alert('Mã giới thiệu', `Mã của bạn: ${code}`);
  };

  const handleLogout = async () => {
    await onLogOut();
  };

  const handlePickAvatar = async () => {
    // xin quyền
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Quyền bị từ chối', 'Bạn cần cấp quyền để chọn ảnh đại diện.');
      return;
    }

    // mở thư viện ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'livePhotos'],
      allowsEditing: true, // cho phép crop
      aspect: [1, 1], // crop hình vuông
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarBox}>
          <TouchableOpacity onPress={handlePickAvatar}>
            {avatarUri ? (
              <Image source={{uri: avatarUri}} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{currentUser.name.charAt(0)}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Nhấn để đổi ảnh đại diện</Text>
        </View>

        <Text style={styles.title}>Thông tin cá nhân</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tên:</Text>
          <Text style={styles.value}>{currentUser.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.value}>{currentUser.phone || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{currentUser.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Vai trò:</Text>
          <Text style={styles.value}>{currentUser.role === 'admin' ? 'Admin' : 'Người dùng'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Trạng thái:</Text>
          <Text
            style={[styles.value, currentUser.status === 'active' ? styles.active : styles.locked]}>
            {currentUser.status === 'active' ? 'Hoạt động' : 'Khóa'}
          </Text>
        </View>

        {currentUser.role === 'admin' && (
          <TouchableOpacity style={styles.button} onPress={handleCreateReferral}>
            <Text style={styles.buttonText}>Tạo mã giới thiệu</Text>
          </TouchableOpacity>
        )}
        {currentUser.role === 'admin' && (
          <View style={styles.referralBox}>
            <Text style={styles.referralText}>Mã giới thiệu: {referralCode}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
          <Text style={styles.editText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {isLoggingOut && <LoadingComponent />}

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>
            <Controller
              control={control}
              name="name"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Họ và tên"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            <Controller
              control={control}
              name="phone"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Số điện thoại"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu mới"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(handleEditSave)}>
                <Text style={styles.saveText}>Lưu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: COLOR.BLUE,
    textAlign: 'center',
  },
  infoRow: {flexDirection: 'row', marginBottom: 10, alignItems: 'center'},
  label: {width: 90, fontWeight: '600', color: '#64748b', fontSize: 16},
  value: {flex: 1, fontSize: 16, color: '#334155', fontWeight: '500'},
  active: {color: COLOR.GREEN, fontWeight: 'bold'},
  locked: {color: COLOR.PRIMARY, fontWeight: 'bold'},
  avatarBox: {alignItems: 'center', marginBottom: 12},
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {fontSize: 32, color: COLOR.BLUE, fontWeight: 'bold'},
  avatarImage: {width: 72, height: 72, borderRadius: 36},
  avatarHint: {marginTop: 6, fontSize: 12, color: '#64748b'},
  button: {
    marginTop: 18,
    backgroundColor: COLOR.BLUE,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  logoutButton: {
    marginTop: 18,
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1},
  referralBox: {
    marginTop: 16,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  referralText: {color: COLOR.BLUE, fontWeight: 'bold', fontSize: 16},
  editButton: {
    marginTop: 18,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.BLUE,
  },
  editText: {color: COLOR.BLUE, fontWeight: 'bold', fontSize: 16},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    width: '90%',
    maxWidth: 350,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.BLUE,
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  modalActions: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 8},
  saveButton: {
    backgroundColor: COLOR.BLUE,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  saveText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#64748b',
  },
  cancelText: {color: '#64748b', fontWeight: 'bold', fontSize: 16},
  errorText: {
    color: COLOR.PRIMARY,
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default ProfileScreen;
