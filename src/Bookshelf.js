import React, { Component } from 'react'
import Books from './Books'

class Bookshelf extends Component {

  render(){
    const {bookshelf,addBook} = this.props
    return(
      <div className="bookshelf">
        <h2 className="bookshelf-title"> {bookshelf.title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
           {bookshelf.books.map((item, index) => (
              <li key={item.id}>
                <Books
                     book={item} addBook={addBook} />
              </li>
            ))}

          </ol>
        </div>
      </div>)
  }

}

export default Bookshelf
