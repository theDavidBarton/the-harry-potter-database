import React, { Component, Fragment } from 'react'

export default class Characters extends Component {
  state = {
    data: null,
    booksData: null,
    dataIsReady: false
  }

  componentDidMount() {
    this.getApi()
  }

  getApi = async () => {
    try {
      const response = await fetch(`/api/1/characters/${this.props.match.params.id ? this.props.match.params.id : 1}`)
      if (response.status >= 400) {
        const path = window.location.pathname
        window.location.pathname = window.location.pathname.replace(path, '404')
      } else {
        const json = await response.json()
        this.setState({ data: json })
        const responseBooks = await fetch('/api/1/books')
        const jsonBooks = await responseBooks.json()
        this.setState({ booksData: jsonBooks, dataIsReady: true })
      }
    } catch (e) {
      console.error(e)
    }
  }

  render() {
    const data = this.state.dataIsReady ? this.state.data[0] : null
    const books = this.state.dataIsReady ? this.state.booksData : null

    return (
      <Fragment>
        {this.state.dataIsReady ? (
          <Fragment>
            <div className='col-md-9'>
              <h1>{data.name}</h1>
              <h3>Bio</h3>
              <ul>
                {data.birth ? (
                  <Fragment>
                    <li>
                      <strong>Born:</strong> {data.birth}
                    </li>
                  </Fragment>
                ) : null}
                {data.death ? (
                  <Fragment>
                    <li>
                      <strong>Died:</strong> {data.death}
                    </li>
                  </Fragment>
                ) : null}
                {data.ancestry ? (
                  <Fragment>
                    <li>
                      <strong>Ancestry:</strong> {data.ancestry}
                    </li>
                  </Fragment>
                ) : null}
                {data.gender ? (
                  <Fragment>
                    <li>
                      <strong>Gender:</strong> {data.gender}
                    </li>
                  </Fragment>
                ) : null}
                {data.hair_color ? (
                  <Fragment>
                    <li>
                      <strong>Hair:</strong> {data.hair_color}
                    </li>
                  </Fragment>
                ) : null}
                {data.eye_color ? (
                  <Fragment>
                    <li>
                      <strong>Eye:</strong> {data.eye_color}
                    </li>
                  </Fragment>
                ) : null}
                {data.wand ? (
                  <Fragment>
                    <li>
                      <strong>Wand:</strong> {data.wand}
                    </li>
                  </Fragment>
                ) : null}
                {data.patronus ? (
                  <Fragment>
                    <li>
                      <strong>Patronus:</strong> {data.patronus}
                    </li>
                  </Fragment>
                ) : null}
                {data.house ? (
                  <Fragment>
                    <li>
                      <strong>House:</strong> {data.house}
                    </li>
                  </Fragment>
                ) : null}
                {data.associated_groups.length > 0 ? (
                  <Fragment>
                    <li>
                      <strong>Associated Groups:</strong>{' '}
                      {data.associated_groups.map((el, i) => (
                        <span key={i}>{(i ? ', ' : '') + el}</span>
                      ))}
                    </li>
                  </Fragment>
                ) : null}
                {data.books_featured_in.length > 0 ? (
                  <Fragment>
                    <li>
                      <strong>Books:</strong>{' '}
                      <ul>
                        {data.books_featured_in.map((el, i) => (
                          <li key={i}>
                            <a className='text-warning' key={el} href={`/books/${el}`}>
                              {books[el - 1].title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </Fragment>
                ) : null}
              </ul>
              <h3>Response preview</h3>
              <code>
                <kbd>GET</kbd> {'/api/1' + window.location.pathname}
              </code>{' '}
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
