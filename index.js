const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const authenticator = require('./middleware/authenticator');
const express = require('express');
const app = express();
const home = require('./routes/home');
const courses = require('./routes/courses');

app.set('view engine', 'pug');
app.set('views', './views');

console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
console.log(`app : ${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/', home);
app.use('/api/courses', courses);

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'production') {
  app.use(morgan('common'));
  //   app.use(morgan('tiny'));
  startupDebugger('Morgan Enabled');
  dbDebugger('Connected to db');
}

app.use(logger);
app.use(authenticator);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
