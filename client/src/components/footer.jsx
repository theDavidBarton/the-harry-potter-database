import React, { Fragment } from 'react'

export default function Footer() {
  return (
    <Fragment>
      <footer className=''>
        <div className='container'>
          <div className='row p-4'>
            <div className='col'>
              <h2>Copyright</h2>
              <p>The Harry Potter Database is a non-commercial open source project.</p>
            </div>
            <div className='col'>
              <h2>Content</h2>
              <p>
                Harry Potter and all associated names are copyright J.K. Rowling and Warner Bros. Entertainment Inc. All data has
                been freely collected from open sources such as Harry Potter Wikia. The content available via the api is licensed
                under Attribution-NonCommercial-ShareAlike 4.0 International CC BY-NC-SA 4.0
              </p>
            </div>
            <div className='col'>
              <h2>Software</h2>
              <p>This project is open source and carries an MIT licence. Copyright (c) 2020 David Barton (theDavidBarton)</p>
            </div>
          </div>
        </div>
      </footer>
    </Fragment>
  )
}
