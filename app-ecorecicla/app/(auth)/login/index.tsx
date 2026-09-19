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

            <Text style={styles.welcome}>Bienvenido</Text>

            {error && <Text style={{ color: 'red' }}>Nombre de usuario o contraseña incorrectos </Text>}

            <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
            <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={setPassword} />


            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                <Text style={styles.loginText}>{loading ? 'Ingresando...' : 'INGRESAR'}</Text>
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
