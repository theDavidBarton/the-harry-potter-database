import React, { useState, useEffect, Fragment, useCallback } from 'react'
import { useParams } from 'react-router-dom'

export default function Potions() {
  const [data, setData] = useState(null)
  const [dataIsReady, setDataIsReady] = useState(false)

  const { id } = useParams()

  const getApiPotions = useCallback(async () => {
    try {
      const response = await fetch(`/api/1/potions/${id ? id : 1}`)
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
  }, [id])

  useEffect(() => {
    getApiPotions()
  }, [getApiPotions])

  return (
    <Fragment>
      {dataIsReady ? (
        <Fragment>
          <div className='col-md-9'>
            <h1>{data.name}</h1>
            <ul>
              {data.description ? (
                <Fragment>
                  <li>
                    <strong>Description:</strong> {data.description}
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
