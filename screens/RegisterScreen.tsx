import ButtonComponent from '@/components/buttonComponent';
import LoadingComponent from '@/components/LoadingComponent';
import {COLOR} from '@/constants/color';
import {useRegister} from '@/hooks/useAuth';
import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Yup from 'yup';

// ✅ Yup Schema
const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().required('Vui lòng nhập họ và tên'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
  referralCode: Yup.string().required('Vui lòng nhập mã giới thiệu'),
  phone: Yup.string().required('Vui lòng nhập số điện thoại'),
});

type RegisterForm = {
  fullName: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  phone: string;
};

// ✅ Custom Input
type InputProps = {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  error?: string;
  value?: string;
  onChangeText: (text: string) => void;
};

const InputComponent = ({
  label,
  placeholder,
  secureTextEntry,
  error,
  value,
  onChangeText,
}: InputProps) => {
  return (
    <View style={{marginBottom: 16}}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

// ✅ Register Screen
const RegisterScreen = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterForm>({
    resolver: yupResolver(RegisterSchema),
    mode: 'onBlur', // validate khi blur hoặc submit
  });

  const {mutate: onRegister, isPending: isLoadingForm, isError} = useRegister();

  const onSubmit = async (data: RegisterForm) => {
    await onRegister({
      fullName: data.fullName,
      phone: data.phone,
      password: data.password,
      referralCode: data.referralCode,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {isLoadingForm && <LoadingComponent />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{flex: 1, width: '100%'}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Text style={styles.title}>Đăng ký</Text>
          <View style={styles.form}>
            {/* Họ và tên */}
            <Controller
              control={control}
              name="fullName"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <InputComponent
                  label="Họ và tên"
                  placeholder="Nhập họ và tên"
                  error={error?.message}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            {/* Số điện thoại */}
            <Controller
              control={control}
              name="phone"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <InputComponent
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  error={error?.message}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            {/* Mật khẩu */}
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <InputComponent
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  secureTextEntry
                  error={error?.message}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            {/* Xác nhận mật khẩu */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <InputComponent
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry
                  error={error?.message}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            {/* Mã giới thiệu */}
            <Controller
              control={control}
              name="referralCode"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <InputComponent
                  label="Mã giới thiệu"
                  placeholder="Nhập mã giới thiệu"
                  error={error?.message}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <ButtonComponent
              title="Đăng ký"
              type="outline"
              textStyle={{fontWeight: 'bold'}}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: COLOR.PRIMARY,
  },
  form: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  error: {
    color: 'red',
    marginTop: 4,
    fontSize: 14,
  },
});

export default RegisterScreen;
