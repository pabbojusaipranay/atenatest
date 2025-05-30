export {};
const app = require('./app');
const config = require('./config');


app.listen(config.port, () => {
  console.log(`Server is listening on port ${config.port}`);
});