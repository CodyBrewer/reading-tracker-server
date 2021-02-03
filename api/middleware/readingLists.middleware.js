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
      res.status(400)
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
        if (book.length) {
          res.locals.book = book[0]
        }
        next()
      } catch (error) {
        res.status(500)
        error.message = 'Error creating new book in database'
        next(error)
      }
    }
  } catch (error) {
    res.status(500)
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
      res.status(500)
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
      bookCheck = await AuthorBooksModel.addBook(authors[0].id, book.id)
    }
    res.locals.authorBooks = bookCheck
    next()
  }
}

const verifyReadingListId = async (req, res, next) => {
  const { readingListId } = req.params
  try {
    const readingList = await ReadingListModel.getById(readingListId)
    if (readingList != null) {
      res.locals.readingList = readingList
      next()
    } else {
      const error = new Error('Reading List does not exist')
      res.status(404)
      next(error)
    }
  } catch (error) {
    res.status(500)
    error.message = 'Database Error verifying Reading List Id'
    next(error)
  }
}

const verifyBookUnique = async (req, res, next) => {
  const { book, readingList } = res.locals
  try {
    const [readingListBook] = await ReadingListBooksModel.getBy({
      book_id: book.id,
      reading_list_id: readingList.id
    })
    if (readingListBook !== undefined) {
      const error = new Error('Book already in reading list')
      res.status(409)
      next(error)
    } else {
      next()
    }
  } catch (error) {
    res.status(500)
    error.message = 'Error checking if book is in reading list already'
    next(error)
  }
}

const verifyOwner = async (req, res, next) => {
  const { readingList } = res.locals
  try {
    const { user_id } = await ReadingListModel.getById(readingList.id)
    if (user_id !== res.locals.profile.uuid) {
      const error = new Error('Authenticated user does not have access to this reading list')
      res.status(403)
      next(error)
    }
    next()
  } catch (error) {
    next(error)
  }
}

const verifyToReadingList = async (req, res, next) => {
  if (req.query.toReadingList != null) {
    try {
      const toReadingList = await ReadingListModel.getById(req.query.toReadingList)
      if (toReadingList == null) {
        const error = new Error('Requested reading list to move book to does not exist')
        res.status(400)
        next(error)
      }
      if (toReadingList.user_id !== res.locals.profile.uuid) {
        const error = new Error(
          'Authenticated user does not have access to make changes to reading list'
        )
        res.status(403)
        next(error)
      }
      res.locals.toReadingList = toReadingList
      next()
    } catch (error) {
      next(error)
    }
  } else {
    next()
  }
}

const verifyBookInList = async (req, res, next) => {
  const { bookId } = req.params
  try {
    const [book] = await ReadingListBooksModel.getBy({
      book_id: bookId,
      reading_list_id: res.locals.readingList.id
    })
    if (book == null) {
      error = new Error('Book is not in reading list')
      res.status(422)
      next(error)
    }
    res.locals.bookId = book.book_id
    next()
  } catch (error) {
    next(error)
  }
}

const verifyBookNotInToList = async (req, res, next) => {
  const { bookId, toReadingList } = res.locals
  try {
    const [book] = await ReadingListBooksModel.getBy({
      book_id: bookId,
      reading_list_id: toReadingList.id
    })
    if (book != null) {
      const error = new Error('Book is already in toReadingList')
      res.status(409)
      next(error)
    }
    next()
  } catch (error) {
    next(error)
  }
}

const verifyReadingListIsPublic = async (req, res, next) => {
  try {
    const { public, user_id } = res.locals.readingList
    const { uuid } = res.locals.profile
    if (user_id !== uuid && public === false) {
      const error = new Error('Reading List is not public')
      res.status(403)
      next(error)
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  verifyBody,
  verifyBook,
  verifyAuthors,
  verifyAuthorBook,
  verifyReadingListId,
  verifyBookUnique,
  verifyOwner,
  verifyToReadingList,
  verifyBookInList,
  verifyBookNotInToList,
  verifyReadingListIsPublic
}
