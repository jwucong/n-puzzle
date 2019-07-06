export const getType = value => {
	return Object.prototype.toString.call(value).slice(8, -1);
};

export const kebabCase = (str, separator = '-') => {
	const reg = /[A-Z]/g;
	return str.replace(reg, (m, i) => {
		return (i > 0 ? separator + m : m).toLowerCase();
	});
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
	return flag;
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

export const hasClass = (el, className) => {
	return el.classList.contains(className);
};

export const addClass = (el, className) => {
	if (!hasClass(el, className)) {
		el.classList.add(className);
	}
};

export const removeClass = (el, className) => {
	if (hasClass(el, className)) {
		el.classList.remove(className);
	}
};
