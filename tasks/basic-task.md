# Wallet Core API

REST API приложение написанное на TypeSctipt и NestJS, построенное вокруг библиотеки
@trustwallet/wallet-core, которое предоставляет функции кошелька.

Взаимодействие с функционалом wallet-core происходит через adapter и полностью изолировано там.
Эти адаптеры принимают свое DTO в качестве аргумента и возвращают свое DTO в качестве ответа.


Примерная структура проекта:

src
- common
  -- mnemonic
  --- dto
  ---- request
  ----- create-mnemonic.request.ts
  ----- validate-mnemonic.request.ts
  ----- ....
  ---- response
  ----- create-mnemonic.response.ts
  ----- validate-mnemonic.response.ts
  --- enum
  ---- ....
  --- mnemonic.controller.ts
  --- mnemonic.module.ts
  --- ....
- coins
  -- bitcoin
  --- dto
  ---- request
  ----- create-bitcoin-address.request.ts
  ----- validate-bitcoin-address.request.ts
  ----- ....
  ---- response
  ----- create-bitcoin-address.response.ts
  ----- validate-bitcoin-address.response.ts
  ----- ....
  --- enum
  ---- ....
  --- service
  ---- bitcoin-address.service.ts
  ---- bitcoin-transaction.service.ts
  --- bitcoin-address.controller.ts
  --- bitcoin-transaction.controller.ts
  --- bitcoin.module.ts
- adapter
  -- common - какой-то общий функционал
  --- dto - DTO для адаптера
  ---- mnemonic - DTO для мнемоники
  ----- create-mnemonic.dto.ts
  ----- validate-mnemonic.dto.ts
  ---- ....
  --- mnemonic.adatpter.ts - адаптер работы с mnemonic
  --- wallet-core.adapter.ts - инициализация WASM
  -- coins - тут у нас лежат адаптеры для монет
  --- bitcoin
  ---- bitcoin-transaction.adatpter.ts
  ---- bitcoin-address.adapter.ts
  --- tron
  ---- tron-transaction.adapter.ts
  ---- ....


## Основные возможности
Все параметры в REST-API должны жестко валидироваться и/или иметь возмодные значения (enum).


### Генерация мнемоники. (POST: api/v1/mnemonic/generate)
Позволяет сгененрировать мнемонику с возможностью указать passphrase и strength.
Пример запроса:
{
"strength": 128, // Entropy strength in bits
"passphrase": "123456" // Optional BIP39 passphrase
}

Пример ответа:
{
"mnemonic": "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
"isPassphraseUsed": true,
"strengthBits": 128
}


### Валидация мнемоники (POST: api/v1/mnemonic/validate)
Позволяет проверить корректность мнемоники
Пример запроса:
{
"mnemonic": "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
"passphrase": "123456" // Optional BIP39 passphrase
}

Пример ответа:
{
"isValid": true,
}

### Генерация адреса (POST: api/v1/address/{coin}/generate)
Генерация адреса для каждый монеты происходит путем передачи мнемоники, пароля и derivation. Важно учитывать тот факт, что для каждой монеты drivation может быть разный и запрос/ответ соответственно тоже может быть разный.

Пример запроса:
{
"mnemonic": {
"value": "сама мнемоника",
"passphrase": "если есть или пустая строка"
},
"derivation": {
"account": 0, // Account index in path
"change": 0, // Change: 0 — external (receive), 1 — change.
"index": 0 // Address index (last component of derivation path).
}
}

Пример ответа:
{
"address": "тут у нас адрес конкретной монеты",
"keys": {
"public": "публичный ключ в hex",
"private": "приватный ключ в hex",
},
"derivation": {
"path": "Полный path в строке",
"purpose": 84,
"coin": "Coin number used for derivation",
"account": "Account index in path",
"change": "Change: 0 — external, 1 — change",
"index": "Address index (last component of derivation path)"
}
}

### Валидация адреса (POST: api/v1/address/{coin}/validate)
Позволяет валидировать адрес

Пример запроса:
{
"address": "адрес монеты"
}

Пример ответа:
{
"isValid": true,
}

### Создание и подпись обычной транзакции (POST: api/v1/transaction/{coin}/build-transaction)

Это обычная транзакция. Примеры запросов и ответов специфичны для каждой монеты.


### Создание и подпись транзакции перевода токенов (POST: api/v1/transaction/{coin}/build-transfer)

В данном случае если монета предусматривает перевод токенов, например BRC20, TRC20, ERC20 или другие
переводы как смарт-контракт. Примеры запросов и ответов специфичны для каждой монеты.

Примеры работы с библиотекой можно посмотреть в тестах: https://github.com/trustwallet/wallet-core/tree/master/wasm/tests


Дополнительные требования:
1) Изучи текущий код и файлы проекта
2) Составить план разработки и разбить его на маленькие задачи
3) Основные пакеты для работы уже установлены и следует использовать их
4) Если необходимо установить новые пакеты, то устанавливать только свежие пакеты (убедиться в этом два раза)
