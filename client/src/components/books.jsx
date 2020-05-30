import React, { Component, Fragment } from 'react'

export default class Books extends Component {
  state = {
    data: null,
    charactersData: null,
    dataIsReady: false,
    characterSectionHeight: '133px'
  }

  componentDidMount() {
    this.getApi()
  }

  getApi = async () => {
    try {
      const response = await fetch(`/api/1/books/${this.props.match.params.id ? this.props.match.params.id : 1}`)
      const json = await response.json()
      this.setState({ data: json })
    } catch (e) {
      console.error(e)
    }
    try {
      const response = await fetch('/api/1/characters/all')
      const json = await response.json()
      this.setState({ charactersData: json, dataIsReady: true })
    } catch (e) {
      console.error(e)
    }
  }

  setCharacterSectionHeight = () => {
    this.setState({ characterSectionHeight: 'auto' })
  }

  setBackCharacterSectionHeight = () => {
    this.setState({ characterSectionHeight: '133px' })
  }

  render() {
    const data = this.state.dataIsReady ? this.state.data[0] : null
    const characters = this.state.dataIsReady ? this.state.charactersData : null
    return (
      <Fragment>
        {this.state.dataIsReady ? (
          <Fragment>
            <div className='col'>
              <figure className='figure'>
                <img
                  className='img-fluid'
                  key={data.book_covers[0].id}
                  src={data.book_covers[0].URL}
                  alt={'Artwork by ' + data.book_covers[0].artist}
                />
                <figcaption className='figure-caption'>{'Artwork by ' + data.book_covers[0].artist}</figcaption>
              </figure>
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
              <h3>Characters</h3>
              <div className='long-content' style={{ height: this.state.characterSectionHeight }}>
                {data.characters.map((ch, i) => (
                  <a className='text-warning' key={ch} href={`/characters/${ch}`}>
                    {i ? ', ' : ''}
                    {characters.filter(el => el.id === ch)[0].name}
                  </a>
                ))}
              </div>
              <div className='row justify-content-center'>
                {this.state.characterSectionHeight !== 'auto' ? (
                  <Fragment>
                    <button className='btn btn-outline-light text-center m-3' onClick={this.setCharacterSectionHeight}>
                      read more
                    </button>{' '}
                  </Fragment>
                ) : (
                  <button className='btn btn-outline-light text-center m-3' onClick={this.setBackCharacterSectionHeight}>
                    read less
                  </button>
                )}
              </div>
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
