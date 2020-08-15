# React 新特性 Hooks 重构去哪儿网火车票 PWA

该项目利用 [React](https://reactjs.org)、[Redux](https://redux.js.org/)等技术重构去哪儿网火车票，重度使用 [Hooks](https://reactjs.org/docs/hooks-intro.html) 重写视图组件。

## 用法

```sh
npm start
```

## useMemo、useCallback 用法

- 都是依赖数组内的值发生变化时,才会触发第一个参数的函数
- useMemo
  - 第一个参数为一个工厂函数，返回一个缓存的值，也就是仅当重新渲染时数组中的值发生改变时，回调函数才会重新计算缓存数据，这可以使得我们避免在每次重新渲染时都进行复杂的数据计算
  - 第二个参数为一个依赖项数组，只有依赖项中的数据发生改变时才重新计算值，用法同 useEffect 的依赖项数组
- useCallback

  - 第一个参数传入额回调函数就是要缓存的函数。
  - 第二个参数只用于指定需要判断是否变化的参数，并不会作为形参传入回调函数。**建议回调函数中使用到的变量都应该在数组中列出**
  - 每次渲染都是传入同一个句柄,这样组件就不会做重复的渲染

## useState

- 传入一个函数，该函数只在第一次渲染时才会被调用
- 传入函数可以延迟变量的初始化？

## useRef

- 可以跨越组件渲染周期保存数据,并且不会触发重新渲染

## useReducer

- useReducer 和 useSatet 一样都是用来声明 state 的方法的。声明的方式不同
  - 第一个参数为 reducer 函数
  - 第二个参数是 state 的初始值
  - 第三个参数是一个函数,其函数的参数为第二个参数(传入第三个参数可以得到异步初始化的 state)
  - 解构的返回值第一个参数是 state。第二个参数为 dispatch 函数
- 使用场景:复杂的 state 逻辑中可以用 useReducer 优化

## memo 用法

- 对于只有纯粹属性输入的组件(数据来源于 props),一般都可以用 memo 来优化重复渲染性能

## 自定义 hooks 函数的注意事项

- 保证不同的渲染周期中,调用的 hooks 的次序和数量都是一致

## 知识点

- 多个函数组件之间嵌套的重复渲染问题以及性能优化(memo 的使用)
- 条件渲染内部函数的作用
  ```jsx
  const isError = () => {
    if(true) return <div>true</div>
    if(fasle) return <div>fasle</div>
    reutrn <div>error</div>
  }
  ```
- useState 的作用、异步初始化 state
- 如何通过监控传入属性的 props 的变化,来更新 state 的状态
  - 通过 useRef 缓存上一次的值。当传入的 props 值发生变化时,取出上一次的值与当前 props 的值进行比较,对比是否需要更新 state 的状态
- 异步组件加载失败,如何解决
- 使用内部函数来创建 JSX,在性能上是有缺陷的？为什么？
- renderProps 如何使用?它的使用场景
- mapDispatchToProps 和 bindActionCreators 的使用区别

## 报错搜集

- Error: Rendered more hooks than during the previous render
  - 由于 2 处渲染过程中,经历的 hook 函数不匹配导致的
  - 解决:查看当前渲染组件中是否存在过早 return jsx

## react 中对副作用的定义,react 中什么是副作用？

- 非 react 自身的事

- 发送 ajax、修改 dom 节点。还有....？？
- 操作了组件上下文之外的东西也属于副作用的一种

## 项目细节

- package.json 的 script 中增加格式化验证
  ```shell
      "format": "prettier src/**/*.{js,jsx,css,md} --write && eslint src/**/*.{jsx,js} --fix"
  ```
- create-react-app 生成的项目只遵循了 eslint config `react-app`的规则。

  - 通过配置`eslintConfig`中的`extends`可以增加新的集合。
    ```json
    "eslintConfig": {
        "extends": [
          "eslint:recommended",
          "react-app"
        ],
    }
    ```
  - 除了引入`eslint`中的规则外。也可以复写规则

  ```json
  "eslintConfig": {
    ....
    "rules": {
      "react/jsx-indent": [
        "error",
        2
      ]
    }
  }
  ```

  - 使用`git hooks`代码提交时自动格式化(即执行 git 特定操作时,自动执行其他配置好的命令)
    - 使用`npm i husky lint-staged -D`其中`husky`就是用来自动配置`git hooks`的,而`lint-staged`则是被`husky`调用专门针对被改动的文件执行操作的
    ```json
    //  package.json`直接定义
    "husky": {
      "hooks": {
        "pre-commit": "lint-staged" // 提交时执行
      }
    },
    "lint-staged": {
      "*.{js,jsx}": [ // 后缀名相同的文件发生改变执行
        "prettier --write",
        "eslint --fix",
        "git add"
      ],
      "*.{css,md}": [ // 后缀名相同的文件发生改变执行
        "prettier --write",
        "git add"
      ]
    },
    ```
    - **prettier** 配置参考
      > https://prettier.io/docs/en/options.html#prose-wrap

## 线上环境打包问题

- 代码体积

  - 使用`npm i webpack-bundle-analyzer -D`分析器。并在`webpack.config.js`引入插件,在 `plugins` 中实例化

  ```javascript
  ...
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
  ...
  plugins:[
    ...
    // process.env.GENERATE_BUNDLE_ANALYZER 环境变量匹配才允许生成查看插件大小的文件和端口
     process.env.GENERATE_BUNDLE_ANALYZER === 'true' && new BundleAnalyzerPlugin({
       openAnalyzer: false, // 是否打开 8888查看所下载插件大小
       analyzerMode: 'static', // 只生成静态的html文件
       }),
    ...
  ]

  ```

- 线上环境,静态资源路径(可将静态资源托管到其他的服务器上)
  - 可通过命令配置静态资源输出的地址 `PUBLIC URL =https://www.cdn.com npm run build`
  - 通过配置`webpack.config.js`中的`publicPath`
  ```javascrit
  publicPath:'production' !== process.env.NODE_ENV ||
              'true' === process.env.USE_LOCAL_FILES
                  ? '/'
                  : 'https://www.cdn.com/',
  ```
- `serviceWorker`的使用
  - 入口JS文件中
  ```javascript
    import * as serviceWorker from '../serviceWorker';
    if ('production' === process.env.NODE_ENV) {
      // 生产环境
      serviceWorker.register();
    } else {
      serviceWorker.unregister();
    }
  ```
