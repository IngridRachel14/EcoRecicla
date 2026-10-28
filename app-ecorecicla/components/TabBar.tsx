import { useAuthSession } from '@/providers/AuthProvider';
import { useRouter, type Href } from 'expo-router';
import { BottomTabBarProps } from 'expo-router/js-tabs';
import { PlatformPressable, useLinkBuilder } from 'expo-router/react-navigation';
import { JSX } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import IconHome from './svg/home';
import IconLogout from './svg/logout';
import IconQR from './svg/qr';

export function TabBar({ state, descriptors }: BottomTabBarProps) {
    const { buildHref } = useLinkBuilder();
    const router = useRouter();
    const { signOut } = useAuthSession();

    const icon: Record<string, (props: any) => JSX.Element> = {
        index: (props) => <IconHome width={24} height={24} color={props.color} />,
        qr: (props) => <IconQR width={24} height={24} color={props.color} />,
    };

    return (
        <View style={styles.tabbar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    if (isFocused) return;
                    const href = buildHref(route.name, route.params);
                    if (href) router.navigate(href as Href);
                };

                return (
                    <PlatformPressable
                        key={route.name}
                        href={buildHref(route.name, route.params)}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        style={styles.tabbarItem}
                        android_ripple={{ color: 'transparent' }}
                    >
                        <View style={[isFocused && styles.iconWrapper]}>
                            {icon[route.name]({ color: '#ffffff' })}
                        </View>
                    </PlatformPressable>
                );
            })}

            {/* Botón de logout */}
            <TouchableOpacity style={styles.tabbarItem} onPress={signOut}>
                <View>
                    <IconLogout width={24} height={24} color="#ff6b6b" />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1c202f',
        marginHorizontal: 60,
        paddingVertical: 12,
        borderRadius: 45,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
        elevation: 5,
    },
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#318b60',
    },
});
