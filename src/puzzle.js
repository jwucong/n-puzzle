import './puzzle.scss';
import bgImage from './pic.jpg';

import {
	getType,
	kebabCase,
	hasClass,
	addClass,
	removeClass,
	swap,
	random,
	shuffle,
	solvable,
	toSolvable
} from './utils';

const isElement = value => {
	const reg = /^HTML(.+)Element$/;
	const match = reg.exec(getType(value));
	return match && match[1] !== 'Unknown';
};

const setStyle = (element, style) => {
	for (const key in style) {
		if (Object.prototype.hasOwnProperty.call(style, key)) {
			const prop = kebabCase(key);
			element.style[prop] = style[key];
		}
	}
};

const tileClassName = 'tile-item';
const activeTileClassName = 'tile-item-active';
const blankTileClassName = 'tile-item-blank';
const images = []
for (let i = 0; i <= 3; i++) {
  images.push(require(`./puzzle${i}.jpg`))
}

class Puzzle {
	constructor(container, options) {
		const defaultOptions = {
			width: 4,
			blank: 2,
      blnakBackground: '#f7f7f7',
			images: images,
			grid: '.tile-list',
			start: null,
			solved: null,
			swapStart: null,
			swapEnd: null
		};
		const conf = Object.assign({}, defaultOptions, options);
		const width = conf.width;
		const square = width * width;
		this.options = conf;
		this.container = this.find(container);
		this.grid = this.find(conf.grid);
		this.blankModel = getBlankModel(conf.blank, width);
		this.initialList = [...new Array(square)].map((item, i) => i);
		this.shuffleList = [];
		this.tileList = [];
		this.tileWidth = 0;
		this.tileHeight = 0;
		this.stepCount = 0;
		this.imageIndex = 0
		this.currentImage = conf.images[0] || ''
		this.layout();
	}

	find(selector, scope) {
		if (isElement(selector)) {
			return selector;
		}
		const el = scope || this.container || document;
		return el.querySelector(selector);
	}

	layout() {
		const grid = this.grid;
		const conf = this.options;
		const width = parseInt(conf.width, 10);
		const tileWidth = Math.floor(grid.offsetWidth / width);
		const tileHeight = tileWidth;
		const fragment = document.createDocumentFragment();
		const image = this.currentImage;
		const initialStyle = {
			width: tileWidth + 'px',
			height: tileHeight + 'px',
			lineHeight: tileHeight + 'px'
		};
		if (image) {
			initialStyle.backgroundImage = `url("${image}")`;
		}

		this.tileList = [];
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		grid.style.width = tileWidth * width + 'px';
		grid.style.height = tileHeight * width + 'px';

		this.initialList.forEach(item => {
			const points = getPoints(item, width);
			const tile = document.createElement('div');
			const top = points.row * tileHeight;
			const left = points.column * tileWidth;
			let innerText = item + 1;
			let style = Object.assign({}, initialStyle, {
				top: top + 'px',
				left: left + 'px',
				backgroundPosition: -left + 'px ' + -top + 'px'
			});

			if (this.blankModel && item === width * width - 1) {
				tile.classList.add(blankTileClassName);
				innerText = '';
				style.background = conf.blnakBackground
			}

			if (!image) {
				tile.innerText = innerText;
			}

			setStyle(tile, style);
			tile.classList.add(tileClassName);
			tile.setAttribute('index', item);
			this.tileList.push(tile);
			fragment.appendChild(tile);
		});

		grid.innerHTML = '';
		grid.appendChild(fragment);
	}

	start() {
		this.stepCount = 0;
		const conf = this.options;
		const n = conf.width;
		const tileWidth = this.tileWidth;
		const tileHeight = this.tileHeight;
		const blank = this.blankModel;
		const initialList = this.initialList;
		let shuffleList;
		if (blank) {
			const order = blank === 'random' ? random(0, n * n - 1) : blank - 1;
			const items = initialList.filter(item => item !== order);
			const blankRowCountingFromBottom = n - Math.floor(order / n);
			const list = shuffle(items);
			const isSolvable = solvable(list, n, blankRowCountingFromBottom);
			const solvableList = isSolvable ? list : toSolvable(list);
			shuffleList = solvableList.concat(order);
		} else {
			shuffleList = shuffle(initialList);
		}
		this.shuffleList = shuffleList;
		this.tileList.forEach((tile, index) => {
			this.setPosition(tile, index);
		});
		this.destroy();
		this._gridClickHandler = tileClickHandler(this);
		this.grid.addEventListener('click', this._gridClickHandler, false);
		exec.call(this, conf.start, this.stepCount);
	}

