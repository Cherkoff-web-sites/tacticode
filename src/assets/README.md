# Структура папок для изображений

## Куда складывать изображения:

### `src/assets/images/` - Картинки для контента
- `news/` - картинки для новостей (news-1.jpg, news-2.jpg и т.д.)
- `subscriptions/` - картинки для подписок (football.jpg, basketball.jpg и т.д.)
- `hero/` - картинки для hero-секции

### `src/assets/icons/` - Иконки и логотипы
- `logo.svg` или `logo.png` - логотип сайта
- Другие иконки

## Как использовать в коде:

```jsx
// Импорт изображений
import logo from '../assets/icons/logo.svg';
import newsImage1 from '../assets/images/news/news-1.jpg';

// Использование
<img src={logo} alt="Logo" />
<img src={newsImage1} alt="News" />
```

## Альтернатива: папка public/

Если вы хотите использовать папку `public/`, создайте её в корне проекта:
```
prod/
└── public/
    ├── images/
    └── icons/
```

Тогда изображения будут доступны по пути:
```jsx
<img src="/images/logo.png" alt="Logo" />
```
