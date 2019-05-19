
const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses"

const makeGETRequest = (url) => {
    return new Promise(function (resolve, reject) {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest(); // not explorer
          } else if (window.ActiveXObject) { 
            xhr = new ActiveXObject("Microsoft.XMLHTTP"); //explorer
          }
            //xhr.timeout = 2000;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {reject(xhr.readyState)}
                }
            }
            xhr.open("GET", url);
            xhr.send();
    })
}

class GoodsItem {
    constructor(title="on design", price="on design", id_product="0", basket='', remv="Buy") {
        this.title = title;
        this.price = price;
        this.id_product = id_product;
        this.basket = basket;
        this.remv = remv;
    }
    render() {
        return `<div class="goods-item${this.basket}">
        <img src="img/${this.id_product}.jpg">
        <h3>${this.title}</h3>
        <p>${this.price} р.</p>
        <ol>
         <li>Porro</li>
         <li>Тemo</li>
        </ol>
        <button data-id="${this.id_product}" >${this.remv}</button>
        </div>`;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
        this.cartList = [];
    }

    fetchGoods() {
        return makeGETRequest(`${API_URL}/catalogData.json`)
            .then((goods) => {
                this.goods = JSON.parse(goods);
            }).catch(error => {
            console.log(error)
            })
    }

    addEvents(cart) {
        const buttons = [...document.querySelectorAll('.goods-item button')]; //делает массив из списка элементов -
        buttons.forEach((button) => {                                  // - спрэд оператор
            button.addEventListener('click', (e) => {
                e.preventDefault();//предотвратить событие поумолчанию
                const id = e.target.getAttribute('data-id');
                const product = this.goods.find((item) => {
                 return item.id_product == id
                })
                console.log(product);
                cart.add(product);
            })
        })
    }

    removeEvents(cart) {
        const cartButtons = [...document.querySelectorAll('.goods-item-basket button')];
        cartButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const id = e.target.getAttribute('data-id');
                const index =  this.goods.find((item) => {
                 return item.id_product == id
                })
                console.log(index);
                cart.remove(index);
            })
        })
    }
    
    render(cart, domPlace='.goods-list', basket='', remv='Buy') {
        let  listHtml ='';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.product_name, good.price, good.id_product, basket, remv)
            listHtml += goodItem.render()
        });
        document.querySelector(domPlace).innerHTML = listHtml;
        this.addEvents(cart);
        this.removeEvents(cart);
    }
}

class CartItem extends GoodsItem {
    // constructor(title="on design", price="on design", img="0") {
    //     super();
    //     let count = 1;
    // }
    // getCount() {
    //     return count;
    // }
    // setCount(newCount) {
    //     count=newCount;
    // }
}

class Cart  extends GoodsList {
    add(product){
        makeGETRequest(`${API_URL}/addToBasket.json`).then(() => {
            //console.log(cart);
            this.goods.push(product);
            this.render('', '.cart-list', '-basket', 'Удалить')
        })
    };
    // update(newCount){
    //     this.goods[index].setCount(newCount);
    // }
    remove(index){
        makeGETRequest(`${API_URL}/deleteFromBasket.json`).then(() => {
         this.goods.splice(index, 1);
        // console.log(cart);
         this.render('', '.cart-list', '-basket', 'del')
        })
    };
}


const list = new GoodsList();
const cart = new Cart();
//  cart.add().then(() => {
//      cart.render('', '.cart-list', '-basket');
//  })

list.fetchGoods().then(() => {
    list.render(cart);
}).catch((err) => console.error(err));