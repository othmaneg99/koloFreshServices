const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
app.patch('/', async (req, res) => {
    console.log("we are here")
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.query.dbName}`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const session = client.startSession();
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };
        const transactionResults = await session.withTransaction(async () => { }, transactionOptions);
        const shopColl = session.getDatabase("kolofresh").collection("shops");
        const produitColl = session.getDatabase("kolofresh").collection("products");
        session.startTransaction();
        shopColl.updateOne({ _id: req.body.filter._id }, { $set: { isRemoved: true } });
        produitColl.updateMany({ idShop: req.body.filter._id }, { $set: { isRemoved: true } });
        await session.commitTransaction();
        session.endSession();
        res.send(transactionResults);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
});
module.exports = app;