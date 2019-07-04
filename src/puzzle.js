import './puzzle.scss';

import { find, setStyle, random, shuffle } from './utils';

function exec(callback) {
	const args = slice.call(arguments, 1);
	typeof callback === 'function' && callback.apply(this, args);
}

class Puzzle {
	constructor(container, options) {
		const defaultOptions = {
			width: 3, // remarks: n * n puzzle, n >= 3, width = n
			blank: false, // <Number:index> | <String:random> | <Boolean:false> true as 8
			image: '',
			blankBackground: '#f7f7f7',
			start: null,
			success: null,
			exchangeStart: null,
			exchangeEnd: null
		};
		this.options = Object.assign({}, defaultOptions, options);
		this.container = this.find(container);
		this.grid = this.find('.tile-list');
		this.initialList = [];
		this.shuffleList = [];
		this.tileList = [];
		this.tileWidth = 0;
		this.tileHeight = 0;
		this.stepCount = 0;
		this.layout();
	}

	find(selector) {
		return find(selector, this.container || document);
	}

	layout() {
		const grid = this.grid;
		const conf = this.options;
		const isBlankModel =
			parseInt(conf.blank, 10) + 1 > 0 || conf.blank === 'random';
		const width = parseInt(conf.width, 10);
		const tileWidth = Math.floor(grid.offsetWidth / width);
		const tileHeight = tileWidth;
		const fragment = document.createDocumentFragment();
		const initialStyle = {
			width: tileWidth + 'px',
			height: tileHeight + 'px',
			lineHeight: tileHeight + 'px',
			backgroundImage: `url("${conf.image}")`
		};

		this.tileList = [];
		this.initialList = [];
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		grid.style.width = tileWidth * width + 'px';
		grid.style.height = tileHeight * width + 'px';

		for (let row = 0; row < width; row++) {
			for (let column = 0; column < width; column++) {
				const order = row * width + column;
				const tile = document.createElement('div');
				const top = row * tileHeight;
				const left = column * tileWidth;
				let text = order + 1;
				let style = Object.assign({}, initialStyle, {
					top: top + 'px',
					left: left + 'px',
					backgroundPosition: -left + 'px ' + -top + 'px'
				});
				if (isBlankModel && order === width * width - 1) {
					style.background = conf.blankBackground;
					tile.classList.add('tile-item-blank');
					text = '';
				}
				tile.classList.add('tile-item');
				tile.innerText = text;
				setStyle(tile, style);
				this.initialList.push(order);
				this.tileList.push(tile);
				fragment.appendChild(tile);
			}
		}

		grid.innerHTML = '';
		grid.appendChild(fragment);
	}

	start() {
		const conf = this.options;
		const width = conf.width;
		const shuffleList = shuffle(this.initialList);
		if (!conf.blank) {
			this.shuffleList = shuffleList;
		} else {
		}
		const blank = parseInt(conf.blank, 10) || 'random';
		const blankIndex =
			blank === 'random' ? random(0, width * width - 1) : blank - 1;
		const blankRowCountingFromBottom = width - Math.floor(blankIndex / width);
		// TODO shuffle when is blank model and check solvable
	}
}

export default Puzzle;
