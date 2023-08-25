import mongodb from 'mongodb';

export default class BooksDAO {
    static books;
    static ObjectId = mongodb.ObjectId;
    static async injectDB(conn) {
      if (BooksDAO.books) {
        return;
      }
      try {
        BooksDAO.books = await conn.db(process.env.BOOKREVIEWS_NS)
          .collection('books');
      } catch (e) {
        console.error(`unable to connect in BooksDAO: ${e}`);
      }
    }

    static async getBooks({ // default filter
        filters = null,
        page = 0,
        booksPerPage = 20, // will only get 20 books at once
      } = {}) {
        let query;
        if (filters) {
          if ('title' in filters) {
            query = { $text: { $search: filters.title } };
          } else if ('genre' in filters) {
            query = { genre: { $eq: filters.genre } };
          }
        }
    
        let cursor;
        try {
          cursor = await BooksDAO.books
            .find(query)
            .limit(booksPerPage)
            .skip(booksPerPage * page);
          const booksList = await cursor.toArray();
          const totalNumBooks = await BooksDAO.books.countDocuments(query);
          return { booksList, totalNumBooks };
        } catch (e) {
          console.error(`Unable to issue find command, ${e}`);
          return { booksList: [], totalNumBooks: 0 };
        }
      }
      
    static async getGenres() {
        let genres = [];
        try {
            genres = await BooksDAO.books.distinct('genre');
            return genres;
        } catch (e) {
            console.error('unable to get genres, $(e)');
            return genres;
        }
    }

    static async getBookById(id) {
        try {
          return await BooksDAO.books.aggregate([
            {
              $match: {
                _id: new BooksDAO.ObjectId(id),
              },
            },
            {
              $lookup:
              {
                from: 'reviews',
                localField: '_id',
                foreignField: 'book_id',
                as: 'reviews',
              },
            },
          ]).next();
        } catch (e) {
          console.error(`something went wrong in getBookById: ${e}`);
          throw e;
        }
      }
    
  }
  