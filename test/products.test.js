const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const app = require('../src/app');
const ProductsDao = require('../service/products.service');

describe('Products API', () => {
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  after(() => {
    sandbox.restore();
  });

  describe('GET /products/all', () => {
    it('should return a list of all products', async () => {
      const mockProducts = [{ title: 'Product 1' }, { title: 'Product 2' }];
      sandbox.stub(ProductsDao.prototype, 'findAll').resolves(mockProducts);

      const res = await request(app).get('/products/all');

      expect(res.status).to.equal(200);
      expect(res.body.products).to.deep.equal(mockProducts);
    });
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        title: 'New Product',
        price: 10,
        description: 'Test Product',
      };
      sandbox.stub(ProductsDao.prototype, 'create').resolves(newProduct);

      const res = await request(app).post('/products').send(newProduct);

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('Producto creado');
      expect(res.body.product).to.deep.equal(newProduct);
    });
  });

});
