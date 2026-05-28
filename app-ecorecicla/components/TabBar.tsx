import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';
import { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import IconHome from './svg/home';
import IconQR from './svg/qr';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { buildHref } = useLinkBuilder();
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
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <PlatformPressable
                        key={route.name}
                        href={buildHref(route.name, route.params)}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabbarItem}
                        android_ripple={{ color: 'transparent' }}
                    >
                        <View style={[isFocused && styles.iconWrapper]}>
                            {
                                icon[route.name]({
                                    color: isFocused ? "#ffffff" : "#ffffff"
                                })
                            }
                        </View>

                    </PlatformPressable>
                );
            })}
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
        elevation: 5
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
    }
});
