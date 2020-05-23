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
      <div className='col'>
        {this.state.dataIsReady ? (
          <Fragment>
            <h1>{data.title}</h1>
            <h2 className='text-warning'>by {data.author}</h2>
            <h3>Summary</h3>
            <p>
              The book {data.title} written by {data.author} was published in the UK on {data.publishDate['UK']} and on{' '}
              {data.publishDate['UK']} in the US.
              <br />
              The main plot takes place in {data.plotTakePlaceYears[0]} and {data.plotTakePlaceYears[1]}.
            </p>
            {data.bookCovers.map(cover => (
              <img key={cover.id} src={cover.URL} alt={'Artwork by ' + cover.artist} />
            ))}
          </Fragment>
        ) : null}
      </div>
    )
  }
}
