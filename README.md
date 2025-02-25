# 📱 **API per a la Gestió d'una Aplicació d'un joc de plantes 🌱**

Aquest projecte consisteix en el desenvolupament d'una API RESTful per a la gestió d'una aplicació relacionada amb plantes. L'API està desenvolupada amb Node.js i Express, utilitzant MySQL com a base de dades i Swagger per a la documentació automàtica.

## 🌟 **Tecnologies Utilitzades 🛠️**
---

- **Node.js**: Entorn d'execució per a JavaScript al servidor.
- **Express**: Framework per a la creació de servidors web i APIs RESTful.
- **MySQL (mysql2)**: Connector per interactuar amb la base de dades MySQL de manera eficient.
- **Swagger (swagger-jsdoc i swagger-ui-express)**: Eines per a la generació i visualització de la documentació de l'API.
- **dotenv**: Biblioteca per a la gestió de variables d’entorn.
- **CORS**: Middleware per habilitar l'accés des de diferents dominis.
- **body-parser**: Middleware per parsejar cossos de sol·licituds en format JSON.
- **bcrypt i bcryptjs**: Llibreries per al xifrat segur de contrasenyes.
---

## Estructura del Projecte 📂

El projecte s'organitza en els següents arxius i carpetes:

- **bd/**: Conté l'escript de la base de dades MySQL.
- **config/**: Configuracions globals, com la connexió a la base de dades.
- **middleware/**: Conté middlewares per a la seguretat, autenticació i validació.
- **node_modules/**: Dependències instal·lades amb npm.
- **routes/**: Defineix les rutes de l'API, separades per funcionalitats.
- **.env**: Variables d’entorn, com credencials de la BD o claus JWT.
- **app.js**: Punt d’execució de l’API.
- **swagger.js**: Arxiu de configuració Swagger per a la documentació automàtica de l'API.
- **package.json i package-lock.json**: Gestionen dependències i metadades del projecte.
- **README.md**: Documentació del projecte.

## Endpoints de l'API 🌐

### Usuaris 👤
- **GET** `/usuaris`: Llista tots els usuaris.
- **GET** `/usuaris/:id`: Obté un usuari per ID.
- **POST** `/usuaris`: Crea un nou usuari.
- **PUT** `/usuaris/:id`: Actualitza un usuari existent.
- **DELETE** `/usuaris/:id`: Elimina un usuari.
- **GET** `/usuaris/correu/:correu`: Cerca un usuari per correu.
- **PUT** `/usuaris/btc/:userId`: Actualitza el saldo BTC d'un usuari.

### Plantes 🌿
- **GET** `/plantas`: Llista totes les plantes.
- **GET** `/plantas/usuaris/:id`: Llista les plantes d'un usuari específic.
- **GET** `/plantas/:id`: Obté una planta per ID.
- **POST** `/plantas`: Crea una nova planta.
- **PUT** `/plantas/:id`: Actualitza una planta existent.
- **DELETE** `/plantas/:id`: Elimina una planta.

### Items 🛒
- **POST** `/items/items_usuaris`: Realitza una compra d'ítems, actualitzant el saldo BTC i assignant ítems a l'usuari.
- **GET** `/items`: Llista tots els ítems.

### Autenticació 🔐
- **POST** `/login`: Realitza el login i torna un JWT.

## Instal·lació i Configuració ⚙️

### Requisits Previs 📋
- **Node.js i npm**: Instal·lats en el sistema.
- **Base de dades MySQL**: Configurada i en execució.

### Instal·lació de Dependències 📦
Un cop clonat el repositori, executeu el següent comandament dins del directori del projecte per instal·lar les dependències necessàries:

```bash

npm install
```
Configuració de l'Entorn 🌐
Crea un fitxer .env al directori arrel del projecte amb les següents variables (ajusta-les segons la teva configuració):

DB_HOST=localhost
DB_USER=el_teu_usuari
DB_PASSWORD=la_teva_contrasenya
DB_NAME=el_teu_nom_de_base_de_dades
JWT_SECRET=una_clau_secreta_per_al_JWT
PORT=3000

Aquestes variables són necessàries per connectar-se a MySQL i generar el JWT per a l'autenticació.
Assegura't que la base de dades MySQL tingui les taules necessàries (per exemple, items, usuaris, etc.) creades i configurades segons l'estructura que espera el codi.

Execució de la API 🚀
Per iniciar la API i tenir els endpoints disponibles:

Executa el següent comandament al directori del projecte:

node app.js

Això posarà en marxa el servidor, per defecte al port 3000 (o el que hagis definit a .env).
Quan el servidor estigui en funcionament, veuràs un missatge a la consola com ara Servidor corrent al port 3000.

Prova dels Endpoints 🛠️

Utilitza una eina com Postman per testar els endpoints:

POST http://localhost:3000/login: Envia un cos JSON amb les credencials (per exemple, {"username": "usuari", "password": "contrasenya"}) per obtenir un JWT.
POST http://localhost:3000/items/items_usuaris: Inclou el JWT al capçalera Authorization (com Bearer <token>) i un cos JSON amb els detalls de la compra.
GET http://localhost:3000/items: Llista els ítems disponibles (pot requerir autenticació segons la implementació).
