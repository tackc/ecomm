const express = require('express');

const app = express();

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

// "next" is a callback function that is handed back to us from Express (Express was created before promises / async / await)
const bodyParser = (req, res, next) => {
    if (req.method === 'POST') {
        req.on('data', data => {
            const parsed = data.toString('utf8').split('&');
            const formData = {};
            for (let pair of parsed) {
                const [key, value] = pair.split('=');
                formData[key] = value
            }
            req.body = formData;
            next();
        });
    } else {
        next();
    }
}

app.post('/', bodyParser, (req, res) => {
    console.log(req.body);
    res.send('Account Created! *not really though ;)')
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
});