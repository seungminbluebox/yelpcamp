// app.js
// if (process.env.NODE_ENV !== 'production') {
// require('dotenv').config()
// }
require('dotenv').config()

const express = require('express')
const path = require('path')
const app = express()
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')//
const { title } = require('process')//
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoDBStore = require("connect-mongo")(session)


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, {
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error!'))
db.once('open', () => {
    console.log('database connected')
})

const store = new MongoDBStore({
    url: dbUrl,
    secret: 'thisisscret',
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log('session store erroe', e)
})

const sessionConfig = {
    store: store,
    name: 'park',
    secret: 'thisisscret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet({ contentSecurityPolicy: false }))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(req.query)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'park@gmail.com', username: 'park' })
    const newUser = await User.register(user, 'chicken')
    res.send(newUser)
})

const userRoutes = require('./routes/user')
const campgroundRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/review')

app.use('/', userRoutes)
app.use('/campground', campgroundRoutes)
app.use('/campground/:id/reviews', reviewsRoutes)



app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {  //상단에 적용되지않았던 요청만 점점 내려와서 이 요청을 받게됨
    next(new ExpressError('page not found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'st wnt wrng!' } = err
    if (!err.message) err.message = 'something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('serving on 3000!')
})