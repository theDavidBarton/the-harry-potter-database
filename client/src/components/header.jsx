import React, { Component, Fragment } from 'react'
import github from './../img/github.svg'

export default class Header extends Component {
  render() {
    return (
      <Fragment>
        <header className='container'>
          <div className='row'>
            <div className='col'>
              <a href='/' className='text-decoration-none text-dark'>
                <h1 className='d-none d-md-block display-4 py-4'>
                  🗲 The Harry Potter Database{' '}
                  <span role='img' aria-label='potter emoji'>
                    🤓
                  </span>
                </h1>
                <h1 className='d-md-none py-4'>🗲 The HPDb</h1>
              </a>
            </div>
            <div className='col-auto py-4'>
              <a href='https://github.com/theDavidBarton/the-harry-potter-database' target='_blank' rel='noopener noreferrer'>
                <img className='github' alt='github logo' src={github} />
              </a>
            </div>
          </div>
        </header>
      </Fragment>
    )
  }
}
