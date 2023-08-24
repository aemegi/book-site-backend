import express from 'express';
import cors from 'cors';
import BooksRoute from './api/BooksRoute.js';
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import BooksDAO from './dao/BooksDAO.js';
import ReviewsDAO from './dao/ReviewsDAO.js';

class Index {
  static app = express();

  static router = express.Router();

  static main() {
    dotenv.config();
    Index.setUpServer(); 
    Index.setUpDatabase();
  }

  static async setUpDatabase() {
    const client = new mongodb.MongoClient(process.env.BOOKREVIEWS_DB_URI);
    const port = process.env.PORT || 3000;
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      await BooksDAO.injectDB(client);
      await ReviewsDAO.injectDB(client);
      Index.app.listen(port, () => {
        console.log(`server is running on port:${port}`);
      });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  static setUpServer() {
    Index.app.use(cors());
    Index.app.use(express.json());

    Index.app.use('/api/v1/books', BooksRoute.configRoutes(Index.router));
    Index.app.use('*', (req, res) => {
      res.status(404).json({ error: 'not found' });
    });
  }
}

Index.main();
