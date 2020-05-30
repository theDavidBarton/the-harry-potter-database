import React, { Component, Fragment } from 'react'

class SearchDropdownItem extends Component {
  state = {
    result: this.props.result
  }

  render() {
    return (
      <Fragment>
        <a key={this.state.result.id + '_a'} href={`/characters/${this.state.result.id}`} className='text-decoration-none'>
          <li key={this.state.result.id + '_li'} className='my-1 text-nowrap d-inline-block text-truncate result-list-width'>
            <span key={this.state.result.id + '_span'} className='mx-1'>
              {this.state.result.gender === 'Female' ? '♀ ' : '♂ '}
              {this.state.result.name}
            </span>
          </li>
        </a>
      </Fragment>
    )
  }
}

class SearchDropdownItemNoResult extends Component {
  render() {
    return (
      <li className='my-1 text-nowrap d-inline-block text-truncate result-list-width'>
        <span className='mx-1'>no results found...</span>
      </li>
    )
  }
}

export default SearchDropdownItem
export { SearchDropdownItemNoResult }
