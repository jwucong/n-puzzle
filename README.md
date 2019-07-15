# n-puzzle
  > 正方形数字推盘、拼图小游戏
  
  
  
### 1. Instantiation 
  **new Puzzle(container[, options])**
  1. **container:** an HTMLElement or a css selector
  2. **options:** Object  
     - **options.width:** \<Number\> 宫格的边长，即行数或列数(width >= 3)
     - **options.blank:** \<Number|String|Boolean\> 白块模式
        - Number: 白块所在的位置（1 <= x <= width * width）
        - String: 唯一可接受的值是"random"，表示白块位置随机
        - Boolean: true相当于Number时的width * width位置，false则关闭白块模式
     - **options.image:** \<String|Array\> 拼图图片url列表(ArrayItem:String)
     - **options.grid:** \<HTMLElement|String\> 网格的容器an HTMLElement or a css selector
     - **options.start:** \<Function\> 开始游戏时触发，函数接受一个参数step=0表示当前步数
     - **options.solved:** \<Function\> 游戏完成时触发，函数接受一个参数step表示完成时所用步数
     - **options.swapStart:** \<Function\> 格子交换开始前触发，函数接受一个参数step表示当前所用步数
     - **options.swapEnd:** \<Function\> 格子交换结束后触发，函数接受一个参数step表示当前所用步数
     
     ```javascript
     // default options
     const defaultOption = {     
       width: 3,
       blank: true,
       image: '',
       grid: '.tile-list',
       start: null,
       solved: null,
       swapStart: null,
       swapEnd: null     
     }
     ```
 
### 2. 使用
   1. ES5: [请查看](src/index.html) 
   2. ES6: 直接岛入src/puzzle.js
    

