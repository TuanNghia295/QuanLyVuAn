import ButtonComponent from '@/components/buttonComponent';
import LoadingComponent from '@/components/LoadingComponent';
import RowComponent from '@/components/rowComponent';
import Space from '@/components/Space';
import TextComponent from '@/components/textComponent';
import {COLOR} from '@/constants/color';
import {fontFamilies} from '@/constants/fontFamilies';
import {useLogin} from '@/hooks/useAuth';
import {yupResolver} from '@hookform/resolvers/yup';
import {useRouter} from 'expo-router';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Vui lòng nhập số điện thoại'),
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
  const {mutateAsync: onLogin, isPending, isError, isSuccess} = useLogin();

  const onSubmit = async (data: LoginForm) => {
    await onLogin(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isPending && <LoadingComponent />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{flex: 1, width: '100%'}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.inner}>
            <Text style={styles.title}>Đăng nhập</Text>
            <View style={styles.form}>
              {/* Username */}
              <Controller
                control={control}
                name="username"
                render={({field: {onChange, value}}) => (
                  <RowComponent flexDirection="column" justify="flex-start" alignItems="flex-start">
                    <TextComponent text="Số điện thoại" font={fontFamilies.bold} />
                    <Space height={8} />
                    <TextInput
                      style={styles.input}
                      placeholder="Số điện thoại"
                      placeholderTextColor="#888"
                      autoCapitalize="none"
                      // keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                    />
                  </RowComponent>
                )}
              />
              {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

              {/* Password */}
              <Controller
                control={control}
                name="password"
                render={({field: {onChange, value}}) => (
                  <RowComponent flexDirection="column" justify="flex-start" alignItems="flex-start">
                    <TextComponent text="Mật khẩu" font={fontFamilies.bold} />
                    <TextInput
                      style={styles.input}
                      placeholder="Mật khẩu"
                      placeholderTextColor="#888"
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                    />
                  </RowComponent>
                )}
              />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
              <View>
                <ButtonComponent
                  title={isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  type="primary"
                  onPress={handleSubmit(onSubmit)}
                />

                <Space height={12} />

                <ButtonComponent
                  title="Đăng ký"
                  type="outline"
                  textStyle={{fontWeight: 'bold'}}
                  onPress={() => router.push(`/register`)}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.GRAY2,
    padding: 16,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLOR.PRIMARY,
    letterSpacing: 1,
    marginBottom: 12,
  },
  form: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    backgroundColor: COLOR.WHITE,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLOR.GRAY3,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 4,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: '#222',
  },
  error: {
    color: '#ef4444',
    marginBottom: 12,
    fontSize: 14,
    fontWeight: 'light',
  },
  registerButton: {marginTop: 12, backgroundColor: 'red', alignItems: 'center', padding: 8},
  registerTitle: {color: COLOR.WHITE, fontWeight: 'bold', fontSize: 14},
});

export default LoginScreen;
