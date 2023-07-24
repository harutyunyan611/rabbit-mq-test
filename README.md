### About

- Microservice "M1" is accepting HTTP requests, processing them and publishing them to Cloud Rabbit AMQP
- Cloud AMQP is receiving them, adding in queue
- Microservice "M2" is accepting messages from queue and processing them

### Installation and usage

1. Clone repository
   `git clone`
2. Install npm packages
   `npm i`
3. Copy .env.example file, rename it into .env and write your credentials

### API

POST Create product

`localhost:3000/api/products`

JSON
```json
{
    "name": "Test",
    "price": 1000
}
```


POST Create order

`localhost:3000/api/orders`

JSON
```json
{
    "items": ["64bd077a9655d82bc24f136c"],
    "email": "test@gmail.com",
    "phoneNumber": "12345438877"
}
```