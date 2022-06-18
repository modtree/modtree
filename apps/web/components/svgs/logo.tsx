import * as React from 'react'
import { SVGProps } from 'react'

const ModtreeLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 87 87"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      strokeMiterlimit: 2,
    }}
    {...props}
  >
    <g transform="matrix(.11943 0 0 .11943 -8.919 -21.733)">
      <path
        style={{
          fill: 'none',
        }}
        d="M74.674 181.969h728.444v728.444H74.674z"
      />
      <clipPath id="a">
        <path d="M74.674 181.969h728.444v728.444H74.674z" />
      </clipPath>
      <g clipPath="url(#a)">
        <path
          style={{
            fill: '#fff',
            fillOpacity: 0,
          }}
          fill="none"
          d="M5.574 3.11h19.612v13.493H5.574z"
          transform="matrix(37.143 0 0 53.9871 -132.376 14.047)"
        />
        <path
          d="m586.189 481.416 233.208 403.928H352.981l233.208-403.928Z"
          style={{
            fill: 'url(#b)',
          }}
          transform="translate(-39.903 -66.964) scale(.8168)"
        />
      </g>
    </g>
    <defs>
      <linearGradient
        id="b"
        x1={0}
        y1={0}
        x2={1}
        y2={0}
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(316.904 750.701) scale(538.57)"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#f472b5',
            stopOpacity: 1,
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#fb923c',
            stopOpacity: 1,
          }}
        />
      </linearGradient>
    </defs>
  </svg>
)

export default ModtreeLogo
