const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const db = require('../db/connection');
const app = require('../app')
const request = require('supertest')
const toBeSorted = require('jest-sorted')

beforeEach(() => {
    return seed(testData)
  });
  
  afterAll(() => { 
    db.end()
  });
  
describe('GET /api/categories', () => {
    it('responds with object with key of category and array of objects showing slug and description', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then((res) => {
            expect(res.body.category.length).toBe(4);
            expect(Object.keys(res.body.category[0])).toEqual(['slug', 'description'])
          });
    })
  });
  
describe('Invalid PATH - Get /api/banana', () => {
    it('responds with an error message denoting an invalid path', () => {
        return request(app)
        .get('/api/banana')
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({"msg": "Invalid Path"})
          });
    })
  });

describe('GET /api/reviews/:review_id', () => {
    it('responds with the specified reivew and assiocated data', () => {
        return request(app)
        .get('/api/reviews/1')
        .expect(200)
        .then((res) => {
            expect(Object.keys(res.body.review)).toEqual(['review_id', 'title','category','designer','owner','review_body','review_img_url','created_at','votes','comment_count'])
            expect(res.body.review["review_id"]).toBe(1)
          });
    })
  });

describe('GET /api/review/:review_id', () => {
  it('responds with an error when the review is not in the database', () => {
      return request(app)
      .get('/api/reviews/1234')
      .expect(404)
      .then((res) => {
          expect(res.body).toEqual({"msg":"No review found for review_id: 1234"})
      })
  })
})

describe('GET /api/review/:review_id', () => {
  it('responds with an error when the review is not a number', () => {
      return request(app)
      .get('/api/reviews/banana')
      .expect(400)
      .then((res) => {
          expect(res.body).toEqual({"msg":"ID entered is not a number"})
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with a review object with updated votes', () => {
    const reviewUpdates = {"inc_votes": 100}
      return request(app)
      .patch('/api/reviews/1')
      .send(reviewUpdates)
      .expect(200)
      .then((res) => {
        expect(res.body.review[0]["votes"]).toBe(101)
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with a review object with updated votes reducing votes for a negative number', () => {
    const reviewUpdates = {"inc_votes": -100}
      return request(app)
      .patch('/api/reviews/1')
      .send(reviewUpdates)
      .expect(200)
      .then((res) => {
        expect(res.body.review[0]["votes"]).toBe(-99)
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with an error when the review is not in the database', () => {
    const reviewUpdates = {"inc_votes": 100}
      return request(app)
      .patch('/api/reviews/1234')
      .send(reviewUpdates)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({"msg":"No review found for review_id: 1234. There has been no update."})
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with an error when the review is not a number', () => {
    const reviewUpdates = {"inc_votes": 100}
      return request(app)
      .patch('/api/reviews/banana')
      .send(reviewUpdates)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({"msg":"ID entered is not a number, There has been no update."})
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with an error when the incremental votes is not a number', () => {
    const reviewUpdates = {"inc_votes": "banana"}
      return request(app)
      .patch('/api/reviews/1')
      .send(reviewUpdates)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({"msg":"Incremental votes entered is not a number. There has been no update."})
      })
  })
})

describe('PATCH /api/review/:review_id', () => {
  it('responds with an error when the request body is incorrect', () => {
    const reviewUpdates = {"inc votes": 100}
      return request(app)
      .patch('/api/reviews/1')
      .send(reviewUpdates)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({"msg": 'Invalid Request Body. There has been no update.'})
      })
  })
})

describe('GET /api/users', () => {
  it('responds with object with key of users and array of objects showing username, name and avatarurl', () => {
      return request(app)
      .get('/api/users')
      .expect(200)
      .then((res) => {
          expect(res.body.users.length).toBe(4);
          expect(Object.keys(res.body.users[0])).toEqual(['username', 'name', 'avatar_url'])
        });
  })
});

describe('GET /api/reviews/:review_id', () => {
  it('responds with the specified review assiocated data, and aggregated comment count. Review ID 2 is used as this has comments assiocated with it.', () => {
      return request(app)
      .get('/api/reviews/2')
      .expect(200)
      .then((res) => {
          expect(Object.keys(res.body.review)).toEqual(['review_id', 'title','category','designer','owner','review_body','review_img_url','created_at','votes','comment_count'])
          expect(res.body.review["review_id"]).toBe(2)
          expect(res.body.review["comment_count"]).toBe(3)
        });
  })
});

describe('GET /api/reviews/:review_id', () => {
  it('responds with the specified review assiocated data, and aggregated comment count, returning 0 if there are no comments linked', () => {
      return request(app)
      .get('/api/reviews/1')
      .expect(200)
      .then((res) => {
          expect(Object.keys(res.body.review)).toEqual(['review_id', 'title','category','designer','owner','review_body','review_img_url','created_at','votes','comment_count'])
          expect(res.body.review["review_id"]).toBe(1)
          expect(res.body.review["comment_count"]).toBe(0)
        });
  })
});

describe('GET /api/reviews', () => {
  it('responds with an object containing all reviews, sorted by created date in descending order', () => {
      return request(app)
      .get('/api/reviews')
      .expect(200)
      .then((res) => {
          expect(Object.keys(res.body.reviews[0])).toEqual(['review_id', 'title','category','designer','owner','review_body','review_img_url','created_at','votes','comment_count'])
          expect(res.body.reviews).toBeSorted({key: "created_at", descending: true})
        });
  })
});


describe('GET GET /api/reviews/:review_id/comments', () => {
  it('responds with the comments associated with the review_id', () => {
      return request(app)
      .get('/api/reviews/2/comments')
      .expect(200)
      .then((res) => {
          expect(Object.keys(res.body.comments[0])).toEqual(['comment_id', 'body','review_id','author','votes','created_at'])
          expect(res.body.comments.length).toBe(3)
        });
  })
});

describe('GET /api/reviews/:review_id/comments', () => {
  it('responds with an error review has no comments ', () => {
    const reviewUpdates = {"inc votes": 100}
      return request(app)
      .get('/api/reviews/1/comments')
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({"msg": 'No comments found for review_id: 1'})
      })
  })
})

