import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
//import './BooksAPI.js'
import Books from './Books'
import Bookshelf from './Bookshelf'
import { Route } from 'react-router-dom'

class BooksApp extends React.Component {
  removeBook = (target,book) => {
    this.setState((currentState) => ({
      [target]:{
        ...currentState[target],
        books: currentState[target].books.filter(function(b){
          return book !== b
        }
    )}}))
  }

  updateQuery = (evt) => {
      if (evt.key === 'Enter') {
        BooksAPI.search(this.state.query)
          .then((books) => {
            this.setState(() => ({
            allbooks:books
          }))
        })
      }

    }

  addBook = (target,book) => {
    console.log("target:",target)
    console.log("book:",book)

    if (target != 'none'){
      this.setState((currentState) => ({
        [target]:{
          ...currentState[target],
          books: currentState[target].books.concat([book])
      }}))
    }
   switch(target){

      case 'currentlyReading':
        this.removeBook('wantToRead',book)
        this.removeBook('read',book)
        return
      case 'wantToRead':
        this.removeBook('read',book)
        this.removeBook('currentlyReading',book)
        return
      case 'read':
        this.removeBook('currentlyReading',book)
        this.removeBook('wantToRead',book)
        return
      case 'none':
        this.removeBook('read',book)
        this.removeBook('wantToRead',book)
        this.removeBook('currentlyReading',book)
        return
    }


  }

  state = {
    allbooks:[],
    currentlyReading: {
      title:"Currently Reading",
      books: []
    },
    wantToRead:{
      title:"Want to Read",
      books: []
    },
    read:{
      title:"Read",
      books: []
    },
    page: '/',
    query: ''
  }
  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState(() => ({
        allbooks:books
      }))
    })
  }
  render() {
    return (
      <div className="app">
        <Route exact path='/search' render={({history}) => (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => history.push('/')}>Close</a>
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author" onChange={event => {this.setState({query: event.target.value})}} onKeyPress={this.updateQuery}/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {console.log(this.state.allbooks)}
                {
                 this.state.allbooks.map((item, index) => (
                   <li>
                     <Books
                        book={item} addBook={this.addBook}
                      />
                   </li>
                ))}
              </ol>

          </div>
          </div>
        )} />
        <Route exact path='/' render={({ history }) => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <Bookshelf bookshelf={this.state.currentlyReading} addBook={this.addBook}/>
                <Bookshelf bookshelf={this.state.wantToRead} addBook={this.addBook}/>
                <Bookshelf bookshelf={this.state.read} addBook={this.addBook}/>
              </div>
            </div>
            <div className="open-search">
              <a onClick={() =>  history.push('/search')}>Add a book</a>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
