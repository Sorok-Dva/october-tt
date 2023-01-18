# October Technical Test Project

## Run application

Install project dependencies:

```bash
npm install
```

Create .env file:
```bash
cp .env.defaults .env
```

Download chromium from puppeteer :
```
node node_modules/puppeteer/install.js
```
Then update your .env file with the correct chrome path


Run local server:
```bash
npm start       
```

## Run tests
```bash
ENV=test npm run test
```

### API Documentation

Route | Method | Query String | Body | Description
-|-|-|-|-
`/brand/search` | post | - | `brand` | Search a phone number of a given brand
