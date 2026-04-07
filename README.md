# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Типы данных    

#### Интерфейс ProductData      
Описывает структуру данных одного товара, получаемого с сервера и используемые в каталоге, карточке товара и корзине.       

Свойства интерфейса:        
`id: string` - уникальный идентификатор товара.     
`title: string` - наименование товара.      
`image: string` - путь до изображения.      
`category: string` - категория товара.      
`price: number | null` - цена товара.       
`description: string` - описание товара.        

#### Интерфейс BuyerData        
Описывает структуру данных покупателя, необходимых для оформления заказа.       

Свойства интерфейса:        
`payment: Payment` - выбранный тип оплаты.      
`address: string` - адрес покупателя.       
`email: string` - адрес электронной почты покупателя.       
`phone: string` - номер телефона покупателя.        

#### Интерфейс ProductListResponse
Описывает ответ сервера при запросе списка товаров.

Свойства типа:  
`total: number` — общее количество товаров в каталоге.  
`items: ProductData[]` — массив товаров.

#### Интерфейс OrderRequest
Описывает данные, отправляемые на сервер при оформлении заказа.  

Свойства типа:  
`payment: Payment` — выбранный способ оплаты.  
`address: string` — адрес доставки.  
`email: string` — электронная почта покупателя.  
`phone: string` — номер телефона покупателя.  
`items: string[]` — массив идентификаторов выбранных товаров.  
`total: number` — итоговая сумма заказа.

#### Интерфейс OrderResponse
Описывает ответ сервера после успешного создания заказа.

Свойства типа:  
`id: string` — идентификатор созданного заказа.  
`total: number` — подтвержденная сервером сумма заказа.     

### Модели

#### Класс Buyer        
Хранит и управляет данными покупателя, необходимыми для оформления заказа.      

Атрибуты:       
`#data: BuyerData` - хранит данные покупателя.      
Методы:
`setData(data: Partial<BuyerData>): void` - частично обновляет данные клиента.      
`getData(): BuyerData` - возвращает все текущие данные покупателя.      
`clear(): void` - чищает данные покупателя.     
`validate(): BuyerValidationResult` - осуществляет валидацию данных.         

#### Класс Cart     
Класс, реализующий бизнес-логику работы с корзиной покупок. Содержит методы для управления товаром, расчета стоимости покупок и проверки наличия.       

Атрибуты:       
`#items: ProductData[]` - приватное поле, хранит массив товаров, добавленных в корзину.     
Методы:     
`addItem(product: ProductData): void` - добавляет товар в корзину.      
`delItem(productId: string): void` - удаляет товар по его идентификатору.       
`cleanCart(): void` - очищение корзины.     
`getQuantity(): number` - возвращает количество товара.     
`getItems(): ProductData[]` - возвращает массив товаров, находящихся в корзине.     
`getTotalPrice(): number` - вычисляет и возвращает суммарную стоимость всех товаров в корзине.      
`hasItem(productId: string): boolean` - проверяет наличие товара в корзине, возвращает true если товар есть, иначе false.       

#### Класс Catalog      
Класс для управления каталогом товаров на главной страничке. Отвечает за хранение списка товаров и управление выбранной карточкой товара.       

Атрибуты:  
`#products: ProductData[]` - приватное поле, хранит массив всех доступных товаров в каталоге.  
`#selectedProduct: ProductData | null` - приватное поле, хранит текущую выбранную карточку товара или null, если ничего не выбрано.  
Методы:     
`getProducts(): ProductData[]` - возвращает массив всех товаров в каталоге.     
`setProducts(products: ProductData[]): void` - устанавливает новый массив товаров.      
`selectProduct(product: ProductData): void` - сохраняет выбранную карточку товара.      
`getSelectedProduct(): ProductData | null` - возвращает текущую выбранную карточку товара или null, если ничего не выбрано.     
`getProductById(productID: string): ProductData | null` - возвращает товар по его id или в null при отсутствии.     

### Слой коммуникации       

