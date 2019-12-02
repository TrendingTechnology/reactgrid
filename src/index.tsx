import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { TestGrid } from "./TestGrid"
// import { GroupTestGrid } from './GroupTestGrid'
// DO NOT MOVE
// this index.tsx is required by react-scripts-ts
ReactDOM.render(
  <TestGrid />,
  // <GroupTestGrid />,
  document.getElementById('root') as HTMLElement
);