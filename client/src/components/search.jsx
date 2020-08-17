import React, { useState, useEffect, Fragment } from 'react'
import SearchDropdownItem, { SearchDropdownItemNoResult } from './searchDropdownItem'

export default function Search() {
  const [data, setData] = useState(null)
  const [dataIsReady, setDataIsReady] = useState(false)
  const [dropdownIsopened, setDropdownIsopened] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [searchType, setSearchType] = useState('characters')

  useEffect(() => {
    async function getApiSearch() {
      if (keyword !== '' && keyword.length > 2) {
        try {
          const response = await fetch(`/api/1/${searchType}?search=${keyword.toLowerCase()}`)
          const json = await response.json()
          setData(json)
          setDataIsReady(true)
        } catch (e) {
          console.error(e)
        }
      }
    }
    getApiSearch()
  }, [keyword, searchType])

  const setSearchTypeFn = event => {
    setSearchType(event.target.value)
    setKeyword('')
  }

  const setKeywordInInput = event => {
    setKeyword(event.target.value)
    setDropdownIsopened(true)
  }

  const closeDropdown = () => {
    setDropdownIsopened(false)
    setKeyword('')
  }

  return (
    <Fragment>
      <div className='input-group position-relative' style={{ zIndex: 1 }}>
        <div className='input-group-prepend'>
          <select id='search-type-select' name='search-type' onChange={setSearchTypeFn}>
            <option value='characters'>Characters</option>
            <option value='spells'>Spells</option>
            <option value='potions'>Potions</option>
          </select>
          <input
            aria-label={`search for a ${searchType.replace(/s$/, '')}`}
            id='searchform'
            className='form-control mt-2'
            type='text'
            placeholder={`Type a ${searchType.replace(/s$/, '')} name…`}
            value={keyword}
            onChange={setKeywordInInput}
          />
        </div>
        {dataIsReady ? (
          <Fragment>
            {dropdownIsopened && keyword.length > 2 ? (
              <div className='bg-white w-auto text-dark position-absolute dropdown-position py-2 px-2'>
                <ul className='list-unstyled mb-0'>
                  {data.length > 0 ? (
                    data.map(result => <SearchDropdownItem key={result.id} searchType={searchType} result={result} />)
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
