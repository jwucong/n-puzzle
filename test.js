const swap = (list, i, j) => {
  const temp = list[i]
  list[i] = list[j]
  list[j] = temp
  return list
}

const shuffle = array => {
  const list = array.slice()
  let current = list.length;
  while (current--) {
    swap(list, current, Math.floor(Math.random() * current))
  }
  return list;
}

var a = [0, 1, 2, 3, 4, 5, 6, 7, 8]

var s = shuffle(a)
console.log(a)
console.log(s)

// console.log(0.999 * 8)