	reset() {
	  this.destroy()
    this.layout()
  }

	changeImage() {
	  const images = this.options.images
    const lastIndex = images.length - 1
    const currentIndex = this.imageIndex
    const nextIndex = currentIndex + 1
    const index = nextIndex > lastIndex ? 0 : nextIndex
    this.imageIndex = index
    this.currentImage = images[index]
    this.layout()
  }

	setPosition(el, index) {
		const order = this.shuffleList[index];
		const points = getPoints(order, this.options.width);
		const tileWidth = this.tileWidth;
		const tileHeight = this.tileHeight;
		el.style.top = points.row * tileHeight + 'px';
		el.style.left = points.column * tileWidth + 'px';
	}

	isNeighbor(fromIndex, toIndex) {
		const width = this.options.width;
		const shuffleList = this.shuffleList;
		const order1 = shuffleList[fromIndex];
		const order2 = shuffleList[toIndex];
		const p1 = getPoints(order1, width);
		const p2 = getPoints(order2, width);
		const r1 = p1.row;
		const r2 = p2.row;
		const c1 = p1.column;
		const c2 = p2.column;
		const hNeighbor = r1 === r2 && Math.abs(c1 - c2) === 1;
		const vNeighbor = c1 === c2 && Math.abs(r1 - r2) === 1;
		return hNeighbor || vNeighbor;
	}

	swapTile(fromIndex, toIndex) {
		const fromTile = this.tileList[fromIndex];
		const toTile = this.tileList[toIndex];
		this.setPosition(fromTile, toIndex);
		this.setPosition(toTile, fromIndex);
		swap(this.shuffleList, fromIndex, toIndex);
	}

	destroy() {
		const handler = this._gridClickHandler;
		if (handler) {
			this.grid.removeEventListener('click', handler);
			this._gridClickHandler = null;
		}
	}
}

function getPoints(index, width) {
	const row = Math.floor(index / width);
	const column = index % width;
	return { row, column };
}

function getBlankModel(blank, width) {
	const s = width * width;
	if (typeof blank === 'boolean') {
		return blank ? s : false;
	}
	if (blank === 'random') {
		return blank;
	}
	const n = parseInt(blank, 10);
	return n > 0 && n <= s ? n : false;
}

function exec(callback) {
	const args = [].slice.call(arguments, 1);
	typeof callback === 'function' && callback.apply(this, args);
}

function tileClickHandler(instance) {
	const initialList = instance.initialList;
	const shuffleList = instance.shuffleList;
	const blankModel = instance.blankModel;
	const conf = instance.options;
	const initialStr = initialList.join('');
	let solved = false;
	let moving = false;
	return function handler(event) {
		const that = this;
		const el = event.target;
		const started = initialList.length === shuffleList.length;
		const isTile = hasClass(el, tileClassName);
		let fromIndex,
			toIndex,
			activeTile = null;
		if (!isTile || !started || solved || moving) {
			return false;
		}
		if (blankModel) {
			if (hasClass(el, blankTileClassName)) {
				return false;
			}
			activeTile = instance.find.call(instance, '.' + blankTileClassName);
		} else {
			activeTile = instance.find.call(instance, '.' + activeTileClassName);
			if (!activeTile) {
				return addClass(el, activeTileClassName);
			}
			if (el === activeTile) {
				return removeClass(el, activeTileClassName);
			}
		}
		fromIndex = activeTile.getAttribute('index');
		toIndex = el.getAttribute('index');
		if (!instance.isNeighbor(fromIndex, toIndex)) {
			return removeClass(activeTile, activeTileClassName);
		}
		moving = true;
		el.addEventListener(
			'transitionend',
			function transitionEnd() {
				moving = false;
				instance.stepCount++;
				removeClass(activeTile, activeTileClassName);
				exec.call(instance, conf.swapEnd, instance.stepCount);
				if (solved) {
					that.removeEventListener('click', handler);
					exec.call(instance, conf.solved, instance.stepCount);
				}
				this.removeEventListener('transitionend', transitionEnd);
			},
			false
		);
		exec.call(instance, conf.swapStart, instance.stepCount);
		instance.swapTile(fromIndex, toIndex);
		solved = initialStr === shuffleList.join('');
	};
}

export default Puzzle;
