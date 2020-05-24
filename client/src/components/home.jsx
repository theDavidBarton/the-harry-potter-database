import React, { Component, Fragment } from 'react'

export default class Home extends Component {
  state = {
    data: null,
    dataIsReady: false
  }

  componentDidMount() {
    this.getApi()
  }

  getApi = async () => {
    try {
      const response = await fetch('/api/1/books')
      const json = await response.json()
      console.log(json)
      this.setState({ data: json, dataIsReady: true })
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    const data = this.state.dataIsReady ? this.state.data : null
    return (
      <Fragment>
        {this.state.dataIsReady ? (
          <Fragment>
            {data.map(book => (
              <div key={book.id} className='col-md col-sm-4 py-3'>
                <a href={`/books/${book.id}`}>
                  <img
                    className='img-fluid'
                    key={book.id}
                    src={book.bookCovers[0].URL}
                    alt={'Artwork by ' + book.bookCovers[0].artist}
                  />
                </a>
              </div>
            ))}
          </Fragment>
        ) : null}
      </Fragment>
    )
  }
}
