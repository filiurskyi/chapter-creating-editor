const express = require('express');
const cors = require('cors');
const events = require('events');
const path = require('path');
const fs = require('fs');
const mime = require('./utilities/mime');

const PORT = 3500;
const { staticFile, readDirPromise, readFilePromise } = require('./utilities/filesHandle');
const Infobase = require('./utilities/project-infobase');

const { MongoClient, ObjectId } = require('mongodb');
const url = "mongodb+srv://metaeditor:OhZtCLktDG63VPeY@metaeditor.98ooqui.mongodb.net/?retryWrites=true&w=majority";

const mongoClient = new MongoClient(url);
let infobases = new Map();

const emitter = new events.EventEmitter();

const urlencodedParser = express.urlencoded({ extended: false });

const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, '192.168.0.102', () => console.log('Server is active'));

app.get('/', (_, res) => {
    staticFile(res, '/html/main.html', '.html');
});

app.get('/editor', (_, res) => {
    staticFile(res, '/html/editor.html', '.html');
});

app.get('/login', (_, res) => {
    staticFile(res, '/html/login.html', '.html');
});

app.get('/failed-login', (_, res) => {
    staticFile(res, '/html/failed-login.html', '.html');
});

app.post('/login-data', urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const { username, password } = req.body;

    try {
        await mongoClient.connect();
        const db = mongoClient.db("metaeditor");
        const collection = db.collection("Users");
        const users = await collection.find().toArray();

        let loginSuccess = false;
        let id;
        for (let i = 0; i < users.length; i++) {
            console.log(users[i]);
            if (users[i].login === username && users[i].password === password) {
                loginSuccess = true;
                id = users[i]._id;
                break;
            }
        }

        await collection.updateOne({ _id: id }, { $set: { entered: true } });

        res.end(JSON.stringify({
            success: loginSuccess,
            href: loginSuccess ? '/' : '/failed-login',
            uid: id.toString()
        }));
    } catch (err) {
        console.log(err);
    } finally {
        await mongoClient.close();
    }
});

app.get('/load-data', async (_, res) => {
    const pathToSaves = './saves';
    const info = [];
    readDirPromise(pathToSaves)
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                info.push(path.parse(data[i]).name);
            }
            res.end(JSON.stringify(info));
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/load-project/:saveName', urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const saveName = req.params["saveName"]

    let infobase = infobases.has(saveName) ? infobases.get(saveName) : new Infobase()
    infobase.addUser(req.body.id);
    infobases.set(saveName, infobase);

    readFilePromise('./saves/' + saveName + '.json')
        .then(data => {
            res.end(JSON.stringify(data));
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/create-project', urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const text = '{"blocks":[],"arrows":[],"checkList":[{"state":"ERROR","message":""}],"bookmarks":[]}';
    fs.writeFileSync('./saves/' + req.body.name + '.json', text, { encoding: 'utf8', flag: 'w' })
    res.end();
});

app.post('/editor-exit/:saveName', urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const saveName = req.params["saveName"];

    let infobase = infobases.get(saveName);
    infobase.removeUser(req.body);
    infobases.set(saveName, infobase);
    if (infobase.isEmpty()) {
        infobases.delete(saveName);
    }

    try {
        await mongoClient.connect();
        const db = mongoClient.db("metaeditor");
        const collection = db.collection("Users");

        await collection.updateOne({ _id: new ObjectId(req.body) }, { $set: { entered: false } });
    } catch (err) {
        console.log(err);
    } finally {
        await mongoClient.close();

        res.end();
    }
});

app.post('/logout', urlencodedParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    try {
        await mongoClient.connect();
        const db = mongoClient.db("metaeditor");
        const collection = db.collection("Users");

        await collection.updateOne({ _id: new ObjectId(req.body.id) }, { $set: { entered: false } });
    } catch (err) {
        console.log(err);
    } finally {
        await mongoClient.close();
        res.end();
    }
});

app.post('/save-project/:saveName', urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    fs.writeFileSync('./saves/' + req.params["saveName"] + '.json', JSON.stringify(req.body), { encoding: 'utf8', flag: 'w' })
    res.end();
});

app.post('/cursor-positions-update/:saveName', urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const { uid, x, y } = req.body;

    let infobase = infobases.get(req.params["saveName"]);

    if (infobase === undefined) {
        res.end(JSON.stringify({
            id: uid,
            position: {
                x: 0,
                y: 0,
            }
        }));
    } else {
        infobase.setUserPosition(uid, x, y);
        infobases.set(uid, infobase);

        res.end(JSON.stringify(infobase.getUserPositions()));
    }

});

app.post('/add-editor-action/:saveName', urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const { id, actionName, action } = req.body;

    emitter.emit('newAction' + req.params["saveName"], JSON.stringify({
        id: id,
        actionName: actionName,
        action: action
    }));

    res.status(200);
    res.end();
});

app.get('/get-editor-action/:saveName', (req, res) => {
    emitter.once('newAction' + req.params["saveName"], (action) => {
        res.end(action);
    });
});

app.get('/favicon.ico', (_, res) => {
    staticFile(res, '/images/favicon.ico', '.ico');
})

app.all('*', (req, res) => {
    const extname = String(path.extname(req.url)).toLowerCase();
    if (extname in mime) {
        staticFile(res, req.url, extname);
    } else {
        staticFile(res, '/html/not-found.html', '.html');
    }
});
