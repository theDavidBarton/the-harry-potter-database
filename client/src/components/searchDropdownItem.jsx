import React, { Fragment } from 'react'

export default function SearchDropdownItem({ result }) {
  return (
    <Fragment>
      <a key={result.id + '_a'} href={`/characters/${result.id}`} className='text-decoration-none'>
        <li key={result.id + '_li'} className='my-1 text-nowrap d-inline-block text-truncate result-list-width'>
          <span key={result.id + '_span'} className='mx-1'>
            {result.gender === 'Female' ? '♀ ' : '♂ '}
            {result.name}
          </span>
        </li>
      </a>
    </Fragment>
  )
}

export function SearchDropdownItemNoResult() {
  return (
    <li className='my-1 text-nowrap d-inline-block text-truncate result-list-width'>
      <span className='mx-1'>no results found...</span>
    </li>
  )
}
