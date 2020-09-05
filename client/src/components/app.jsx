import React, { Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Books from './books'
import Characters from './characters'
import Spells from './spells'
import Potions from './potions'
import Home from './home'
import Header from './header'
import Footer from './footer'
import Page404 from './404'

export default function App() {
  return (
    <Fragment>
      <Header />
      <main className='bg-dark text-light p-4'>
        <div className='container'>
          <div className='row'>
            <BrowserRouter>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/books/:id' component={Books} />
                <Route path='/characters/:id' component={Characters} />
                <Route path='/spells/:id' component={Spells} />
                <Route path='/potions/:id' component={Potions} />
                <Route component={Page404} />
              </Switch>
            </BrowserRouter>
          </div>
        </div>
      </main>
      <Footer />
    </Fragment>
  )
}
