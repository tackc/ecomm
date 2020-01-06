const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// By adding this here, you can avoid having to put the entire code snippet into each route handler. i.e. app.post('/', bodyParser.urlencoded({ extended: true }) ,(req, res) => {...
app.use(bodyParser.urlencoded({ extended: true }));

//Route handler (what to do when a request comes in from the browser)
app.get('/', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email"></input>
            <input name="password" placeholder="password"></input>
            <input name="password confirmation" placeholder="password confirmation"></input>
            <button>Sign Up</button>
        </form>
    </div>`
    );
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Account Created! *not really though ;)')
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
});