import React, { Component, Fragment } from 'react'

class Page404 extends Component {
  render() {
    return (
      <Fragment>
        <main className='bg-dark text-warning'>
          <section className='container text-center'>
            <div className='row justify-content-md-center'>
              <h1 className='col display-2 py-5'>404 not found</h1>
            </div>
          </section>
        </main>
      </Fragment>
    )
  }
}
export default Page404
