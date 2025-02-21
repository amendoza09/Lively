const express = require("express")
const { MongoClient } = require("mongodb")
require("dotenv").config({ path: "./config.env" })

const app = express()
const port = 5500

const Db = process.env.MONGO_URI
const client = new MongoClient(Db)

app.use(express.json())

async function main () {

    const Db = process.env.MONGO_URI
    const client = new MongoClient(Db)

    try {
        await client.connect()
        const collections = await client.db("City").collections()
        collections.forEach((collection) => console.log(collection.s.namespace.collection))
    } catch(e) {
        console.error(e)
    } finally {
        await client.close()
    }
    
}

main()