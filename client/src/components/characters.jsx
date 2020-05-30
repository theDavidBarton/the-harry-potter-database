import React, { Component, Fragment } from 'react'

export default class Characters extends Component {
  state = {
    data: null,
    dataIsReady: false
  }

  componentDidMount() {
    this.getApi()
  }

  getApi = async () => {
    try {
      const response = await fetch(`/api/1/characters/${this.props.match.params.id ? this.props.match.params.id : 1}`)
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
      <Fragment>
        {this.state.dataIsReady ? (
          <Fragment>
            <div className='col-md-9'>
              <h1>{data.name}</h1>
              <h3>Summary</h3>
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
