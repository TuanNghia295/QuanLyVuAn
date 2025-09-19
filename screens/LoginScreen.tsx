import ButtonComponent from '@/components/buttonComponent';
import Space from '@/components/Space';
import {COLOR} from '@/constants/color';
import {yupResolver} from '@hookform/resolvers/yup';
import {useRouter} from 'expo-router';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: Yup.string().required('Vui lòng nhập mật khẩu'),
});

type LoginForm = {
  username: string;
  password: string;
};

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginForm>({
    resolver: yupResolver(LoginSchema),
  });

  const router = useRouter();

  const onSubmit = (data: LoginForm) => {
    console.log('📌 Dữ liệu login:', data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <View style={styles.form}>
        {/* Username */}
        <Controller
          control={control}
          name="username"
          render={({field: {onChange, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Tên đăng nhập"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({field: {onChange, value}}) => (
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        {/* Nút Đăng nhập */}
        <ButtonComponent
          title="Đăng nhập"
          type="primary"
          textStyle={{fontWeight: 'bold'}}
          onPress={() => handleSubmit(onSubmit)}
        />
        <Space height={12} />
        {/* Nút Đăng ký */}
        <ButtonComponent
          title="Đăng ký"
          type="outline"
          textStyle={{fontWeight: 'bold'}}
          onPress={() => router.push(`/register`)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 24},
  form: {width: '100%', maxWidth: 350},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  error: {color: 'red', marginBottom: 8, fontSize: 14},
  registerButton: {marginTop: 12, backgroundColor: 'red', alignItems: 'center', padding: 8},
  registerTitle: {color: COLOR.WHITE, fontWeight: 'bold', fontSize: 14},
});

export default LoginScreen;
