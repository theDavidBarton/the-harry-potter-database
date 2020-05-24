/*
MIT License

Copyright (c) 2020 David Barton (theDavidBarton)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

const express = require('express')
const cors = require('cors')

const categories = require('./resources/categories.json')
const books = require('./resources/books.json')

const endpointCreation = () => {
  try {
    const app = express()
    const port = process.env.PORT || 5000
    app.use(cors())

    // categories / root
    app.get(/^\/api\/1(\/$|$|\/categories\/$|\/categories$)/, (req, res) => {
      res.json(categories)
      console.log('/api/1/ endpoint has been called!')
    })

    app.get('/api/1/categories/:id', (req, res) => {
      const id = req.params.id
      const idResult = categories.filter(category => category.id == id)
      idResult[0] ? res.json(idResult) : res.status(404).json([{ error: 'no such id!' }])
      console.log(`/api/1/categories/${id} endpoint has been called!`)
    })

    // books
    app.get('/api/1/books/', (req, res) => {
      res.json(books)
      console.log('/api/1/books/ endpoint has been called!')
    })

    app.get('/api/1/books/:id', (req, res) => {
      const id = req.params.id
      const idResult = books.filter(book => book.id == id)
      idResult[0] ? res.json(idResult) : res.status(404).json([{ error: 'no such id!' }])
      console.log(`/api/1/books/${id} endpoint has been called!`)
    })

    app.listen(port)

    console.log(
      `API is listening on ${port}
      \nEndpoint is ready at: localhost:${port}/api/1/... 
      \nCheck documentation at: https://github.com/theDavidBarton/the-harry-potter-database`
    )
  } catch (e) {
    console.error(e)
  }
}
endpointCreation()
