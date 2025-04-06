const express = require("express");
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

require("dotenv").config({ path: "./config.env" });

const app = express()
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const Db = process.env.MONGO_URI;
const client = new MongoClient(Db);

mongoose.connect(Db)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// models
const PendingAccount = require('./schemas/pendingAccount');
const ApprovedAccount = require('./schemas/approvedAccount');
const Event = require('./schemas/eventSchema');
const createUser = require('./schemas/usersSchema');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

function getCollectionName(city) {
    return `${city.toLowerCase()}`;
}

app.post('/login', async(req, res) => {
    const { username, password } = req.body;

    try{
        await client.connect();

        const db = client.db("admin-login");
        const User = db.collection('credentials');
        const user = await User.findOne({ username });

        if(!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        } else if(user) {
            console.log("user found")
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ username: user.username,  userId: user._id  }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ message: 'Login successful', token });
    } catch(e) {
        console.error(e);
    }
    
});

// get all cities in database
app.get('/event-data/City', async (req, res) => {
    try {
        await client.connect();

        const db = client.db("City");
        const collections = await db.collections();

        const cityNames = collections.map((collection) => collection.collectionName);

        res.json(cityNames);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching cities' });
    }
})

// get specific city
app.get("/event-data/:City", async (req, res) => {
    const { City } = req.params

    if(!City) {
        return res.status(400).json({ message: "City parameter is required"});
    }

    try {
        await client.connect();

        console.log("Connection Successful");
        const collectionName = getCollectionName(City);
        const collection = client.db("City").collection(collectionName);
        const events = await collection.find({}).toArray();
        
        res.json(events)
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: "Failed to fetch events" })
    } 
})

// create an event 
app.post('/pending-events/:City', async (req, res) => {
    const { City } = req.params;
    const { title, location, address, date, time, type, description, imgUrl, featured, status } = req.body;
    const collectionName = getCollectionName(City);

    try {
        await client.connect();
        console.log("Connection Successful");
        
        const db = mongoose.connection.useDb("pending-events");
        const newEvent = new Event({
            title, location, address, date, time, type, description, imgUrl, featured, status
        });
        
        await db.collection(collectionName).insertOne(newEvent);

        res.status(201).json({ message: 'Event created successfully', event: newEvent });

        console.log("Event created successfully");
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error', e });
    }  finally {
        await client.close();
    }
})


app.get("/pending-events", async (req, res) => {
    try {
        await client.connect();
        console.log("fetching all pending events...");

        const db = client.db("pending-events");
        const cityNames = ["athens", "atlanta"];
        let allPendingEvents = {};

        for(const city of cityNames) {
            const cityCollection = db.collection(city);
            const events = await cityCollection.find({}).toArray();

            allPendingEvents[city] = events;
        }
        res.json(allPendingEvents);
        
    } catch(e) {
        console.error("error fetching pending events: ", e);
    } 
});


app.get("/approved-events", async (req, res) => {
    try {
        await client.connect();
        console.log("fetching all approved events...");

        const db = client.db("approved-events");
        const cityNames = ["athens", "atlanta"];
        let allPendingEvents = {};

        for(const city of cityNames) {
            const cityCollection = db.collection(city);
            const events = await cityCollection.find({}).toArray();

            allPendingEvents[city] = events;
        }
        res.json(allPendingEvents);
        
    } catch(e) {
        console.error("error fetching pending events: ", e);
    } 
});

// register new account
app.post('/pending-accounts', async (req, res) => {
    const { organizationName, accountOwner, email, password } = req.body;

    if(!organizationName || !accountOwner || !email || !password) {
        return res.status(400).json({ message: "all fields are required." });
    }
    try {
        const existingAccount = await PendingAccount.findOne({ email });
        if(existingAccount) {
            return res.status(400).json({ error: 'Email is alraedy pending approval.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const pendingAccount = new PendingAccount({
            organizationName,
            accountOwner,
            email,
            password: hashedPassword,
        });

        await pendingAccount.save();
        res.status(201).json({ message: 'Account submitted for approval.' });
    } catch (error) {
        consol.error('Error saving account request:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
})

// get all pending account
app.get('/pending-accounts', async (req, res) => {

    try {
        console.log("fecthing pending accounts");
        
        const collectionName = getCollectionName("pending_accounts");
        const collection = client.db("Creator_Account").collection(collectionName);
        const pendingAccounts = await collection.find({}).toArray();
        
        res.json(pendingAccounts);
    } catch (error) {
        console.error('error fetching pending accounts: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.get('/approved-accounts', async(req, res) => {
    try {
        console.log("fecthing approved accounts");
        const collectionName = getCollectionName("approved_accounts");
        const collection = client.db("Creator_Account").collection(collectionName);
        const approvedAccounts = await collection.find({}).toArray();
        
        res.json(approvedAccounts);
    } catch (error) {
        console.error('error fetching approved accounts: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/approved-accounts', async(req, res) => {
    const { accountId } = req.body;

    try {
        const account = await PendingAccount.findById(accountId);
        if(!account) {
            return res.status(404).json({ error: 'Account not found.' });
        }

        const approvedAccount = new ApprovedAccount({
            organizationName: account.organizationName,
            accountOwner: account.accountOwner,
            email: account.email,
            password: account.password,
        });

        await approvedAccount.save();
        await PendingAccount.findByIdAndDelete(accountId);

        res.status(200).json({ message: 'Account approved successfully.' });
    } catch (error) {
        consol.error('Error approving account:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// reject account
app.post('/reject', async (req, res) => {
    const { accountId } = req.body;

    try {
        const account = await PendingAccount.findById(accountId);
        if(!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        await PendingAccount.findByIdAndDelete(accountId);
        res.status(200).json({ message: 'Account was rejected.' });
    } catch(error) {
        console.error('Error rejecting account:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running from: ${HOST} on port: ${PORT}`)
});