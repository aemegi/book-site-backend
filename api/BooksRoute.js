import BooksController from './BooksController.js';
import ReviewsController from './ReviewsController.js';

export default class BooksRoute {
    static configRoutes(router) {
      //router.route('/').get((req, res) => res.send('hello world'));
      router.route('/').get(BooksController.apiGetBooks);
      router.route('/id/:id').get(BooksController.apiGetBookById);
      router.route('/genres').get(BooksController.apiGetGenres);
  
      router.route('/review')
        .post(ReviewsController.apiPostReview)
        .put(ReviewsController.apiUpdateReview)
        .delete(ReviewsController.apiDeleteReview);

      return router;
    }
  }
  