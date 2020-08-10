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

## memo 用法

- 对于只有纯粹属性输入的组件,一般都可以用 memo 来优化重复渲染性能

## 知识点

- 多个函数组件之间嵌套的重复渲染问题以及性能优化(memo 的使用)
- 条件渲染内部函数的作用
  ```jsx
  const isError = () {
    if(true) return <div>true</div>
    if(fasle) return <div>fasle</div>
    reutrn <div>error</div>
  }
  ```
