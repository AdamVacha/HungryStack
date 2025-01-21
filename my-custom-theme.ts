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
		'--color-error-50': '255 219 217', // #ffdbd9
		'--color-error-100': '255 207 204', // #ffcfcc
		'--color-error-200': '255 196 191', // #ffc4bf
		'--color-error-300': '255 160 153', // #ffa099
		'--color-error-400': '255 88 77', // #ff584d
		'--color-error-500': '255 17 0', // #ff1100
		'--color-error-600': '230 15 0', // #e60f00
		'--color-error-700': '191 13 0', // #bf0d00
		'--color-error-800': '153 10 0', // #990a00
		'--color-error-900': '125 8 0', // #7d0800
		// surface | #9e948a
		'--color-surface-50': '240 239 237', // #f0efed
		'--color-surface-100': '236 234 232', // #eceae8
		'--color-surface-200': '231 228 226', // #e7e4e2
		'--color-surface-300': '216 212 208', // #d8d4d0
		'--color-surface-400': '187 180 173', // #bbb4ad
		'--color-surface-500': '158 148 138', // #9e948a
		'--color-surface-600': '142 133 124', // #8e857c
		'--color-surface-700': '119 111 104', // #776f68
		'--color-surface-800': '95 89 83', // #5f5953
		'--color-surface-900': '77 73 68' // #4d4944
	}
};
