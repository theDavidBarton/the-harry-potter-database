import React, { Component, Fragment } from 'react'

export default class Books extends Component {
  state = {
    data: null,
    dataIsReady: false
  }

  componentDidMount() {
    this.getApi()
  }

  getApi = async () => {
    try {
      const response = await fetch(`/api/1/books/${this.props.match.params.id ? this.props.match.params.id : 1}`)
      const json = await response.json()
      console.log(json)
      this.setState({ data: json, dataIsReady: true })
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    const data = this.state.dataIsReady ? this.state.data[0] : null
    return (
      <Fragment>
        {this.state.dataIsReady ? (
          <Fragment>
            <div className='col'>
              <img
                className='img-fluid'
                key={data.book_covers[0].id}
                src={data.book_covers[0].URL}
                alt={'Artwork by ' + data.book_covers[0].artist}
              />
            </div>
            <div className='col-md-9'>
              <h1>{data.title}</h1>
              <h2 className='text-warning'>by {data.author}</h2>
              <h3>Summary</h3>
              <p>
                The book {data.title} written by {data.author} was published in the UK on {data.publish_date['UK']} and on{' '}
                {data.publish_date['UK']} in the US.
                <br />
                The main plot takes place in {data.plot_take_place_years[0]} and {data.plot_take_place_years[1]}.
              </p>
              <h3>Response preview</h3>
              <code>
                <kbd>GET</kbd> {window.location.href}
              </code>
              :
              <pre className='pre-scrollable'>
                <code>{JSON.stringify(data, undefined, 2)}</code>
              </pre>
            </div>
          </Fragment>
        ) : null}
      </Fragment>
    )
  }
}
