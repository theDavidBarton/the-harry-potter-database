import React, { Component, Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Books from './books'
import Header from './header'
import Page404 from './404'

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <div className='bg-dark text-light p-4'>
          <div className='container'>
            <div className='row'>
              <BrowserRouter>
                <Switch>
                  <Route exact path='/' component={Books} />
                  <Route path='/books/:id' component={Books} />
                  <Route component={Page404} />
                </Switch>
              </BrowserRouter>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}
