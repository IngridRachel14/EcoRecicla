import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputWithIconProps extends TextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  secureTextEntry?: boolean;
  error?: string | boolean;
}

export function InputWithIcon({
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  error,
  ...rest
}: InputWithIconProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={[
          styles.inputContainer,
          error ? { borderColor: '#f00' } : {},
        ]}
      >
        <Ionicons name={icon} size={20} color="#999" style={styles.icon} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          placeholderTextColor="#999"
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && typeof error === 'string' && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 8,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});
