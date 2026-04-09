import { Api } from "./components/base/Api";
import "./scss/styles.scss";
import { App } from "./components/appAPI/App";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { Catagol } from "./components/models/Catalog";
import { Basket } from "./components/views/Basket";
import { ContactForm, OrderForm } from "./components/views/Form";
import { Gallery } from "./components/views/Gallery";
import { Modal } from "./components/views/Modal";
import { Success } from "./components/views/Success";
import { Cart } from "./components/models/Cart";
import { Buyer } from "./components/models/Buyer";
import { Header } from "./components/views/Header";
import { CardBasket, CardDetails, CardGallery } from "./components/views/Card";
import { cloneTemplate } from "./utils/utils";
import { apiProducts } from "./utils/data";
import { BuyerData, BuyerValidationErrors, ProductData } from "./types";


const baseApi = new Api(API_URL);
const appApi = new App(baseApi);

const event = new EventEmitter();
const catalog = new Catagol(event);
const basket = new Basket( cloneTemplate<HTMLElement>("#basket"), event);
const contactForm = new ContactForm( cloneTemplate<HTMLElement>("#contacts"), event);
const orderForm = new OrderForm(cloneTemplate<HTMLElement>("#order"), event);
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const modal = new Modal(event,document.querySelector('#modal-container') as HTMLElement);
const successModal = new Success(cloneTemplate<HTMLElement>("#success"), event);
const cart = new Cart(event);
const buyer = new Buyer(event);
const header = new Header(event, document.querySelector(".header") as HTMLElement);
const cardDetail = new CardDetails(cloneTemplate<HTMLElement>("#card-preview"), event);

const getErrors = (errors: BuyerValidationErrors, fields: (keyof BuyerValidationErrors)[]): string[] => {
    return fields.map((field) => errors[field]).filter((error): error is string => !!error);
}

event.on('products.update', () => {
    const items = catalog.getProducts();
    const cards = items.map((item) => {
        const card = new CardGallery(
            cloneTemplate<HTMLElement>("#card-catalog"),
            {
                onClick: () => event.emit('card.select', item),
            }
        );

        return card.render({
            id: item.id,
            title: item.title,
            price: item.price,
            category: item.category,
            image: item.image,
        });
    });

    gallery.items = cards;
});

event.on<ProductData>('card.select', (product) => {
    catalog.selectProduct(product);
});

event.on('product.current', () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;

    const unavailable = product.price === null;
    const inCart = cart.hasItem(product.id);

    modal.content = cardDetail.render({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
        description: product.description,
        buttonDisabled: unavailable || inCart,
        buttonText: unavailable ? 'Недоступно' : inCart ? 'Уже в корзине' : 'Купить',
    });
    modal.open();
});

event.on('cart.update', () => {
    const items = cart.getItems();
    const cartItems = items.map((item, index) => {
        const cartItem = new CardBasket(cloneTemplate<HTMLElement>("#card-basket"), { onClick: () => event.emit('basket.remove', {id: item.id}) });
        return cartItem.render({
            id: item.id,
            title: item.title,
            price: item.price,
            index: index + 1,
        });
    });
    basket.list = cartItems;
    basket.total = cart.getTotalPrice();
    basket.buttonDisabled = cart.getQuantity() === 0;
    header.counter = cart.getQuantity();
})

event.on<Partial<BuyerData>>('order.change', (data) => {
  buyer.setData({ ...buyer.getData(), ...data });
});

event.on<{ email?: string; phone?: string }>('contacts.change', (data) => {
  buyer.setData({ ...buyer.getData(),  ...data });
});

event.on('buyer.changed', () => {
    const data = buyer.getData();
    orderForm.address = data.address;
    orderForm.payment = data.payment;
    contactForm.phone = data.phone;
    contactForm.email = data.email;

    const errors = buyer.validate();
    event.emit('order.validation', {
        valid: !errors.payment && !errors.address,
        errors: getErrors(errors, ['payment', 'address']),
    });
    event.emit('contacts.validation', {
        valid: !errors.email && !errors.phone,
        errors: getErrors(errors, ['email', 'phone']),
    });
});

event.on<{ valid: boolean; errors: string[] }>('contacts.validation', ({ valid, errors }) => {
    contactForm.valid = valid;
    contactForm.errors = errors;
});

event.on<{ valid: boolean; errors: string[] }>('order.validation', ({ valid, errors }) => {
    orderForm.valid = valid;
    orderForm.errors = errors;
});

event.on('basket.add', () => {
    const product = catalog.getSelectedProduct();
    if (!product) {
        return;
    }

    if (cart.hasItem(product.id)) {
        cart.deleteItem(product.id);
    } else {
        cart.addItem(product);
    }

    modal.close();
});

event.on<{ id: string }>('basket.remove', ({ id }) => {
    const product = catalog.getProductById(id);
    if (product) {
        cart.deleteItem(product.id);
    }
});

event.on('basket.open', () => {
    modal.content = basket.render();
    modal.open();
});

event.on('basket.buy', () => {
    modal.content = orderForm.render();
    modal.open();
});

event.on('order.submit', () => {
    modal.content = contactForm.render();
    modal.open();
});

event.on('contacts.submit', async () => {
    const orderData: BuyerData = buyer.getData();
    const order = {
        ...orderData,
        items: cart.getItems().map((item) => item.id),
        total: cart.getTotalPrice(),
    };

    try {
        const result = await appApi.createOrder(order);

        modal.content = successModal.render({
            total: result.total
        });
        modal.open();
        cart.cleanCart();
        buyer.clear();
    } catch (error) {
        console.error('Не удалось отправить заказ:', error);
    }
});

event.on('success.close', () => {
    modal.close();
});

basket.buttonDisabled = cart.getQuantity() === 0;


async function loadProducts(): Promise<void> {
    try {
        const data = await appApi.getProducts();
        catalog.setProducts(data.items);
    } catch (error) {
        console.error('Не удалось загрузить товары:', error);
    }
}

void loadProducts();
