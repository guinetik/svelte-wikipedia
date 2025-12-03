/**
 * Dark theme configuration for svelte-calendar Datepicker
 * Matches the app's dark glassmorphism aesthetic
 */
const DatePickerTheme = {
	calendar: {
		width: '320px',
		maxWidth: '100vw',
		legend: {
			height: '40px'
		},
		shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
		colors: {
			text: {
				primary: '#e5e7eb',
				highlight: '#ffffff'
			},
			background: {
				primary: '#0a0a0e',
				highlight: '#06b6d4',
				hover: '#1a1a24'
			},
			border: 'rgba(255, 255, 255, 0.1)'
		},
		font: {
			regular: '0.9em',
			large: '1.1em'
		},
		grid: {
			disabledOpacity: '.35',
			outsiderOpacity: '.5'
		}
	}
};

export default DatePickerTheme;
