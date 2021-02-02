const router = require('express').Router()
const ReadingListsModel = require('../models/readingLists.model')
const ReadingListBooksModel = require('../models/readingListBooks.model')
const BooksModel = require('../models/books.model')
const { verifyToken } = require('../middleware/authentication.middleware')
const {
  verifyBook,
  verifyBody,
  verifyAuthors,
  verifyAuthorBook,
  verifyBookUnique,
  verifyReadingListId,
  verifyOwner,
  verifyToReadingList,
  verifyBookInList,
  verifyBookNotInToList
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
 *      - reading lists
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
  const profile = res.locals.otherProfile || res.locals.profile
  try {
    const lists = await ReadingListsModel.getAllBy({
      user_id: profile.uuid
    })
    const readingLists = await Promise.all(
      lists.map(async (list) => {
        return await ReadingListsModel.createReadingListObject(list)
      })
    )
    res.status(200).json(readingLists)
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
      const [created] = await ReadingListsModel.create(list)
      const readingList = await ReadingListsModel.createReadingListObject(created)
      res.status(201).json(readingList)
    } catch (error) {
      res.status(500)
      error.message = 'Error creating reading list'
      next(error)
    }
  } else {
    res.status(400).json({ error: 'Missing name of reading list' })
  }
})

/**
 * @swagger
 * components:
 *  parameters:
 *    ReadingListId:
 *      name: readingListId
 *      in: path
 *      description: Numeric ID of the reading list to make the request to
 *      required: true
 *      schema:
 *        type: integer
 *      example: 2
 *
 * /readingLists/:readingListId:
 *  post:
 *    description: Add book to reading list
 *    tags:
 *     - reading lists
 *    parameters:
 *      - $ref: '#/components/parameters/ReadingListId'
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/NewBook'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      409:
 *        description: "Book already in reading list"
 *      201:
 *        description: __BookTitle__ added to reading List __ReadingListName__"
 */
router.post(
  '/:readingListId',
  verifyToken,
  verifyBody,
  verifyBook,
  verifyReadingListId,
  verifyBookUnique,
  verifyAuthors,
  verifyAuthorBook,
  async (req, res, next) => {
    console.table(res.locals)
    try {
      await ReadingListBooksModel.addBook(res.locals.book.id, req.params.readingListId)
      res.status(201).json({
        message: `${res.locals.book.title} added to reading list: ${res.locals.readingList.name}`
      })
      // }
    } catch (error) {
      error.message = 'Error adding book to reading list'
      res.status(500)
      next(error)
    }
  }
)

/**
 * @swagger
 * /readingLists/:readingListId:
 *  get:
 *    description: return reading list with books that belong to the reading list
 *    tags:
 *      - reading lists
 *    parameters:
 *      - $ref: '#/components/parameters/ReadingListId'
 *    responses:
 *      200:
 *       description: Reading List Information
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ReadingList'
 *      404:
 *        description: Reading List not found
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 */

router.get('/:readingListId', verifyToken, verifyReadingListId, async (req, res) => {
  const { readingList } = res.locals
  try {
    const list = await ReadingListsModel.createReadingListObject(readingList)
    res.json(list)
  } catch (error) {
    res.status(500).json({ error: 'database error' })
  }
})

/**
 * @swagger
 * /readingLists/:readingListId:
 *  patch:
 *    description: Update properties of a reading list
 *    tags:
 *      - reading lists
 *    parameters:
 *      - $ref: '#/components/parameters/ReadingListId'
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                example: Star Trek Pocket Books
 *    responses:
 *      400:
 *        description: Missing name property to update
 *      403:
 *        description: Authenticated user does not have access to this reading list
 *      404:
 *        description: Reading List not found
 *      200:
 *        description: Reading list data after patch changes
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReadingList'
 */

