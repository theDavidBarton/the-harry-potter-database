import React, { useState, useEffect, Fragment, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Loading from './loading'

export default function Spells() {
  const [data, setData] = useState(null)
  const [dataIsReady, setDataIsReady] = useState(false)

  const { id } = useParams()

  const domain = process.env.NODE_ENV === 'production' ? 'https://the-harry-potter-database-backend.onrender.com' : ''

  const getApiSpells = useCallback(async () => {
    try {
      const response = await fetch(`${domain}/api/1/spells/${id ? id : 1}`)
      if (response.status >= 400) {
        const path = window.location.pathname
        window.location.pathname = window.location.pathname.replace(path, '404')
      } else {
        const json = await response.json()
        setData(json[0])
        setDataIsReady(true)
      }
    } catch (e) {
      console.error(e)
    }
  }, [id, domain])

  useEffect(() => {
    getApiSpells()
  }, [getApiSpells])

  return (
    <Fragment>
      {dataIsReady ? (
        <Fragment>
          <div className='col-md-9'>
            <h1>{data.name}</h1>
            <ul>
              {data.other_name ? (
                <Fragment>
                  <li>
                    <strong>Also called as:</strong> {data.other_name}
                  </li>
                </Fragment>
              ) : null}
              {data.pronunciation ? (
                <Fragment>
                  <li>
                    <strong>Pronunciation:</strong> {data.pronunciation}
                  </li>
                </Fragment>
              ) : null}
              {data.spell_type ? (
                <Fragment>
                  <li>
                    <strong>Spell type:</strong> {data.spell_type}
                  </li>
                </Fragment>
              ) : null}
              {data.description ? (
                <Fragment>
                  <li>
                    <strong>Description:</strong> {data.description}
                  </li>
                </Fragment>
              ) : null}
              {data.mention ? (
                <Fragment>
                  <li>
                    <strong>Mentioned in the books:</strong> {data.mention}
                  </li>
                </Fragment>
              ) : null}
              {data.etymology ? (
                <Fragment>
                  <li>
                    <strong>Etymology:</strong> {data.etymology}
                  </li>
                </Fragment>
              ) : null}
              {data.note ? (
                <Fragment>
                  <li>
                    <strong>Note:</strong> {data.note}
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
      ) : <Loading/> }
    </Fragment>
  )
}
