// 'use strict'

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
//
const KEY = "my_cart";
const KEY_price = "my_final_price";
var subTotal_price = 0;
var Total_price_afterTax = 0;
var discount_price_afterTax = 0;
const myCartList = JSON.parse(localStorage.getItem(KEY));
let discount = 0.0;
const cart_prod_area = document.querySelector('.cart-prod-area');
const order_summary = document.querySelector('#order-summary');
// const btn_proceed_checkout = document.querySelector('#btn-proceed-checkout');
// const log = document.getElementById('values');
$(function() {
    displayCartProds();
})
class Total{
    constructor(subTotal=0.00, price_afterTax=0.00, discount_price=0.00, discount=0.0){
        this.subTotal = Number(subTotal).toFixed(2);
        this.price_afterTax = parseFloat(price_afterTax);
        this.discount_price = Number(discount_price);
        this.discount = Number(discount);
    }
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
// === Displaying all products in cart ============
function displayCartProds() {
    const cartList = getCartProducts()
    subTotal_price = 0.0
    console.log(`cart  ${cartList}`);
    // getTotal(KEY_price)
    if (cartList.length === 0) {

        const empty_cart = document.createElement('div')
        empty_cart.classList.add('empty_cart');
        empty_cart.innerHTML=`
            <h1>Your Shopping is Empty</h1>
        `
        cart_prod_area.appendChild(empty_cart);
        // console.log("Hello "+subTotal_price)
        // displayTotalSection(subTotal_price)
        order_summary.classList.add(`hide`);
    }else{
        console.log(`cart1 ${cartList[0]}`);
        try {
            cart_prod_area.innerHTML = `` 

            cartList.forEach((c_prod) => {
                const article_cart_prod = document.createElement('article');
                console.log(`pName ${c_prod.pName}`);
                article_cart_prod.classList.add('cart-prod'); 
                article_cart_prod.innerHTML = `
                <span hidden>${c_prod.id}</span>
                <em class="total-prod-price" hidden>${c_prod.totalPrice}</em>
                <img class="product-img" width="190" src="${c_prod.img}" alt="Product Image">
                <div class="cart-prod-details">
                    <h1>${c_prod.pName}</h1>                               
                    <p>${c_prod.pDesc}</p>
                    <div class="cart-prod-cBrand">
                        <p>Brand: ${c_prod.pBrand}</p>
                        <p>Category: ${c_prod.pCategory}</p>
                    </div>
                    <div class="cart-prod-prRating">
                        <abbr class="single_price" hidden>${c_prod.price}</abbr>
                        <p>Price: $${c_prod.price}</p>
                        <p>Rating: ${c_prod.pRating}</p>
                    </div>
                    <div class="cart-prod-prQuantity">
                        <span>Quantity</span>                 
                        <input min="1" max"10" type="number" name="quantity" class="cart-prod-quantity" value=${c_prod.pQuantity}>
                        <h6 class="prod-total">Total: $${c_prod.totalPrice}</h6>
                    </div>
                </div>
                <img width="190" src="./img/cancel.png" alt="Product Image" class="btn-cancel">
                `  
                // Calculating the products total
                subTotal_price = Number(subTotal_price)+Number(c_prod.totalPrice);
                // Adding the article element to the result section element
                cart_prod_area.appendChild(article_cart_prod);
            }) 
    
            console.log("Hello "+subTotal_price)
            displayTotalSection(subTotal_price)
        } catch (error) {
            
        }
    }
    // console.log(`hello ${local_cart}`)
    // let prod_quantity = document.querySelector('.cart-prod-quantity');
}
function displayTotalSection(subTotal_price) {
    calSubTotal(subTotal_price)
    const myTotalList = getTotal(KEY_price);
    order_summary.innerHTML = `
        <h1>ORDER SUMMARY</h1>
        <h4>SubTotal: $ ${myTotalList.subTotal}</h4>
        <h4>Tax : 13% </h4>
        <h4>Price After Tax: $ ${myTotalList.price_afterTax}</h4>
        <h4>Discount : ${myTotalList.discount} % </h4>
        <h4>Price after Discount: $ ${myTotalList.discount_price}</h4>
        <h4 class="hImportant">Final Total: $ ${myTotalList.discount_price}</h4>
        <button id="btn-proceed-checkout" class="btn" onclick="window.location.href='./checkout.html';"><i class="fa fas fa-money"></i> PROCEED TO CHECKOUT</button>
    `
}
// ========= Delete Product =============
cart_prod_area.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-cancel')) {
        const currentContact = e.target.closest('.cart-prod');
        currentContact.remove();
        const id = currentContact.querySelector('span').textContent;
        removeProduct(Number(id));
        console.log("dELETE button clicked: "+Number(id))
    }
});
function removeProduct(id) {
    const productL = getCartProducts();
    productL.forEach((product, index) => {
        if (product.id === id) {
            productL.splice(index, 1);
        }
        localStorage.setItem(KEY, JSON.stringify(productL));
        displayCartProds(myCartList) 
    })
}
// ========= Doing the Prices calculation =========
function calSubTotal(prods_total) {
    console.log(`Total before taxe: ${prods_total}`) 
    let tax_price = (prods_total*0.13).toFixed(2);
    console.log(`Total taxe: ${tax_price}`) 
    Total_price_afterTax = (Number(prods_total)+Number(tax_price)).toFixed(2);
    console.log(`Total after taxe: ${Total_price_afterTax}`) 
    if (prods_total >= 75 && prods_total < 100) {
        discount = 0.1;
        discount_price_afterTax = (Number(Total_price_afterTax)-Number(Total_price_afterTax*0.1)).toFixed(2);
        console.log(`Total after Discount 75: ${discount_price_afterTax}`) 
    }else if (prods_total >= 100 && prods_total < 150) {
        discount = 0.2;
        discount_price_afterTax = (Number(Total_price_afterTax)-Number(Total_price_afterTax*0.2)).toFixed(2);
        console.log(`Total after Discount 100: ${discount_price_afterTax}`) 
    } else if (prods_total >= 150) {
        discount = 0.3;
        discount_price_afterTax = (Number(Total_price_afterTax)-Number(Total_price_afterTax*0.3)).toFixed(2);
        console.log(`Total after Discount 150: ${discount_price_afterTax}`) 
    }else{
        discount_price_afterTax = Total_price_afterTax;
    }   

    let myTotal = new Total(prods_total, Total_price_afterTax, discount_price_afterTax, discount);
    localStorage.setItem(KEY_price, JSON.stringify(myTotal));
}
// ======== listener to the quantity input  from product in cart ===========
cart_prod_area.addEventListener('input', (e) => {
    if (e.target.classList.contains('cart-prod-quantity')) {
        const currentProduct = e.target.closest('.cart-prod');
        const id = currentProduct.querySelector('span').textContent;
        const single_price = currentProduct.querySelector('.single_price').textContent;
        const prod_total = currentProduct.querySelector('em').textContent;
        let new_total = 0;
        if (prod_total.totalPrice <= 0 || prod_total.totalPrice <= 0.00) {
            new_total = Number(e.target.value);
        }else{
            new_total = (single_price*e.target.value).toFixed(2)
        }
        currentProduct.querySelector('em').textContent = new_total
        currentProduct.querySelector('.prod-total').textContent = `Total: $${new_total}`;

        let total_prod_price = document.querySelectorAll(`.total-prod-price`);
        let subTotal = 0;

        total_prod_price.forEach(function (elem) {
            console.log(`yeyyyyyyyy ${elem.textContent}`);
            subTotal += Number(elem.textContent);
        })
        console.log(`heyyyyyyyy ${subTotal.toFixed(2)}`);
        displayTotalSection(subTotal.toFixed(2))
        updatLocalProds(id, e.target.value, new_total, subTotal.toFixed(2))
    }
});

