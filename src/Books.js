
import React, { Component } from 'react'
class Books extends Component {

  render(){
    const {book, addBook} = this.props
    let url
    if (book.imageLinks !== undefined) {
      url = book.imageLinks.smallThumbnail
    } else {
      url = './icons/image_unavailable.jpg'
    }
    return(
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={{ width: 128, height: 170, backgroundImage: `url(${url})` }}></div>
        <div className="book-shelf-changer">
          <select value={book.shelf === undefined ? "none" : book.shelf} onChange={(event) => addBook(event.target.value,book)}>
            <option value="move" disabled>Move to...</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none" disabled>None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">{book.authors}</div>
     </div>)
  }

}

export default Books
