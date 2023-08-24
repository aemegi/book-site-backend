import BooksDAO from '../dao/BooksDAO.js';

export default class BooksController {
  static async apiGetBooks(req, res, next) {
    const booksPerPage = req.query.booksPerPage ? parseInt(req.query.booksPerPage) : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;

    const filters = {};
    if (req.query.genre) {
      filters.genre = req.query.genre;
    } else if (req.query.title) {
      filters.title = req.query.title;
    }

    const { booksList, totalNumBooks } = await BooksDAO.getBooks(
      { filters, page, booksPerPage },
    );

    const response = {
      books: booksList,
      page,
      filters,
      entries_per_page: booksPerPage,
      total_results: totalNumBooks,
    };
    res.json(response);
  }

  static async apiGetBookById(req, res, next) {
    try {
      const id = req.params.id || {};
      const book = await BooksDAO.getBookById(id);
      if (!book) {
        res.status(404).json({ error: 'not found' });
        return;
      }
      res.json(book);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetGenres(req, res, next) {
    try {
      const propertyTypes = await BooksDAO.getGenres();
      res.json(propertyTypes);
    } catch (e) {
      console.log(`api,${e}`);
      res.status(500).json({ error: e });
    }
  }
}
