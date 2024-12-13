$(document).ready(function() {
    $(".nice-scroll").niceScroll({cursorwidth: '4px', autohidemode: false, railalign:'left',zindex: 999 });
});

let productCode = 1
let listProducts = [] 
let carts=[]
let infoPriceCalc=0



let items = document.querySelectorAll(".item")
let listProductHTML = document.querySelector(".listProductHTML")
let cartItemsHTML = document.querySelector(".cart-items")
let paymentAmount = document.querySelector(".payment-amount")
let amount = document.querySelector(".amount")
let cartHeaderQty = document.querySelector(".cart-header-qty")

items.forEach(item=>{
    item.classList.add(`product_${productCode}`)
    productCode = productCode+1
})


const addDataToHTML = () =>{
    listProductHTML.innerHTML = '';
    listProducts.forEach(product=>{
        let newProduct = document.createElement('div');
        newProduct.classList.add("item");
        newProduct.dataset.id = product.id;
        newProduct.innerHTML = `
        
        <img src = "${product.image}">
        <div class="product-detail">
            <span class="productName">${product.name}</span>
            <div class= "price">${product.price} <span class="currancy">ریال</span> </div>      
        </div>
        <button class = "addCart"> افزودن به سبد</button>
        `
        listProductHTML.appendChild(newProduct);
    })
}



listProductHTML.addEventListener('click',(e)=>{
    let positionClick = e.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
});

const addToCart = (product_id) =>{
    let productPosition = carts.findIndex((pos)=>pos.product_id==product_id) ;
    if(carts.length<=0){
        carts=[{
            product_id:product_id,
            quantity:1
        }]
    }else if(productPosition<0){
        carts.push({
            product_id : product_id,
            quantity:1
        });
    }
    else{
        carts[productPosition].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory=()=>{
    localStorage.setItem('cart',JSON.stringify(carts));
}


const addCartToHTML = ()=>{
    cartItemsHTML.innerHTML='';
    paymentAmount.innerText =0;
    amount.innerText= 0 ; 
    cartHeaderQty.innerText= 0 ; 
    let cartQty = 0;
    let totalQty = 0;
    let totalPayment = 0
    carts.forEach(cart=>{
        let productPosition = listProducts.findIndex((pos)=>pos.id==cart.product_id);
        let info = listProducts[productPosition];
        let cartItem = document.createElement("li");
        cartItem.classList.add("cart-item");
        cartItem.dataset.id = cart.product_id;
        cartItem.innerHTML=`
            <div class="product">
                <div class="product-img"><img src="${info.image}" alt=""></div>
                <div class="product-info">
                    <span class="product-name">${info.name}</span>
                    <span class="product-price">${info.price}</span>
                </div>
            </div>
            <div class="product-qty">
                <btn class="plus">+</btn>
                <span class="qty">${cart.quantity}</span>
                <btn class="minus">-</btn>
            </div>
        `
        cartItemsHTML.appendChild(cartItem);
        infoPriceCalc = parseInt((info.price).replaceAll(",",""))
        // totalPayment+= cart.quantity* Number((info.price).replace(",",""));
        totalPayment += cart.quantity* infoPriceCalc
        paymentAmount.innerText = totalPayment.toLocaleString();
        totalQty+=cart.quantity;
        amount.innerText=totalQty;
    })
    cartQty+=carts.length;
    cartHeaderQty.innerText=cartQty;
}




cartItemsHTML.addEventListener('click',(event)=>{
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') ||positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQty(product_id,type);
    }
})

const changeQty = (product_id,type) =>{
    let productPosition = carts.findIndex((pos)=>pos.product_id==product_id);
    if(productPosition>=0){
        switch(type){
            case 'plus':
                carts[productPosition].quantity+=1;
                break;
            default:
                let qty = carts[productPosition].quantity-1
                if(qty>0){
                    carts[productPosition].quantity = qty;
                }else{
                    carts.splice(productPosition,1)
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}





const initApp = () =>{
    fetch('./assets/js/products.json')
    .then(response=>response.json())
    .then(data=>{
        listProducts = data;
        // console.log(data);
        addDataToHTML();

        //get cart from memory
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}

initApp();
