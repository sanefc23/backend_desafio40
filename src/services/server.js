const express = require("express");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const {
    engine
} = require("express-handlebars");
const PATH = require('path')
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const config = require('../config/config');
const mainRouter = require('../routers/mainRouter');
const MongoDBClient = require("../services/dbMongo");
const MongoStore = require("connect-mongo")
const passport = require('passport');
const flash = require('connect-flash');
const compression = require('compression');
const args = require('minimist')(process.argv);
const PORT = process.env.PORT || args[2];
const logger = require('./logger');
const Products = require('../APIs/productsAPI')

const {
    fork
} = require("child_process");
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// --- MongoDB Models ---
const Message = require("../models/Message");
const Product = require("../APIs/productsAPI");

// --- Normalizr ---
const normalizr = require('normalizr');
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;

const author = new schema.Entity('authors', {}, {
    idAttribute: 'email'
})
const text = new schema.Entity('texts', {
    author: author
}, {
    idAttribute: '_id'
})

// middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("./public"));
app.use(cookieParser());
app.use(flash());
app.use(compression());

// --- Session ---
const sessionOptions = {
    store: MongoStore.create({
        mongoUrl: config.MONGO_ATLAS_URL
    }),
    secret: 's3cr3t0',
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: 60 * 1000000
    }
}

app.use(session(sessionOptions));

// --- PASSPORT ---
app.use(passport.initialize());
app.use(passport.session());
app.use(function (err, req, res, next) {
    console.log(err);
});

// Routers
app.use('/', mainRouter);

app.get('/', (req, res) => {
    res.redirect('/productos')
});

app.get('/info', (req, res) => {
    logger.info(req.route);
    res.json({
        argsEntrada: process.argv,
        sistOperativo: process.platform,
        nodeVersion: process.version,
        reservedMemory: process.memoryUsage().rss,
        executionPath: process.cwd(),
        processId: process.pid,
        cores: numCPUs,
        //carpetacorriente??
    })
})

app.get('/randoms/:num?', (req, res) => {
    logger.info(req.route);
    const cantidad = parseInt(req.params.num) || 100000000;
    const computo = fork("./computo.js");
    computo.send(cantidad);
    computo.on("message", (sum) => res.send(sum));
})

app.use(function (req, res) {
    logger.warn('404 - NOT FOUND')
    res.sendStatus(404)
});

// handlebars engine
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: PATH.resolve() + "/views",
        partialsDir: PATH.resolve() + "/views/partials",
    })
);

app.set("views", "views");
app.set("view engine", "hbs");

//Mongoose
connect()

async function connect() {
    await MongoDBClient.getConnection()
        .then(() => {
            logger.info('Conectado a la base de datos...')
        })
        .catch(error => logger.info('Error al conectarse a la base de datos', error));
}

io.on('connection', (socket) => {
    //funcion para leer todos los mensajes de la db y mostrarlos.
    function selectAllMessages() {
        Message.find().sort({
                'date': -1
            })
            .then(messages => {
                const parsedMessages = messages.map(function (m) {
                    return {
                        _id: m._id.toString(),
                        author: {
                            email: m.author.email,
                            name: m.author.name,
                            lastName: m.author.lastName,
                            age: m.author.age,
                            alias: m.author.alias,
                            avatar: m.author.avatar
                        },
                        text: m.text,
                        timeStamp: m.timeStamp
                    };
                })
                const normalizedMsgs = normalize(parsedMessages, [text]);
                logger.info('Longitud antes de normalizar:', JSON.stringify(messages).length);
                logger.info('Longitud después de normalizar:', JSON.stringify(normalizedMsgs).length);
                socket.emit('messages', {
                    messages: messages,
                    normalizedMsgs: normalizedMsgs,
                });
            })
            .catch(e => {
                logger.error('Error getting messages: ', e);
            });
    }

    //funcion para leer todos los productos de la db y mostrarlos.
    async function selectAllProducts() {
        try {
            const products = await Products.getProducts();
            socket.emit('productCatalog', {
                products: products,
                errorMessage: "No hay productos"
            });
        } catch (error) {
            logger.error('Error getting products: ', e);
        }
    }

    //Llamo a las funciones para que se muestren los mensajes y productos al levantar el servidor.
    selectAllMessages();
    selectAllProducts();

    //Inserto un nuevo mensaje en la base de datos de mensajes.
    socket.on('newMsg', newMsg => {
        Message.create(newMsg)
            .then(() => {
                logger.info('Mensaje insertado');
                selectAllMessages();
                return false;
            })
            .catch(e => {
                logger.error('Error en Insert message: ', e);
            });
    });
});

module.exports = server;