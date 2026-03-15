import { Api } from './components/base/Api';
import './scss/styles.scss';
import { App } from './types/App';
import { Buyer } from './types/Buyer';
import { Cart } from './types/Cart';
import { Catagol } from './types/Catalog';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

let buyerModel = new Buyer();
let cartModel = new Cart();
let catalogModel = new Catagol();

const baseApi = new Api(API_URL);
const appApi = new App(baseApi);


async function init() {
    try {
        const productsResponse = await appApi.getProducts();

        catalogModel.setProducts(productsResponse.items);
        console.log('Массив товаров из каталога: ', catalogModel.getProducts());
    }
    catch(err) {
        console.error("Ошибка загрузки: ", err)
    }
}

init();