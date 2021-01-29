const BooksModel = require('../models/books.model')
const AuthorsModel = require('../models/authors.model')
const AuthorBooksModel = require('../models/authorBooks.model')
const ReadingListModel = require('../models/readingLists.model')
const ReadingListBooksModel = require('../models/readingListBooks.model')

const requiredBookFields = [
  'google_id',
  'title',
  'cover_image',
  'description',
  'page_count',
  'authors'
]

const verifyBody = (req, res, next) => {
  requiredBookFields.forEach((property) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, property)) {
      const error = new Error()
      error.statusCode = 400
      error.message = `Missing Required property: ${property}`
      next(error)
    }
  })
  next()
}

const verifyBook = async (req, res, next) => {
  const { google_id, title, cover_image, description, page_count } = req.body
  try {
    let book = await BooksModel.getBy({ google_id }).first()
    if (book) {
      res.locals.book = book
      next()
    } else {
      try {
        book = await BooksModel.create({
          google_id,
          title,
          cover_image,
          description,
          page_count
        })
        if (book !== null) {
          res.local.book = insertedBook
          next()
        }
      } catch (error) {
        error.statusCode = 500
        error.message = 'Error creating new book in database'
        next(error)
      }
    }
  } catch (error) {
    error.statusCode = 500
    error.message = 'Error checking if the book exists in the database'
    next(error)
  }
}

const verifyAuthors = async (req, res, next) => {
  if (req.body.authors.length > 1) {
    try {
      const authors = await Promise.all(
        req.body.authors.map(async (author) => {
          let authorCheck = await AuthorsModel.get({ name: author })
          if (!authorCheck) {
            authorCheck = await AuthorsModel.create({ name: author })
          }
          return authorCheck
        })
      )
      res.locals.authors = authors
      next()
    } catch (error) {
      next(error)
    }
  } else {
    try {
      let author = await AuthorsModel.get({ name: req.body.authors[0] })
      if (!author) {
        author = await AuthorsModel.create({ name: req.body.authors[0] })
      }
      res.locals.authors = author
      next()
    } catch (error) {
      error.statusCode = 500
      error.message = 'Error checking if Authors exist in database'
      next(error)
    }
  }
}

const verifyAuthorBook = async (req, res, next) => {
  const { authors, book } = res.locals
  if (authors > 1) {
    const authorBooks = await Promise.all(
      authors.map(async (author) => {
        let book = await AuthorBooksModel.getAuthorBook(author.id, book.id)
        if (!book) {
          book = await AuthorBooksModel.addBook(author.id, book.id)
          return book
        }
        return book
      })
    )
    res.locals.authorBooks = authorBooks
    next()
  } else {
    let bookCheck = await AuthorBooksModel.getAuthorBook(authors.id, book.id)
    if (!bookCheck) {
      bookCheck = await AuthorBooksModel.addBook(authors.id, book.id)
    }
    res.locals.authorBooks = bookCheck
    next()
  }
}

const verifyReadingListId = async (req, res, next) => {
  const { id } = req.params
  try {
    const [readingList] = await ReadingListModel.getById(id)
    res.locals.readingList = readingList
    next()
  } catch (error) {
    error.statusCode = 500
    error.message = 'Database Error verifying Reading List Id'
    next(error)
  }
}

const verifyBookUnique = async (req, res, next) => {
  const { book } = res.locals
  try {
    const [readingListBook] = await ReadingListBooksModel.getBy({
      book_id: book.id,
      reading_list_id: req.params.id
    })
    if (readingListBook !== undefined) {
      const error = new Error('Book already in reading list')
      error.statusCode = 409
      next(error)
    } else {
      next()
    }
  } catch (error) {
    error.statusCode = 500
    error.message = 'Error checking if book is in reading list already'
    next(error)
  }
}

module.exports = {
  verifyBody,
  verifyBook,
  verifyAuthors,
  verifyAuthorBook,
  verifyReadingListId,
  verifyBookUnique
}
