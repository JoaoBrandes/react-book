import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
//import './BooksAPI.js'
import Books from './Books'
import Bookshelf from './Bookshelf'
import { Route, Switch, Redirect } from 'react-router-dom'

class BooksApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  updateQuery = (evt) => {
    const query = evt.target.value
    if (query.length > 0) {
      BooksAPI.search(query)
        .then((books) => {
          if (books === undefined || books.error) {
            this.setState(() => ({
              allbooks:[]
            }))
          } else {
            this.setState(() => ({
              allbooks : books.map( book => {
                if (this.state.currentlyReading.books.some(item => book.id === item.id)) {
                  book.shelf = "currentlyReading"
                } else if (this.state.wantToRead.books.some(item => book.id === item.id)) {
                  book.shelf = "wantToRead"
                } else if (this.state.read.books.some(item => book.id === item.id)) {
                  book.shelf = "read"
                }
                console.log("Sem estante ", book.shelf)
                return book
              })
            }))

        }
      })
    } else {
      this.setState(() => ({
        allbooks:[]
      }))
    }
  }

  addBook = (target, book) => {
    let oldShelf = book.shelf
    if (target === oldShelf) {
      return
    }
    BooksAPI.update(book, target)
      .then((response) => {
        book.shelf=target
        if (target !== "none") {
          this.setState((currentState) => ({
            [target]:{
              ...currentState[target],
              books: currentState[target].books.concat([book])
            },
          }))
        }
        if (oldShelf !== undefined) {
          this.setState((currentState) => ({
          [oldShelf]:{
            ...currentState[oldShelf],
            books: currentState[oldShelf].books.filter(item => item.id !== book.id)
          }
        }))
        }
        this.setState((currentState) => ({
          allbooks: currentState["allbooks"].map(item => {
            if (item.id !== book.id) {
              return item
            } else {
              return book
            }
          })
        }) )
      })
  }


  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        books.forEach(book => {
          this.setState((currentState) => ({
            [book.shelf]:{
              ...currentState[book.shelf],
              books: currentState[book.shelf].books.concat([book])
            }
         }))

        })
        this.setState(() => ({
          allbooks:[]
        }))
    })
  }
  render() {
    let content
    if (this.state.allbooks.length > 0) {
      content = this.state.allbooks.map((item, index) => (
         <li key={item.id}>
           <Books
              book={item} addBook={this.addBook}
            />
         </li>
      ))
    } else {
      content = (<h1> No results </h1>)
    }
    return (

      <div className="app">
        <Switch>
          <Route exact path='/search' render={({history}) => (
            <div className="search-books">
              <div className="search-books-bar">
                <a className="close-search" onClick={() => history.push('/')}>Close</a>
                <div className="search-books-input-wrapper">
                  <input type="text" placeholder="Search by title or author" onChange={event => {this.updateQuery(event)}}/>
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                  {content}
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
          <Redirect to="/" />
      </Switch>
      </div>
    )
  }
}

export default BooksApp
