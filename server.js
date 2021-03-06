const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const corse = require('cors');

const app = express();

app.use(bodyParser.json())
app.use(corse())

const database = {
    users:[
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '123',
            hash:'',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    bcrypt.compare("apple", '$2a$10$4QSUQwM2ZZSSLMYdROZfEuFXsODDfg10s8Ae3In5tZXazLNIHIo3u',
        function(err, res) {
        // res == true
            console.log(res)
    });
    bcrypt.compare("veg", '$2a$10$4QSUQwM2ZZSSLMYdROZfEuFXsODDfg10s8Ae3In5tZXazLNIHIo3u'
        , function(err, res) {
        // res = false
            console.log(res)
    });
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json('success')
    }else{
        res.status(400).json('error logging in')
    }
})

app.post('/register', (req, res) =>{
    const {email, name, password} = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash)
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach( user => {
        if(user.id === id){
            found=true;
            return res.json(user)
        }
    })
    if(!found){
        res.status(404).json('no such user')
    }
})


app.put('/image',(req, res) => {
    const {id} = req.body;
    let found = false;
    database.users.forEach( user => {
        if(user.id === id){
            found=true;
            user.entries++;
            return res.json(user.entries)
        }
    })
    if(!found){
        res.status(404).json('no such user')
    }
})

/*

// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});
*/

app.listen(3000, () => {
    console.log('app is running on port 3000')
});

/*
* /--> res = this is working
* /signin --> POST = success/fail
* /register --> POST = use
* /profile/:userId --> GET = user
* /image --> PUT --> user
 */