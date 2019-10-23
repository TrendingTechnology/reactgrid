import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Grid from "./test-grid"

// DO NOT MOVE
// this index.tsx is required by react-scripts-ts

ReactDOM.render(
  <Grid columns={10} rows={150} />,
  document.getElementById('root') as HTMLElement
);