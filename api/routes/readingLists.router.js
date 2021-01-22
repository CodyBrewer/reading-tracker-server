const router = require('express').Router();
const ReadingListsModel = require('../models/readingLists.model');
const { verifyToken } = require('../middleware/authentication.middleware');

router.get('/', verifyToken, async (req, res) => {
  try {
    const lists = await ReadingListsModel.getAllBy({ user_id: req.profile.uuid });
    const readingLists = await Promise.all(
      lists.map(async (list) => {
        try {
          const books = await ReadingListsModel.getListBooks(list.id);
          if (books.length !== undefined) {
            return { ...list, books };
          }
          return { ...list, books: [] };
        } catch (error) {
          return res.status(500).json({ error: 'database error' });
        }
      }),
    );
    res.status(200).json({ readingLists });
  } catch (error) {
    res.status(500).json({ error: 'database error' });
  }
});

module.exports = router;
