import React, { Component, Fragment } from 'react'
import github from './../img/github.svg'

export default class Header extends Component {
  render() {
    return (
      <Fragment>
        <header className=''>
          <div className='container'>
            <h1 className='row display-4 py-4'>
              🗲 The Harry Potter Database 🗲
              <a href='https://github.com/theDavidBarton/' target='_blank' rel='noopener noreferrer'>
                <img className='github' alt='github logo' src={github} />
              </a>
            </h1>
          </div>
        </header>
      </Fragment>
    )
  }
}
