function calculateTotalAmount(products) {
    let totalAmount = 0;

    for (const item of products) {
        const products = item.products;
        const quantity = item.quantity;
        const price = products.price;


        totalAmount += quantity * price;
    }

    return totalAmount;
}

module.exports = calculateTotalAmount