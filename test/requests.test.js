'use strict';

const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const server = require('../src/server');
const { resetDatabase, Book } = require('../src/models');

describe('/books requests', () => {
  beforeEach(resetDatabase);

  describe('GET /books', () => {
    beforeEach(async () => {
      await Book.create({ title: 'Some title', author: 'Algun author' });
    });

    it('works', async () => {
      const response = await request(server).get('/books');
      expect(response.body.books).to.deep.equal([{ title: 'Some title', author: 'Algun author' }]);
    });
  });

  describe('GET /books/:id', () => {
    let book;

    beforeEach(async () => {
      book = await Book.create({ title: 'Other title', author: 'Other author' });
    });

    it('works', async () => {
      const response = await request(server).get(`/books/${book.id}`);
      expect(response.body.book).to.deep.equal({ title: 'Other title', author: 'Other author' });
    });

    it('returns status 404 when not found', async () => {
      const response = await request(server).get('/books/12345');
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({ error: 'NOT_FOUND' });
    });
  });

  describe('POST /books (= create)', () => {
    it('works', async () => {
      const response = await request(server)
        .post('/books')
        .send({ book: { title: 'Creator title', author: 'Creator author' } });
      // eslint-disable-next-line no-unused-expressions
      expect(response.body.book.id).not.to.be.null;
      expect(response.body.book).to.deep.include({
        title: 'Creator title',
        author: 'Creator author',
      });
      const loadedBook = await Book.findById(response.body.book.id);
      expect(loadedBook).to.deep.include({
        title: 'Creator title',
        author: 'Creator author',
      });
    });
  });

  describe('PATCH /books/:id (= update)', () => {
    let book;

    beforeEach(async () => {
      book = await Book.create({ title: 'Original title', author: 'Original author' });
    });

    it('works', async () => {
      const response = await request(server)
        .patch(`/books/${book.id}`)
        .send({ book: { title: 'Updated title' } });
      expect(response.status).to.equal(200);
      expect(response.body.book).to.deep.include({
        title: 'Updated title',
        author: 'Original author',
      });
      await book.reload();
      expect(book).to.deep.include({
        title: 'Updated title',
        author: 'Original author',
      });
    });
  });

  describe('DELETE /books/:id (= destroy)', () => {
    let book;

    beforeEach(async () => {
      book = await Book.create({ title: 'Original title', author: 'Original author' });
    });

    it('works', async () => {
      const response = await request(server)
        .delete(`/books/${book.id}`)
        .send({ book: { title: 'Updated title' } });
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({});
      const loadedBook = await Book.findById(book.id);
      // eslint-disable-next-line no-unused-expressions
      expect(loadedBook).to.be.null;
    });
  });
});
