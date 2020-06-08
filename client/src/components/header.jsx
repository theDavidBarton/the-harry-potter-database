import React, { Fragment } from 'react'
import Search from './search'
import github from './../img/github.svg'

export default function Header() {
  return (
    <Fragment>
      <header className='container'>
        <div className='row pt-4'>
          <div className='col'>
            <a href='/' className='text-decoration-none text-dark'>
              <h1 className='d-none d-md-block display-4'>
                🗲 The Harry Potter Database{' '}
                <span role='img' aria-label='potter emoji'>
                  🤓
                </span>
              </h1>
              <h1 className='d-md-none'>🗲 The HPDb</h1>
            </a>
          </div>
          <div className='col-auto'>
            <a href='https://github.com/theDavidBarton/the-harry-potter-database' target='_blank' rel='noopener noreferrer'>
              <img className='github' alt='github logo' src={github} />
            </a>
          </div>
        </div>
        <div className='row justify-content-md-center'>
          <div className='col-12 col-md-5 align-self-end order-1 order-md-0 pb-4'>
            <Search />
          </div>
        </div>
      </header>
    </Fragment>
  )
}
