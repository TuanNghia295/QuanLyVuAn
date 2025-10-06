import LoadingComponent from '@/components/LoadingComponent';
import RowComponent from '@/components/rowComponent';
import TextComponent from '@/components/textComponent';
import {COLOR} from '@/constants/color';
import {useLogout} from '@/hooks/useAuth';
import {
  useCreateInviteCode,
  useGetInviteCode,
  useUpdateUserInfo,
  useUserInfo,
} from '@/hooks/useUser';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as yup from 'yup';

const ProfileScreen = (): React.ReactNode => {
  const {data: userInfo} = useUserInfo();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const {mutate: onLogOut, isPending: isLoggingOut} = useLogout();
  const {mutate: onUpdateUser, isPending} = useUpdateUserInfo(setEditModalVisible);
  const {mutate: onCreateInviteCode, data: inviteCode} = useCreateInviteCode();
  const {data: getInviteCode, refetch: refetchGetInviteCode} = useGetInviteCode();
  console.log(userInfo);

  // Validation schema
  const schema = yup.object().shape({
    fullName: yup.string().required('Vui lòng nhập họ và tên'),
    phone: yup
      .string()
      .required('Vui lòng nhập số điện thoại')
      .matches(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
    password: yup
      .string()
      .notRequired()
      .test('len', 'Mật khẩu ít nhất 6 ký tự', val => !val || val.length >= 6),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      fullName: userInfo?.fullName,
      phone: userInfo?.phone,
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const handleEditSave = (data: any) => {
    onUpdateUser({
      ...data,
      userId: userInfo?.id,
    });
    reset();
  };

  const handleCreateReferral = () => {
    onCreateInviteCode();
    setReferralCode(inviteCode?.code);
  };

  const handleLogout = async () => {
    await onLogOut();
  };

  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Quyền bị từ chối', 'Bạn cần cấp quyền để chọn ảnh đại diện.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'livePhotos'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleCopyCode = (code: string) => {
    Clipboard.setStringAsync(code);
    Alert.alert('Đã sao chép', `Mã giới thiệu đã được lưu vào clipboard`);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Avatar */}
        <View style={styles.avatarBox}>
          {avatarUri ? (
            <Image source={{uri: avatarUri}} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarCircle}>
              <TextComponent
                text={userInfo?.fullName?.charAt(0) ?? ''}
                size={32}
                color={COLOR.BLUE}
                styles={{fontWeight: 'bold'}}
              />
            </View>
          )}
        </View>

        {/* Tiêu đề */}
        <TextComponent
          text="Thông tin cá nhân"
          title
          size={22}
          color={COLOR.BLUE}
          styles={{marginBottom: 18, textAlign: 'center'}}
        />

        {/* Họ và tên */}
        <RowComponent justify="space-between" wrap="wrap">
          <TextComponent
            text="Họ và tên:"
            styles={{fontWeight: '600', color: '#64748b', fontSize: 16}}
          />
          <TextComponent
            text={userInfo?.fullName}
            numberOfLine={2}
            styles={{color: '#334155', fontWeight: '500'}}
          />
        </RowComponent>

        {/* Số điện thoại */}
        <RowComponent justify="space-between" wrap="wrap">
          <TextComponent
            text="Số điện thoại:"
            styles={{fontWeight: '600', color: '#64748b', fontSize: 16, minWidth: 110}}
          />
          <TextComponent
            text={userInfo?.phone ?? '-'}
            numberOfLine={1}
            styles={{color: '#334155', fontWeight: '500'}}
          />
        </RowComponent>

        {/* Vai trò */}
        <RowComponent justify="space-between" wrap="wrap">
          <TextComponent
            text="Vai trò:"
            styles={{fontWeight: '600', color: '#64748b', fontSize: 16, minWidth: 110}}
          />
          <TextComponent
            text={userInfo?.role === 'admin' ? 'Admin' : 'Người dùng'}
            numberOfLine={1}
            styles={{color: '#334155', fontWeight: '500'}}
          />
        </RowComponent>

        {/* Tạo mã giới thiệu */}
        {userInfo?.role === 'admin' && (
          <TouchableOpacity style={styles.button} onPress={handleCreateReferral}>
            <TextComponent
              text={getInviteCode?.code ? 'Tạo mã giới thiệu mới' : 'Tạo mã giới thiệu'}
              color="#fff"
              styles={{fontWeight: 'bold', fontSize: 16}}
            />
          </TouchableOpacity>
        )}

        {userInfo?.role === 'admin' && getInviteCode?.code && (
          <RowComponent styles={styles.referralBox} justify="space-between">
            <TextComponent
              text={`Mã: ${getInviteCode.code}`}
              color={COLOR.BLUE}
              styles={{fontWeight: 'bold', fontSize: 16}}
            />

            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => handleCopyCode(getInviteCode.code)}>
              <TextComponent
                text="Sao chép"
                color={COLOR.GRAY5}
                styles={{fontWeight: '600', fontSize: 14}}
              />
            </TouchableOpacity>
          </RowComponent>
        )}

        {/* Nút chỉnh sửa */}
        <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
          <TextComponent
            text="Chỉnh sửa thông tin"
            color={COLOR.BLUE}
            styles={{fontWeight: 'bold', fontSize: 16}}
          />
        </TouchableOpacity>

        {/* Nút đăng xuất */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <TextComponent
            text="Đăng xuất"
            color="#fff"
            styles={{fontWeight: 'bold', fontSize: 16, letterSpacing: 1}}
          />
        </TouchableOpacity>
      </View>

      {isLoggingOut && <LoadingComponent />}

      {/* Modal chỉnh sửa */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={styles.modalContent}>
                <TextComponent
                  text="Chỉnh sửa thông tin"
                  title
                  size={20}
                  color={COLOR.PRIMARY}
                  styles={{marginBottom: 18, textAlign: 'center'}}
                />

                {/* Họ và tên */}
                <TextComponent
                  text="Họ và tên"
                  required
                  styles={{fontWeight: '600', fontSize: 14, marginBottom: 4}}
                />
                <Controller
                  control={control}
                  name="fullName"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập họ và tên"
                      value={value ?? ''}
                      onChangeText={onChange}
                      placeholderTextColor={COLOR.GRAY3}
                    />
                  )}
                />
                {errors.fullName && (
                  <TextComponent
                    text={errors.fullName.message as string}
                    color={COLOR.PRIMARY}
                    size={13}
                    styles={{marginBottom: 8, marginLeft: 4}}
                  />
                )}

                {/* Số điện thoại */}
                <TextComponent
                  text="Số điện thoại"
                  required
                  styles={{fontWeight: '600', fontSize: 14, marginBottom: 4}}
                />
                <Controller
                  control={control}
                  name="phone"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập số điện thoại"
                      value={value ?? ''}
                      onChangeText={onChange}
                      keyboardType="phone-pad"
                      placeholderTextColor={COLOR.GRAY3}
                    />
                  )}
                />
                {errors.phone && (
                  <TextComponent
                    text={errors.phone.message as string}
                    color={COLOR.PRIMARY}
                    size={13}
                    styles={{marginBottom: 8, marginLeft: 4}}
                  />
                )}

                {/* Mật khẩu */}
                <TextComponent
                  text="Mật khẩu mới"
                  styles={{fontWeight: '600', fontSize: 14, marginBottom: 4}}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập mật khẩu mới"
                      value={value ?? ''}
                      onChangeText={onChange}
                      secureTextEntry
                      placeholderTextColor={COLOR.GRAY3}
                    />
                  )}
                />
                {errors.password && (
                  <TextComponent
                    text={errors.password.message as string}
                    color={COLOR.PRIMARY}
                    size={13}
                    styles={{marginBottom: 8, marginLeft: 4}}
                  />
                )}

                <RowComponent justify="space-between" styles={{marginTop: 8}}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setEditModalVisible(false)}>
                    <TextComponent
                      text="Hủy"
                      color="#64748b"
                      styles={{fontWeight: 'bold', fontSize: 16}}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSubmit(handleEditSave)}>
                    <TextComponent
                      text="Lưu"
                      color="#fff"
                      styles={{fontWeight: 'bold', fontSize: 16}}
                    />
                  </TouchableOpacity>
                </RowComponent>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
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
  avatarBox: {alignItems: 'center', marginBottom: 12},
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {width: 72, height: 72, borderRadius: 36},
  button: {
    marginTop: 18,
    backgroundColor: COLOR.BLUE,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 18,
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  referralBox: {
    marginTop: 16,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  copyButton: {},

  editButton: {
    marginTop: 18,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.BLUE,
  },
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
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  saveButton: {
    backgroundColor: COLOR.PRIMARY,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#64748b',
  },
});

export default ProfileScreen;