describe('POST /api/reviews/:review_id/comments', () => {
  it('responds with an object of the newly added comment', () => {
      const newComment = {
        "author": "mallionaire",
        "body": "testbody"
      }
      return request(app)
      .post('/api/reviews/2/comments')
      .send(newComment)
      .expect(201)
      .then((res) => {
        expect(Object.keys(res.body.comment[0])).toEqual(['comment_id', 'body','review_id','author','votes','created_at'])
        expect(res.body.comment[0]["comment_id"]).toBe(7)
        expect(res.body.comment[0]["author"]).toBe(newComment["author"])
        expect(res.body.comment[0]["body"]).toBe(newComment["body"])
      })
  })
})

describe('POST /api/reviews/:review_id/comments', () => {
  it('responds with an error message for a user input not in the database', () => {
      const newComment = {
        "author": "TEST",
        "body": "testbody"
      }
      return request(app)
      .post('/api/reviews/2/comments')
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({"msg": 'TEST is not in the users database. No data has been added.'})
      })
  })
})

describe('POST /api/reviews/:review_id/comments', () => {
  it('responds with an error message for an empty body input', () => {
      const newComment = {
        "author": "TEST",
        "body": ""
      }
      return request(app)
      .post('/api/reviews/2/comments')
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({"msg": 'Comment body cannot be empty. No data has been added.'})
      })
  })
})

describe('POST /api/reviews/:review_id/comments', () => {
  it('responds with an error message for an empty body input', () => {
    const newComment = {
      "author": "mallionaire",
      "body": "testbody"
    }
      return request(app)
      .post('/api/reviews/2a/comments')
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({"msg": 'ID entered is not a number.'})
      })
  })
})

describe('POST /api/reviews/:review_id/comments', () => {
  it('responds with an error message for an empty body input', () => {
    const newComment = {
      "author": "mallionaire",
      "body": "testbody"
    }
      return request(app)
      .post('/api/reviews/2222/comments')
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({"msg": '2222 is not within the database. No data has been added.'})
      })
  })
})