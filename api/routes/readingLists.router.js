const router = require('express').Router()
const ReadingListsModel = require('../models/readingLists.model')
const ReadingListBooksModel = require('../models/readingListBooks.model')
const { verifyToken } = require('../middleware/authentication.middleware')
const {
  verifyBook,
  verifyBody,
  verifyAuthors,
  verifyAuthorBook,
  verifyBookUnique,
  verifyReadingListId
} = require('../middleware/readingLists.middleware')

/**
 * @swagger
 * components:
 *  schemas:
 *    Author:
 *      type: string
 *      description: Name of Author
 *      example: "William Shakespeare"
 *    Book:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 0
 *        google_id:
 *          type: string
 *          description: id used for google books api
 *          example: "-w3TCwAAQBAJ"
 *        title:
 *          type: string
 *          example: Hamlet
 *        cover_image:
 *          type: string
 *          description: url of cover_image
 *          example: "https://books.google.com/books/content?id=-w3TCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
 *        description:
 *          type: string
 *          description: short description of the book
 *          example: "The acclaimed Shakespeare Play"
 *        page_count:
 *          type: integer
 *          example: 148
 *        printed_page_count:
 *          type: integer
 *          example: 157
 *        authors:
 *          type: array
 *          description: Array of strings of Author Names
 *          items:
 *            $ref: '#/components/schemas/Author'
 *    NewBook:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 0
 *        google_id:
 *          type: string
 *          description: id used for google books api
 *          example: "-w3TCwAAQBAJ"
 *        title:
 *          type: string
 *          example: Hamlet
 *        cover_image:
 *          type: string
 *          description: url of cover_image
 *          example: "https://books.google.com/books/content?id=-w3TCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
 *        description:
 *          type: string
 *          description: short description of the book
 *          example: "The acclaimed Shakespeare Play"
 *        page_count:
 *          type: integer
 *          example: 148
 *        printed_page_count:
 *          type: integer
 *          example: 157
 *        authors:
 *          type: array
 *          description: Array of strings of Author Names
 *          items:
 *            $ref: '#/components/schemas/Author'
 *    ReadingList:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          example: 0
 *        user_id:
 *          type: string
 *          format: uuid
 *          description: user public id
 *          example: "1d9dd170-8757-40ec-9ccf-11e4e3de27b1"
 *        name:
 *          type: string
 *          example: "reading"
 *        books:
 *          type: array
 *          description: array of Book objects that belong to the reading list
 *          items:
 *           $ref: '#/components/schemas/Book'
 *    ReadingLists:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/ReadingList'
 *
 * /readingLists/:
 *  get:
 *    description: return reading lists of the logged in user
 *    tags:
 *      - readingLists
 *    responses:
 *      200:
 *        description: logged in users reading lists data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReadingLists'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 */

router.get('/', verifyToken, async (req, res) => {
  try {
    const lists = await ReadingListsModel.getAllBy({
      user_id: res.locals.profile.uuid
    })
    const readingLists = await Promise.all(
      lists.map(async (list) => {
        try {
          let books = await ReadingListsModel.getListBooks(list.id)
          if (books.length !== undefined) {
            books = await Promise.all(
              books.map(async (book) => {
                const authors = await ReadingListsModel.getBooksAuthors(book.id)
                const authorNames = authors.map((author) => author.name)
                return { ...book, authors: authorNames }
              })
            )
            return { ...list, books }
          }
          return { ...list, books: [] }
        } catch (error) {
          return res.status(500).json({ error: 'database error' })
        }
      })
    )
    res.status(200).json({ readingLists })
  } catch (error) {
    res.status(500).json({ error: 'database error' })
  }
})

/**
 * @swagger
 * /readingLists/:
 *  post:
 *    description: creating reading list for authenticated user
 *    tags:
 *      - reading lists
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              name:
 *                type: string
 *                description: name of reading list to created
 *                example: "Want to Read"
 *    responses:
 *      201:
 *        description: created reading list
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                id:
 *                  type: integer
 *                  example: 0
 *                user_id:
 *                  type: string
 *                  format: uuid
 *                  description: user public id
 *                  example: "1d9dd170-8757-40ec-9ccf-11e4e3de27b1"
 *                name:
 *                  type: string
 *                  example: "Want to Read"
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      400:
 *        description: "Missing name of reading list"
 */

router.post('/', verifyToken, async (req, res, next) => {
  if (req.body.name) {
    const list = { user_id: res.locals.profile.uuid, name: req.body.name }
    try {
      const created = await ReadingListsModel.create(list)
      res.status(201).json({ created })
    } catch (error) {
      error.statusCode = 500
      error.message = 'Error creating reading list'
      next(error)
    }
  } else {
    res.status(400).json({ error: 'Missing name of reading list' })
  }
})

/**
 * @swagger
 * /readingLists/:
 *  post:
 *    description: Add book to reading list
 *    tags:
 *     - reading lists
 *    parameters:
 *      id:
 *        type: integer
 *        description: Id of reading list to add the book to.
 *        example: 0
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/NewBook'
 */
router.post(
  '/:id',
  verifyToken,
  verifyBody,
  verifyBook,
  verifyReadingListId,
  verifyBookUnique,
  verifyAuthors,
  verifyAuthorBook,
  async (req, res, next) => {
    try {
      await ReadingListBooksModel.addBook(res.locals.book.id, req.params.id)
      res.status(201).json({
        message: `${res.locals.book.title} added to reading list: ${res.locals.readingList.name}`
      })
      // }
    } catch (error) {
      error.statusCode = 500
      error.message = 'Error adding book to reading list'
      next(error)
    }
  }
)

module.exports = router