router.patch(
  '/:readingListId',
  verifyToken,
  verifyReadingListId,
  verifyOwner,
  async (req, res, next) => {
    // only name should be updated. if id or user_id is sent delete them
    delete req.body.id
    delete req.body.user_id
    if (!req.body.name) {
      const error = new Error('Missing name property to update reading list')
      res.status(400)
      next(error)
    }
    try {
      const [updated] = await ReadingListsModel.update(req.params.readingListId, req.body)
      const list = await ReadingListsModel.createReadingListObject(updated)
      res.json(list)
    } catch (error) {
      next(error)
    }
  }
)
/**
 * @swagger
 * components:
 *  parameters:
 *    BookId:
 *      in: path
 *      name: bookId
 *      required: true
 *      schema:
 *        type: integer
 *      description: ID of Book you want to get
 *      example: 3
 *    ToReadingList:
 *      in: query
 *      name: toReadingList
 *      required: true
 *      schema:
 *        type: integer
 *      description: ID of reading list you want to move book to
 *      example: 3
 *
 * /readingLists/:readingListId/:bookId/?toReadingList={toReadingListId}/:
 *  patch:
 *    description: Change what reading list a book belongs to by bookId
 *    tags:
 *      - reading lists
 *    parameters:
 *      - $ref: '#/components/parameters/ReadingListId'
 *      - $ref: '#/components/parameters/BookId'
 *      - $ref: '#/components/parameters/ToReadingList'
 *    responses:
 *      400:
 *        description: Requested reading list to move book to does not exist
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        description: Authenticated user does not have access to make changes to reading list
 *      404:
 *        description: Reading List does not exist
 *      409:
 *        description: Book is already in toReadingList
 *      422:
 *        description: Can not update Book is not in reading list
 *      200:
 *        description: Reading List data after patch changes
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReadingList'
 */
router.patch(
  '/:readingListId/:bookId/',
  verifyToken,
  verifyReadingListId,
  verifyOwner,
  verifyBookInList,
  verifyToReadingList,
  verifyBookNotInToList,
  async (req, res, next) => {
    console.table(res.locals)
    const { bookId, readingList, toReadingList } = res.locals
    try {
      await ReadingListBooksModel.changeReadingList(bookId, readingList.id, toReadingList.id)
      const list = await ReadingListsModel.createReadingListObject(toReadingList)
      res.json(list)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @swagger
 * /readingLists/:readingListId/:
 *  delete:
 *    description: Deletes a Users reading list
 *    tags:
 *      - reading lists
 *    parameters:
 *      - $ref: '#/components/parameters/ReadingListId'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        description: Authenticated user does not have access to make changes to reading list
 *      404:
 *        description: Reading List does not exist
 *      200:
 *        description: Deleted reading list data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: deleted reading list
 *                list:
 *                  $ref: '#/components/schemas/ReadingList'
 */

router.delete(
  '/:readingListId',
  verifyToken,
  verifyReadingListId,
  verifyOwner,
  async (req, res, next) => {
    const { readingList } = res.locals
    try {
      const list = await ReadingListsModel.createReadingListObject(readingList)
      const deleted = await ReadingListsModel.remove(readingList.id)
      console.log({ deleted })
      res.status(200).json({ message: 'deleted reading list', list })
    } catch (error) {
      next(error)
    }
  }
)

/**
 * @swagger
 * readingLists/:readingListId/:bookId/:
 *  delete:
 *    description: Remove a book from a reading list
 *    tags:
 *      - reading lists
 *    parameters:
 *      - $ref: '#/components/parameters/ReadingListId'
 *      - $ref: '#/components/parameters/BookId'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        description: Authenticated user does not have access to make changes to reading list
 *      404:
 *        description: Reading List does not exist
 *      422:
 *        description: Can not update Book is not in reading list
 *      200:
 *        description: Book Deleted & Reading List data after delete changes
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: deleted book from reading list
 *                book:
 *                  $ref: '#/components/schemas/Book'
 *                readingList:
 *                  $ref: '#/components/schemas/ReadingList'
 */

router.delete(
  '/:readingListId/:bookId',
  verifyToken,
  verifyReadingListId,
  verifyOwner,
  verifyBookInList,
  async (req, res, next) => {
    console.table(res.locals)
    const { bookId, readingList } = res.locals
    try {
      // get the books info
      const [deletedBook] = await BooksModel.getBy({ id: bookId })
      await ReadingListBooksModel.remove(bookId, readingList.id)
      const list = await ReadingListsModel.createReadingListObject(readingList)
      res.json({ message: 'deleted book from reading list', deletedBook, readingList: list })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
