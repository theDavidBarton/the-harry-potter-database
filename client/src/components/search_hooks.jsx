import React, { useState, useEffect, Fragment } from 'react'
import SearchDropdownItem, { SearchDropdownItemNoResult } from './searchDropdownItem'

export default function Search() {
  const [data, setData] = useState(null)
  const [dataIsReady, setDataIsReady] = useState(false)
  const [dropdownIsopened, setDropdownIsopened] = useState(false)
  const [keyword, setKeyword] = useState('')

  async function getApi() {
    if (keyword !== '') {
      try {
        const response = await fetch(`/api/1/characters?search=${keyword.toLowerCase()}`)
        const json = await response.json()
        setData(json)
        setDataIsReady(true)
      } catch (e) {
        console.error(e)
      }
    }
  }

  useEffect(() => {
    getApi()
  })

  const setKeywordInInput = async event => {
    await setKeyword(event.target.value)
    getApi()
    setDropdownIsopened(true)
  }

  const closeDropdown = () => {
    setDropdownIsopened(false)
    setKeyword('')
  }

  return (
    <Fragment>
      <div className='position-relative' style={{ zIndex: 1 }}>
        <input
          aria-label='search for a character'
          id='searchform'
          className='form-control mt-2'
          type='text'
          placeholder='Type a character name…'
          value={keyword}
          onChange={setKeywordInInput}
        />
        {dataIsReady ? (
          <Fragment>
            {dropdownIsopened && keyword.length > 2 ? (
              <div className='bg-white w-auto text-dark position-absolute dropdown-position py-2 px-2'>
                <ul className='list-unstyled mb-0'>
                  {data.length > 0 ? (
                    data.map(result => <SearchDropdownItem key={result.id} result={result} />)
                  ) : (
                    <SearchDropdownItemNoResult />
                  )}
                </ul>
                <div id='dropdownOverlay' onClick={closeDropdown} className='overlay-style'></div>
              </div>
            ) : null}
          </Fragment>
        ) : null}
      </div>
    </Fragment>
  )
}
