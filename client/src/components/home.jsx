import React, { useState, useEffect, Fragment } from 'react'

export default function Home() {
  const [data, setData] = useState(null)
  const [dataIsReady, setDataIsReady] = useState(false)

  async function getApiBooks() {
    try {
      const response = await fetch('/api/1/books/all')
      const json = await response.json()
      setData(json)
      setDataIsReady(true)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getApiBooks()
  }, [])

  return (
    <Fragment>
      {dataIsReady ? (
        <Fragment>
          <p className='w-100 text-center'>7 books, 756 characters, 150 potions and 305 spells.</p>
          {data.map(book => (
            <div key={book.id} className='col-md col-sm-1 py-3'>
              <a href={`/books/${book.id}`}>
                <img
                  className='img-fluid'
                  key={book.id}
                  src={book.book_covers[0].URL}
                  alt={'Artwork by ' + book.book_covers[0].artist}
                />
              </a>
            </div>
          ))}
        </Fragment>
      ) : null}
    </Fragment>
  )
}