// ==== Updating product in local storage ===============
function updatLocalProds(id, quantity, totalPrice, subTotal) {
    console.log(`${id}, ${quantity}, ${totalPrice}`)
    if (KEY in localStorage) {
        const productList = JSON.parse(localStorage.getItem(KEY));
        var indexOfObject = productList.findIndex(elem => elem.id === Number(id));
    
      // if (isExist)
        if (indexOfObject !== -1){
          var objectToUpdate = productList[indexOfObject];
          objectToUpdate.pQuantity = (!quantity) ? 0 : Number(quantity);
          console.error(`Product pQuantity ${objectToUpdate.pQuantity}`);
          if (objectToUpdate.totalPrice <= 0 || objectToUpdate.totalPrice <= 0.00) {
            // removeProduct(objectToUpdate.id)
            objectToUpdate.totalPrice = Number(totalPrice);
          }else{
            objectToUpdate.totalPrice = Number(totalPrice);
          }
          productList[indexOfObject] =  objectToUpdate;
        }else{
          //Add new Product to Existing my_cart in local storage
          console.error(`Product Does not exist`);
        }
        localStorage.setItem(KEY, JSON.stringify(productList));
        const myCartList1 = JSON.parse(localStorage.getItem(KEY));
        // displayCartProds(myCartList1) 
        // displayTotalSection(subTotal_price)
    }else{
        console.error(`Key ${KEY} Does not exist`);
    }
}

// export{getCartProducts, calSubTotal};