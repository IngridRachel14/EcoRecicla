import { useAuthSession } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function LoginScreen() {
    const { signIn } = useAuthSession();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)

    const { isLoading } = useAuthSession();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const handleLogin = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(true)
                return;
            }

            await signIn(data.token);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    };
    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/images/Eco.png')} style={styles.logo} />

            <Text style={styles.welcome}>Bienvenido de vuelta.</Text>

            {error && <Text style={{ color: 'red' }}>Nombre de usuario o contraseña incorrectos </Text>}

            <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
            <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={setPassword} />

            <TouchableOpacity>
                <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                <Text style={styles.loginText}>{loading ? 'Ingresando...' : 'INGRESAR'}</Text>
            </TouchableOpacity>

            <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>Or</Text>
                <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.googleButton}>
                <Svg width="24" height="24" viewBox="0 0 48 48">
                    <Path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3C33.3 32.4 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.2 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-3.5z" />
                    <Path fill="#e53935" d="M6.3 14.1l6.6 4.8C14.4 15.3 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.2 29.5 4 24 4c-7.5 0-14 4.1-17.7 10.1z" />
                    <Path fill="#4caf50" d="M24 44c5.2 0 10.2-2 13.8-5.2l-6.4-5.3c-2.1 1.6-4.7 2.5-7.4 2.5-5.2 0-9.7-3.3-11.3-8L6.1 33.9C9.8 39.9 16.3 44 24 44z" />
                    <Path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-1.2 3.2-3.5 5.9-6.7 7.5l6.4 5.3c5.1-4.6 8-11.4 8-19.3z" />
                </Svg>
                <Text>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupContainer} onPress={() => {
                router.replace('/(auth)/sign-up');
            }}>
                <Text>¿No tienes una cuenta? <Text style={styles.signup}>Sign up</Text></Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
    },
    backButton: {
        marginBottom: 20,
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
    },
    welcome: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    forgot: {
        color: '#555',
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#0a0a23',
        padding: 15,
        borderRadius: 6,
        alignItems: 'center',
    },
    loginText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    orText: {
        marginHorizontal: 10,
        color: '#888',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    googleButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '85%',
    },
    signupContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    signup: {
        color: '#000',
        fontWeight: 'bold',
    },
});
