const fs = require('fs')

class ProductManager {
  
  constructor(path) {
    this.path = path
    this.id= 20
    this.products = JSON.parse(fs.readFileSync(path, 'utf-8'))
  }

  async addProduct(product) {
    try {
      this.id++
      const { id, title, description, price, thumbnail, code, stock, status = true,category } = product
      const productInfo = {
        id: this.id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
      }

      if (
        !productInfo.title, 
        !productInfo.description, 
        !productInfo.price,
        !productInfo.code,
        !productInfo.stock,
        !productInfo.category
        ) {
        return "Los campos son obligatorios"
      } else {
        this.products.push(productInfo)
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))
        console.log('Producto creado con exito');
        console.log(this.id);
      }

      
    } catch (error) {
      
      console.log(error);
    }
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      const response = JSON.parse(data)
      return response
    } catch (error) {
      console.log(error)
    }
  }

  async getProductsById(id) {
    const data = await fs.promises.readFile(this.path, 'utf-8')
    const products = JSON.parse(data)
    try {
      const product = products.find(p => p.id === id)
      if (!product) {
        return "Not Fund"
      } else {
        return product
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, uptade) {
    const data = await fs.promises.readFile(this.path, 'utf-8')
    const products = JSON.parse(data)
    try {
      const product = products.findIndex(p => p.id === id)
      if (product === -1){
        return "Not Fund"
      } else {
        products[product] = {...products[product], ...uptade}
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        console.log("Producto encontrado y actualizado");
      }
    } catch (error) {
      console.log(error);
    }
  }


  async deleteProduct(id) {
    const data = await fs.promises.readFile(this.path)
    const products = JSON.parse(data)
    try {
      const productos = products.filter(p => p.id !== id)
      if (!productos){
        return "Not Fund"
      } else {
        await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'))
        console.log("El producto se elimino");
      }
    } catch(error) {
      console.log(error);
    }
  }

} 
  
module.exports = ProductManager
  


