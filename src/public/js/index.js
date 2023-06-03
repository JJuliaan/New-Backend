const socket = io()
const productsContainer = document.getElementById("products")

socket.on("listProducts", (productos) => {
    const { products } = productos;
    productsContainer.innerHTML = "";
    products.forEach((prod) => {
      const card = createProductCard(prod);
      productsContainer.appendChild(card);
    });
  });
  
  const createProductCard = (prod) => {
    const div = document.createElement("div")
    div.classList.add("product-card")
    div.innerHTML = `
      <img class="img" src="${prod.thumbnail}" alt="${prod.title}" />
      <h2 class="title">${prod.title}</h2>
      <p class="description">${prod.description}</p>
      <p class="price">$${prod.price}</p>
      <p class="code">Code: ${prod.code}</p>
      <p class="stock">Stock: ${prod.stock}</p>
      <p class="status">Status: ${prod.status}</p>
      <p class="category">Category: ${prod.category}</p>
    `
    return div
  }