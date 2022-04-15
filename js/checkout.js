// import {getCartProducts, calSubTotal} from "./cart.js"

//  Stict menu on scrolling
window.onscroll = function() {myFunction()};
var navbar = document.querySelector('.page-header');
var sticky = navbar.offsetTop;
function myFunction() {
  if (window.pageYOffset > 100) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

const prod_list_div = document.querySelector('.prods-list');
const price_div = document.querySelector('#finalP-div');
$(function(){

    displayProducts()
});

// ===== Get Products from LocalStorage cart ==
function getCartProducts() {
    let cart;
    if (localStorage.getItem("my_cart") === null) {
        cart = [];
    } else {
        cart = JSON.parse(localStorage.getItem("my_cart"));
    }
    return cart;
}
// ====Getting Total Price from local storage =========
function getTotal(KEY_price ="my_final_price") {
    if (KEY_price in localStorage) {
        const myTotalList = JSON.parse(localStorage.getItem(KEY_price));
        return myTotalList;
      }else{
        let newTotal = new Total();
        localStorage.setItem(KEY_price, JSON.stringify(newTotal));
        const myTotalList = JSON.parse(localStorage.getItem(KEY_price));
        return myTotalList;
      }
}
// ======= Displaying cart products and finale price ===
function displayProducts() {
    let cartList = getCartProducts();
    let cartPrice = getTotal();
    prod_list_div.innerHTML = ''
    for (const cart of cartList) {
        const div_item = document.createElement('div');
        div_item.classList.add('prod') 
        console.log("CHECKOUT prod "+cart.pName);
        div_item.innerHTML = `
            <img src="${cart.img}">
            <div class="checkout-pQ">
                <h1>${cart.pName}</h1>
                <p>Quantity: ${cart.pQuantity}</p>
            </div>
            <p>Total: $${cart.totalPrice}</p>
            
        `
        prod_list_div.appendChild(div_item);
    }
    price_div.innerHTML =``

    const final_price_elem = document.createElement('h3')
    const btn_price_elem = document.createElement('button')
    btn_price_elem.classList.add('btn_price');
    btn_price_elem.classList.add('btn');
    btn_price_elem.textContent = 'PAY NOW'
    final_price_elem.textContent = `Final Price: $${cartPrice.discount_price}`
    price_div.appendChild(final_price_elem);
    price_div.appendChild(btn_price_elem);
}