import Svg, { Path } from 'react-native-svg';

export default function IconLogout({ width = 24, height = 24, color = '#fff' }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M16 17l5-5-5-5"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M21 12H9"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}