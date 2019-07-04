export const getType = value => {
	return Object.prototype.toString.call(value).slice(8, -1);
};

export const isElement = value => {
	const reg = /^HTML(.+)Element$/;
	const match = reg.exec(getType(value));
	return match && match[1] !== 'Unknown';
};

export const find = (selector, scope) => {
	if (isElement(selector)) {
		return selector;
	}
	return (scope || document).querySelector(selector);
};

export const kebabCase = (str, separator = '-') => {
	const reg = /[A-Z]/g;
	return str.replace(reg, (m, i) => {
		return (i > 0 ? separator + m : m).toLowerCase();
	});
};

export const setStyle = (element, style) => {
	for (const key in style) {
		if (Object.prototype.hasOwnProperty.call(style, key)) {
			const prop = kebabCase(key);
			element.style[prop] = style[key];
		}
	}
};

export const random = (min, max) => {
	return Math.round(Math.random() * (max - min) + min);
};

export const swap = (list, i, j) => {
	const temp = list[i];
	list[i] = list[j];
	list[j] = temp;
	return list;
};

export const isEven = value => value % 2 === 0;

export const shuffle = array => {
	const list = array.slice();
	let current = list.length;
	while (current--) {
		swap(list, current, Math.floor(Math.random() * current));
	}
	return list;
};

export const getInversions = array => {
	const size = array.length;
	let count = 0;
	for (let i = 0; i < size - 1; i++) {
		for (let j = i + 1; j < size; j++) {
			if (array[i] > array[j]) {
				count++;
			}
		}
	}
	return count;
};

export const solvable = (array, n, blankRowCountingFromBottom) => {
	const inversions = getInversions(array);
	const flag = isEven(inversions);
	if (isEven(n)) {
		return isEven(blankRowCountingFromBottom) ? !flag : flag;
	}
	return !flag;
};

export const toSolvable = shuffleList => {
	const list = shuffleList.slice();
	const size = list.length;
	for (let i = 0; i < size - 1; i++) {
		for (let j = i + 1; j < size; j++) {
			if (list[i] < list[j]) {
				return swap(list, i, j);
			}
		}
	}
	return swap(list, 0, 1);
};
