/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./src/**/*.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
    	extend: {
    		colors: {
    			oceanBlue: {
    				'50': '#EBEFFF',
    				'100': '#D6DFFF',
    				'200': '#B3C3FF',
    				'300': '#8AA3FF',
    				'400': '#6687FF',
    				'500': '#3E68FF',
    				'600': '#0037FF',
    				'700': '#0029BD',
    				'800': '#001C80',
    				'900': '#000D3D'
    			},
    			emeraldGreen: {
    				'50': '#EDFDF5',
    				'100': '#DAFBEB',
    				'200': '#BAF8DA',
    				'300': '#95F4C6',
    				'400': '#70F0B2',
    				'500': '#4DEC9F',
    				'600': '#18E280',
    				'700': '#12AA61',
    				'800': '#0C7341',
    				'900': '#06371F'
    			},
    			simplyRed: {
    				'50': '#FEECEC',
    				'100': '#FDD8D8',
    				'200': '#FBB6B6',
    				'300': '#F99090',
    				'400': '#F76E6E',
    				'500': '#F54848',
    				'600': '#F20D0D',
    				'700': '#B30A0A',
    				'800': '#790707',
    				'900': '#3A0303'
    			},
    			gothamBlack: {
    				'50': '#E8E8E8',
    				'100': '#D1D1D1',
    				'200': '#A3A3A3',
    				'300': '#787878',
    				'400': '#4A4A4A',
    				'500': '#1C1C1C',
    				'600': '#171717',
    				'700': '#121212',
    				'800': '#0A0A0A',
    				'900': '#050505'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")]
}
