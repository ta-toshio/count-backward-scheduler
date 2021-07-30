import React from 'react'

export type Props = {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  useCssSize?: boolean
}

const sizes = {
  xs: {
    width: 16,
    height: 16,
  },
  sm: {
    width: 24,
    height: 24,
  },
  md: {
    width: 32,
    height: 32,
  },
  lg: {
    width: 40,
    height: 40,
  },
}

export const CircleLoadingIcon: React.FC<Props> = ({
  size = 'sm',
  ...otherProps
}) => (
  <svg
    width={sizes[size].width}
    height={sizes[size].height}
    viewBox="0 0 38 38"
    stroke="black"
    {...otherProps}
  >
    <g
      transform="translate(1 1)"
      strokeWidth={2}
      fill="none"
      fillRule="evenodd"
    >
      <circle strokeOpacity={0.5} cx={18} cy={18} r={18} />
      <path d="M36 18c0-9.94-8.06-18-18-18">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 18 18"
          to="360 18 18"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  </svg>
)
