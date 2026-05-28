import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const IconUser = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21a7 7 0 1 0-14 0m7-10a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
    />
  </Svg>
)
export default IconUser
