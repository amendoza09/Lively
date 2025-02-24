const express = require("express");
const { MongoClient } = require("mongodb");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config({ path: "./config.env" });

const app = express()
const PORT = process.env.PORT;
const HOST = process.env.HOST;


const Db = process.env.MONGO_URI;
const client = new MongoClient(Db)

// models
const PendingAccount = require('./schemas/pendingAccount');
const ApprovedAccount = require('./schemas/approvedAccount');
const Event = require('./schemas/eventSchema');

app.use(express.json())
app.use(cors());

function getCollectionName(city) {
    return `${city.toLowerCase()}`;
}

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
        return res.status(400).json({ message: "City paramter is required"});
    }
    const collectionName = getCollectionName(City);

    try {
        await client.connect();

        console.log("Connection Successful");

        const collection = client.db("City").collection(collectionName);
        const events = await collection.find({}).toArray();
        
        res.json(events)
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: "Failed to fetch events" })
    } finally {
        await client.close()
    }
})

// create an event
app.post('/event-data/:City', async (req, res) => {

    const { city } = req.params;
    const { title, location, address, date, time, type, imgUrl, featured } = req.body;

    try {
        await client.connect();

        const newEvent = new Event({
            title, location, address, city, date, time, type, imgUrl, featured 
        });
        
        await newEvent.save();

        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error', e });
    } finally {
        await client.close()
    }
})


// register new account
app.post('/event-data/pending-accounts', async (req, res) => {
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
app.get('/event-data/pending-accounts', async (req, res) => {
    try {
        const pendingAccounts = await PendingAccount.find();
        res.status(200).json(pendingAccounts);
    } catch (error) {
        consol.error('error fetching pending accounts: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/event-data/approved_accounts', async(req, res) => {
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