#### Класс App
Класс App реализует слой коммуникации с сервером.  

Конструктор:  
`constructor(api: IApi)` — принимает экземпляр API-клиента.

Атрибуты:  
`api: IApi` — объект для выполнения HTTP-запросов.

Методы класса:  
`getProducts(): Promise<ProductListResponse>` — выполняет GET-запрос на эндпоинт /product/ и возвращает объект с массивом товаров.  
`createOrder(order: OrderRequest): Promise<OrderResponse>` — выполняет POST-запрос на эндпоинт /order/, отправляет данные покупателя и выбранных товаров, возвращает объект подтверждения покупки с итоговой суммой.

### Слой представления

#### Класс Header
Класс, реализующий логику работы иконки корзины. При клике на кнопку корзины эмитит событие `basket.open`.  

Интерфейс данных: `внутренний HeaderData`     
Поля данных: `counter: number`  
Поля класса: `counterElement: HTMLElement`, `basketButton: HTMLButtonElement`   
Конструктор: `constructor(Event: IEvent, cointainer: HTMLElement)`  
Сеттеры: `set counter(value: number)` - обновление счетчика корзины.    

#### Класс Gallery
Класс, реализующий добавление/обновление карточек каталога. 

Интерфейс данных: `внутренний GalleryData`  
Поля данных: `items: HTMLElement[]` 
Поля класса: `catalogElement: HTMLElement`  
Конструктор: `constructor(container: HTMLElement)`  
Сеттеры: `set items(items: HTMLElement)`    

#### Класс Modal
Класс для управления модальным окном. Отвечает за открытие, закрытие и динамическую замену контента внутри модального окна. Обрабатывает событие `OnClick`.  

Интерфейс данных: `внутренний ModalData`    
Поля данных: `content: HTMLElement` 
Поля класса: `closeButton: HTMLButtonElement`, `modalContent: HTMLElement`  
Конструктор: `constructor(Event: IEvent, container: HTMLElement)`   
Методы: `open()` - открытие модального окна, за счет добавления класса `modal_active` элементу , `close()` - закрытие модального окна за счет удаления класса   
Сеттеры: `set content(value: HTMLElement)` - меняет содержимое модального окна. 

#### Класс Card
Базовый класс для создания карточек товара. Отвечает за отображение названия и цены.    

Интерфейс данных: `внутренний CardData` 
Поля данных: `id: string`, `title: string`, `price: number | null`   
Поля класса: `cardTitle: HTMLElement`, `cardPrice: HTMLElement`, `cardButton?: HTMLButtonElement`   
Конструктор: `constructor(container: HTMLElement)`  
Сеттеры: `set title(value: string)`, `set price(value: number | null)`

#### Класс CardGallery
Класс для карточек товара на главной странице сайта, расширяющий базовый класс Card. Отвечает за дополнительное отображение изображения товара и категории товара. Обрабатывает событие `OnClick`. 

Интерфейс данных: `внутренний CardGalleryData`  
Поля данных: `category: string`, `image: string` 
Поля класса: `cardImage: HTMLElement`, `cardCategory: HTMLElement`, `actions?: cardActionsInterface`    
Конструктор: `constructor(container: HTMLElement, actions?: cardActionsInterface)`  
Сеттеры: `set cardImage(value: string)` - устанавливает изображение товара, `set cardCargory(value: string)` - устанавливает категорию товара и добавляет CSS-класс 

#### Класс CardDetails
Класс для открытых карточек товара, расширяющий CardGallery. Отвечает за дополнительное отображение описания товара и кнопку покупки товара. При клике на кнопку "Купить" эмитит событие `basket.add`.    

Интерфейс данных: `внутренний CardDetailsData`      
Поля данных: `description: string`,  `buttonDisabled: boolean`, `buttonText: string`    
Поля класса: `cardDescription: HTMLElement`, `cardButton: HTMLElement`, `event: EventInterface`
Конструктор: `constructor(container: HTMLElement, event?: IEvents)`
Сеттеры: `set cardDescription(value: string)` - устанавливает описание товара, `set buttonText(value: string)` - устанавливает подпись на кнопке, `set buttonDisabled(value: boolean)` - изменяет доступность кнопки    

