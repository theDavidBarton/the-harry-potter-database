import React, { useState, useEffect, Fragment, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Loading from './loading'

export default function Books() {
  const [data, setData] = useState(null)
  const [characters, setCharacters] = useState(null)
  const [dataIsReady, setDataIsReady] = useState(false)
  const [characterSectionHeight, setCharacterSectionHeight] = useState('133px')

  const { id } = useParams()

  const domain = process.env.NODE_ENV === 'production' ? 'https://the-harry-potter-database-backend.onrender.com' : ''

  const getApiBooks = useCallback(async () => {
    try {
      const response = await fetch(`${domain}/api/1/books/${id ? id : 1}`)
      if (response.status >= 400) {
        const path = window.location.pathname
        window.location.pathname = window.location.pathname.replace(path, '404')
      } else {
        const json = await response.json()
        const responseCharacters = await fetch(`${domain}/api/1/characters/all`)
        const jsonCharacters = await responseCharacters.json()
        setData(json[0])
        setCharacters(jsonCharacters)
        setDataIsReady(true)
      }
    } catch (e) {
      console.error(e)
    }
  }, [id, domain])

  useEffect(() => {
    getApiBooks()
  }, [getApiBooks])

  const setCharacterSectionHeightFn = () => {
    setCharacterSectionHeight('auto')
  }

  const setBackCharacterSectionHeightFn = () => {
    setCharacterSectionHeight('133px')
  }

  return (
    <Fragment>
      {dataIsReady ? (
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
              The book <i>{data.title}</i> written by {data.author} was published in the UK on {data.publish_date[0].UK} and on{' '}
              {data.publish_date[1].US} in the US.
              <br />
              The main plot takes place in {data.plot_take_place_years[0]} and {data.plot_take_place_years[1]}.
            </p>
            <h3>Characters</h3>
            <div className='long-content' style={{ height: characterSectionHeight }}>
              {data.characters.map((ch, i) => (
                <a className='text-warning' key={ch} href={`/characters/${ch}`}>
                  {i ? ', ' : ''}
                  {characters.filter(el => el.id === ch)[0].name}
                </a>
              ))}
            </div>
            <div className='row justify-content-center'>
              {characterSectionHeight !== 'auto' ? (
                <Fragment>
                  <button className='btn btn-outline-light text-center m-3' onClick={setCharacterSectionHeightFn}>
                    read more
                  </button>{' '}
                </Fragment>
              ) : (
                <button className='btn btn-outline-light text-center m-3' onClick={setBackCharacterSectionHeightFn}>
                  read less
                </button>
              )}
            </div>
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
      ) : <Loading/> }
    </Fragment>
  )
}
