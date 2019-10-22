import * as React from 'react'
import * as ReactDOM from 'react-dom'
import DataChangingSample from "./dev-env/DataChangingSample"
// TODO how to remove this?
import "core-js/stable";

// DO NOT MOVE
// this index.tsx is required by react-scripts-ts
console.log('render')
ReactDOM.render(
  <DataChangingSample />,  // replace with DevGrid
  document.getElementById('root') as HTMLElement
);