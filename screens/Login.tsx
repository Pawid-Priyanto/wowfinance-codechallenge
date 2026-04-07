import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const DUMMY_USER = {
    email: 'pawitanto27@gmail.com',
    password: 'Password123!' 
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    setErrorMsg('');

   // --- 1. VALIDASI INPUTAN KOSONG
    if (!email && !password) {
      setErrorMsg('Email dan Password tidak boleh kosong!');
      return;
    }
    if (!email) {
      setErrorMsg('Email tidak boleh kosong!');
      return;
    }
    if (!password) {
      setErrorMsg('Password tidak boleh kosong!');
      return;
    }
    
    // --- 2. VALIDASI FORMAT ---
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Format email tidak valid!');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg('Password min 8 karakter, 1 kapital, 1 angka & 1 simbol!');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        if (email !== DUMMY_USER.email || password !== DUMMY_USER.password) {
          setErrorMsg('Email belum terdaftar atau password salah!');
          setLoading(false);
          return; 
        }

        const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
        const nowInSeconds = Math.floor(Date.now() / 1000);
      
        const expTime = nowInSeconds + (60*60); 

        const payloadObj = { 
        email: email, 
        exp: expTime 
        };

        const jsonString = JSON.stringify(payloadObj);
       const base64Payload = Buffer.from(jsonString).toString('base64');
        const mockJwtToken = `${header}.${base64Payload}.S1gnatur3M0ckR4nd0m`;


        await AsyncStorage.setItem('@user_token', mockJwtToken);
        await AsyncStorage.setItem('@user_email', email);

        navigation.replace('Home');

      } catch (error) {
        Alert.alert('Error', 'Terjadi kesalahan saat menyimpan sesi login.');
      } finally {
        setLoading(false);
      }
    }, 1500); 
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#F2F5F7' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
     
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Pokédex</Text>
            <Text style={styles.subtitle}>Log in to start your adventure 🔴</Text>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* INPUT EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="user@gmail.com"
                placeholderTextColor="#95a5a6"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* INPUT PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#95a5a6"
                secureTextEntry={!showPassword} 
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                style={styles.showHideBtn} 
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Text style={styles.showHideText}>
                  {showPassword ? 'HIDE' : 'SHOW'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#2C3E50" />
            ) : (
              <Text style={styles.loginButtonText}>Go! ⚡️</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 24, 
    elevation: 8,
    shadowColor: '#2A75BB', 
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 35,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#2A75BB', 
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#FDEDEC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#34495E',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: '#E1E8ED',
    borderRadius: 14,
    height: 55, 
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1, 
    height: '100%', 
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  showHideBtn: {
    paddingLeft: 10,
    justifyContent: 'center',
    height: '100%',
  },
  showHideText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#95a5a6',
    letterSpacing: 1,
  },
  loginButton: {
    backgroundColor: '#FFCB05', 
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 15,
    elevation: 4,
    shadowColor: '#FFCB05', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  loginButtonText: {
    color: '#2C3E50', 
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
});