#### Класс CardBasket
Класс для карточек товара в корзине, расширяющий базовый класс Card. Отвечает за дополнительное отображение номера товара в корзине. Обрабатывает событие `OnClick`.    

Интерфейс данных: `внутренний CardBasketData`   
Поля данных: `index: number`   
Поля класса: `cardButton: HTMLElement`, `indexElement: HTMLElement`, `actions?: cardActionsInterface`   
Конструктор: `constructor(container: HTMLElement, actions?: cardActionsInterface)`  
Сеттеры: `set index(value: number)` - устанавливает порядковый номер товара в корзине   

#### Класс Basket
Класс корзины товаров. Отвечает за отображения товаров, общей суммы, кнопки оформления. При клике на кнопку "Оформить" эмитит событие `basket.buy`. 

Интерфейс данных: `внутренний BasketData`   
Поля данных: `total: number`, `buttonDisabled: boolean`, `items: HTMLElement[]` 
Поля класса: `cardList: HTMLElement`, `cardTotal: HTMLElement`, `cardButton: HTMLButtonElement` 
Конструктор: `constructor(container: HTMLElement, event?: IEvents)`  
Сеттеры: `set cardList(value: HTMLElement[])` - устанавливает список товаров, желаемых к покупке, `set cardTotal(value: number)` - устанавливает стоимость товаров из корзины, `set buttonDisabled(value: boolean)` - отвечает за активацию кнопки "Оформить"   

#### Класс Form
Базовый класс для форм. Отвечает за доступность формы и вывод ошибок. При отправке формы эмитит событие `${form.name}.submit`. 

Интерфейс данных: `внутренний FormData` 
Поля данных: `valid: boolean`, `errors: string[]`   
Поля класса: `formSubmit: HTMLElement`, `fromErrors: HTMLElement`   
Конструктор: `constructor(container: HTMLElement, event?: IEvents)`    
Сеттеры: `set valid(value: boolean)` - управляет активацией кнопки отправки формы, `set errors(value: string[])` - вывод ошибки 

#### Класс OrderForm.
Класс для форм, расширяющий базовый класс Form. Отвечает за функциональность кнопок выбора метода оплаты и установку значения в поле адреса. При изменении полей эмитит событие `order.change`. 

Интерфейс данных: `внутренний OrderFormData`    
Поля данных: `payment: Payment`, `address: string`  
Поля класса: `cardButton: HTMLButtonElement`, `cashButton: HTMLButtonElement`, `formAdress: HTMLElement`    
Конструктор: `constructor(container: HTMLElement, event?: IEvents)`  
Сеттеры: `set payment(value: Payment)` - управляет состоянием активности кнопок выбора типа оплаты, `set address(value: string)` - устанавливает значение поля адреса   

#### Класс ContactForm
Класс для форм, расширяющий базовый класс Form. Отвечает за функциональность полей ввода. При изменении полей эмитит событие `contact.change`.  

Интерфейс данных: `внутренний ContactFormData`
Поля данных: `email: string`, `phone: string`
Поля классов: `formEmail: HTMLElement`, `formPhone: HTMLElement`    
Конструктор: `constructor(container: HTMLElement, event?: IEvents)`  
Сеттеры: `set email(value: string)`, `set phone(value: string)`

#### Класс Success
Класс, отвечающий за отображение суммы списания денежных средств после оформления покупки. При нажатии эмитит событие `success.close`   

Интерфейс данных: `внутренний SuccessData`  
Поля данных: `total: number`    
Поля классов: `successTotal: HTMLElement`, `closeButton: HTMLButtonElement`
Конструктор: `constructor(container: HTMLElement, event?: IEvents)` 
Сеттеры: `set total(value: number)` - устанавливает сумму списания денежных средств.