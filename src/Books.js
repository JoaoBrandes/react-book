
import React, { Component } from 'react'
class Books extends React.Component {



  render(){
    const {book,addBook} = this.props
    const url =book.imageLinks.smallThumbnail
    return(
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={{ width: 128, height: 170, backgroundImage: `url(${url})` }}></div>
        <div className="book-shelf-changer">
          <select onChange={(event) => addBook(event.target.value,book)}>
            <option value="move" disabled selected="selected">Move to...</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">{book.author}</div>
     </div>)
  }

}

export default Books
