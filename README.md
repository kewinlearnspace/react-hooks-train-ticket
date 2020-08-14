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

## 报错搜集

- Error: Rendered more hooks than during the previous render
  - 由于 2 处渲染过程中,经历的 hook 函数不匹配导致的
  - 解决:查看当前渲染组件中是否存在过早 return jsx

## react 中对副作用的定义,react 中什么是副作用？

- 发送 ajax、修改 dom 节点。还有....？？
- 操作了组件上下文之外的东西也属于副作用的一种
