import React, { Fragment } from 'react'

export default function Loading() {
  return (
    <Fragment>
      <div class='col text-center loading'>
        <div
          class='spinner-grow text-light'
          role='status'></div>
        <span class='text-light'>loading data...</span>
      </div>
    </Fragment>
  )
}
