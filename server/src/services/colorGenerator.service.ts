export const getRandomColor = () => {
	const colorArr = [
		'#FF6633',
		'#FFB399',
		'#FF33FF',
		'#ebeb54',
		'#00B3E6',
		'#E6B333',
		'#3366E6',
		'#e9e94e',
		'#7ffa7f',
		'#B34D4D',
		'#FF99E6',
		'#CCFF1A',
		'#FF1A66',
		'#E6331A',
		'#33FFCC',
		'#B366CC',
		'#4D8000',
		'#B33300',
		'#CC80CC',
		'#991aff',
		'#e666ff',
		'#259cf7',
		'#0db498',
		'#E666B3',
		'#33991A',
		'#00E680',
		'#E6FF80',
		'#1AFF33',
		'#FF3380',
		'#CCCC00',
		'#66E64D',
		'#4D80CC',
		'#9900B3',
		'#E64D66',
		'#4DB380',
		'#FF4D4D',
		'#99E6E6',
		'#6666FF',
	];
	const index = Math.round(Math.random() * 38);
	return colorArr[index];
};
