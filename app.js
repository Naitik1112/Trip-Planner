const path = require('path');
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const passport = require('passport');
const session = require('express-session');

const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const viewRouter = require('./routes/viewRoutes');
const itineraryRoutes = require('./routes/itenaryRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));

require('./controllers/passport'); // Add the passport configuration file

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Register Google auth routes
app.use(authRoutes);

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(cors());

app.options('*', cors());

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/itinerary', itineraryRoutes);

app.use((req, res, next) => {
  if (req.url.endsWith('.map')) {
    return res.status(404).send('Not Found');
  }
  next();
});

// 4) 404 Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 5) Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
