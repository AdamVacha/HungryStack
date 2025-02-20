import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
	name: 'my-custom-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `Quicksand`,
		'--theme-font-family-heading': `Quicksand`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '8px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '0 0 0',
		'--on-secondary': '255 255 255',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #fec967
		'--color-primary-50': '255 247 232', // #fff7e8
		'--color-primary-100': '255 244 225', // #fff4e1
		'--color-primary-200': '255 242 217', // #fff2d9
		'--color-primary-300': '255 233 194', // #ffe9c2
		'--color-primary-400': '254 217 149', // #fed995
		'--color-primary-500': '254 201 103', // #fec967
		'--color-primary-600': '229 181 93', // #e5b55d
		'--color-primary-700': '191 151 77', // #bf974d
		'--color-primary-800': '152 121 62', // #98793e
		'--color-primary-900': '124 98 50', // #7c6232
		// secondary | #145a60
		'--color-secondary-50': '220 230 231', // #dce6e7
		'--color-secondary-100': '208 222 223', // #d0dedf
		'--color-secondary-200': '196 214 215', // #c4d6d7
		'--color-secondary-300': '161 189 191', // #a1bdbf
		'--color-secondary-400': '91 140 144', // #5b8c90
		'--color-secondary-500': '20 90 96', // #145a60
		'--color-secondary-600': '18 81 86', // #125156
		'--color-secondary-700': '15 68 72', // #0f4448
		'--color-secondary-800': '12 54 58', // #0c363a
		'--color-secondary-900': '10 44 47', // #0a2c2f
		// tertiary | #FE5F55
		'--color-tertiary-50': '255 231 230', // #ffe7e6
		'--color-tertiary-100': '255 223 221', // #ffdfdd
		'--color-tertiary-200': '255 215 213', // #ffd7d5
		'--color-tertiary-300': '255 191 187', // #ffbfbb
		'--color-tertiary-400': '254 143 136', // #fe8f88
		'--color-tertiary-500': '254 95 85', // #FE5F55
		'--color-tertiary-600': '229 86 77', // #e5564d
		'--color-tertiary-700': '191 71 64', // #bf4740
		'--color-tertiary-800': '152 57 51', // #983933
		'--color-tertiary-900': '124 47 42', // #7c2f2a
		// success | #36f71d
		'--color-success-50': '225 254 221', // #e1fedd
		'--color-success-100': '215 253 210', // #d7fdd2
		'--color-success-200': '205 253 199', // #cdfdc7
		'--color-success-300': '175 252 165', // #affca5
		'--color-success-400': '114 249 97', // #72f961
		'--color-success-500': '54 247 29', // #36f71d
		'--color-success-600': '49 222 26', // #31de1a
		'--color-success-700': '41 185 22', // #29b916
		'--color-success-800': '32 148 17', // #209411
		'--color-success-900': '26 121 14', // #1a790e
		// warning | #ffd500
		'--color-warning-50': '255 249 217', // #fff9d9
		'--color-warning-100': '255 247 204', // #fff7cc
		'--color-warning-200': '255 245 191', // #fff5bf
		'--color-warning-300': '255 238 153', // #ffee99
		'--color-warning-400': '255 226 77', // #ffe24d
		'--color-warning-500': '255 213 0', // #ffd500
		'--color-warning-600': '230 192 0', // #e6c000
		'--color-warning-700': '191 160 0', // #bfa000
		'--color-warning-800': '153 128 0', // #998000
		'--color-warning-900': '125 104 0', // #7d6800
		// error | #ff1100
		"--color-surface-50": "246 243 247",
		"--color-surface-100": "225 217 226",
		"--color-surface-200": "204 191 205",
		"--color-surface-300": "184 165 184",
		"--color-surface-400": "163 139 163",
		"--color-surface-500": "142 113 142",
		"--color-surface-600": "121 97 122",
		"--color-surface-700": "100 81 102",
		"--color-surface-800": "79 66 81",
		"--color-surface-900": "58 50 61",
		"--color-surface-950": "37 34 41",
		"--color-surface-contrast-dark": "var(--color-surface-950)",
		"--color-surface-contrast-light": "var(--color-surface-50)",
		"--color-surface-contrast-50": "var(--color-surface-contrast-dark)",
		"--color-surface-contrast-100": "var(--color-surface-contrast-dark)",
		"--color-surface-contrast-200": "var(--color-surface-contrast-dark)",
		"--color-surface-contrast-300": "var(--color-surface-contrast-dark)",
		"--color-surface-contrast-400": "var(--color-surface-contrast-dark)",
		"--color-surface-contrast-500": "var(--color-surface-contrast-light)",
		"--color-surface-contrast-600": "var(--color-surface-contrast-light)",
		"--color-surface-contrast-700": "var(--color-surface-contrast-light)",
		"--color-surface-contrast-800": "var(--color-surface-contrast-light)",
		"--color-surface-contrast-900": "var(--color-surface-contrast-light)",
		"--color-surface-contrast-950": "var(--color-surface-contrast-light)"
	  },
};
