import ButtonComponent from '@/components/buttonComponent';
import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: Yup.string().required('Vui lòng nhập mật khẩu'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
  inviteCode: Yup.string().required('Vui lòng nhập mã giới thiệu'),
});

type RegisterForm = {
  username: string;
  password: string;
  confirmPassword: string;
  inviteCode: string;
};

const RegisterScreen = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterForm>({
    resolver: yupResolver(RegisterSchema),
  });

  React.useEffect(() => {
    register('username');
    register('password');
    register('confirmPassword');
    register('inviteCode');
  }, [register]);

  const onSubmit = (data: RegisterForm) => {
    // TODO: Xử lý đăng ký
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          autoCapitalize="none"
          onChangeText={text => setValue('username', text)}
        />
        {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          onChangeText={text => setValue('password', text)}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          secureTextEntry
          onChangeText={text => setValue('confirmPassword', text)}
        />
        {errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword.message}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Mã giới thiệu"
          autoCapitalize="none"
          onChangeText={text => setValue('inviteCode', text)}
        />
        {errors.inviteCode && <Text style={styles.error}>{errors.inviteCode.message}</Text>}
        <ButtonComponent
          title="Đăng ký"
          type="outline"
          textStyle={{fontWeight: 'bold'}}
          onPress={handleSubmit(onSubmit)}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  form: {
    width: '100%',
    maxWidth: 350,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 14,
  },
});

export default RegisterScreen;
