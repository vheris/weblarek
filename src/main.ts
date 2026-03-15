import { Api } from './components/base/Api';
import './scss/styles.scss';
import { App } from './types/App';
import { Buyer } from './types/Buyer';
import { Cart } from './types/Cart';
import { Catagol } from './types/Catalog';
import { API_URL } from './utils/constants';

const buyerModel = new Buyer();
const cartModel = new Cart();
const catalogModel = new Catagol();

const baseApi = new Api(API_URL);
const appApi = new App(baseApi);

buyerModel.setData({
  payment: 'card',
  address: 'Москва',
  email: 'test@test.ru',
  phone: '+79990000000',
});

console.log('Покупатель:', buyerModel.getData());
console.log('Валидация покупателя:', buyerModel.validate());

async function init() {
    try {
        const productsResponse = await appApi.getProducts();

        catalogModel.setProducts(productsResponse.items);
        console.log('Массив товаров из каталога: ', catalogModel.getProducts());

        const products = catalogModel.getProducts()

        if (products.length > 1) {
        cartModel.cleanCart();

        cartModel.addItem(products[0]);
        cartModel.addItem(products[1]);

        console.log('Корзина: товары после добавления', cartModel.getItems());
        console.log('Корзина: количество', cartModel.getQuantity());
        console.log('Корзина: сумма', cartModel.getTotalPrice());
        console.log('Корзина: есть первый товар', cartModel.hasItem(products[0].id));

        cartModel.delItem(products[0].id);
        console.log('Корзина: после удаления первого товара', cartModel.getItems());

        cartModel.cleanCart();
        console.log('Корзина: после очистки', cartModel.getItems());
        } else {
        console.log('Недостаточно товаров для теста корзины');
        }
    }
    catch(err) {
        console.error("Ошибка загрузки: ", err)
    }
}

init();