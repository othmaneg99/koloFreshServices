const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { MongoClient } = require('mongodb');
require('dotenv').config();

function convertIds(ids) {
    let i = 0;
    for (i = 0; i < ids.length; i++) {
        let ObjectId = require('mongodb').ObjectId;
        let good_id = new ObjectId(ids[i]);
        ids[i] = good_id;
    }
    return ids;
}

/*Get many documents by their id (array of ids) */
app.get('/id', async (req, res) => {

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.query.dbName}`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const filters = JSON.parse(req.query.filters)
        filters._id = convertIds(filters._id);
        const result = await client.db(req.query.dbName).collection(req.query.collectionName)
            .find({ _id: { $in: filters._id } });
        if (result) {
            const results = await result.toArray();
            res.send(results);
        }
        else res.status(400).send("Not found");
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }

})


//Get documents:
app.get('/', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.query.dbName}`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const filters = JSON.parse(req.query.filters)
        if (filters._id) {
            const ObjectId = require('mongodb').ObjectId;
            let good_id = new ObjectId(filters._id);
            filters._id = good_id;
        }
        const result = await client.db(req.query.dbName).collection(req.query.collectionName).find(filters);
        if (result) {
            const results = await result.toArray();
            res.send(results);
        }
        else res.status(400).send("Not found");
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
})

//Get documents:
app.get('/last', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.query.dbName}`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const filters = JSON.parse(req.query.filters)
        if (filters._id) {
            const ObjectId = require('mongodb').ObjectId;
            let good_id = new ObjectId(filters._id);
            filters._id = good_id;
        }
        const result = await client.db(req.query.dbName).collection(req.query.collectionName).find(filters).sort({ _id: -1 }).limit(1);;
        if (result) {
            const results = await result.toArray();
            res.send(results);
        }
        else res.status(400).send("Not found");
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
})

//Create one documents
app.post('/one', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.body.dbName}`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const result = await client.db(req.body.dbName).collection(req.body.collectionName).insertOne(req.body.data);
        if (result)
            res.send(result);
        else res.status(400).send("Not created");
    } catch (e) {
        res.status(500).send(e);
    } finally {
        await client.close();
    }
})

//Create many:
app.post('/many', async (req, res) => {
    //Data should be an array of object!!!!!!
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.body.dbName}`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const result = await client.db(req.body.dbName).collection(req.body.collectionName).insertMany(req.body.data);
        if (result)
            res.status(200).send(result.insertedIds);
        /**
         * Exemple: {
                       '0': new ObjectId("61c8bd1f45691417b50b6a0e"),
                       '1': new ObjectId("61c8bd1f45691417b50b6a0f")
                    }
         */
        else res.status(400).send("Not created");
    } catch (e) {
        res.status(500).send(e);
    } finally {
        await client.close();
    }
})

//update One:

app.patch('/one', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.body.dbName}`;
    const client = new MongoClient(uri);
    const filters = req.body.filters;
    if (filters._id) {
        const ObjectId = require('mongodb').ObjectId;
        let good_id = new ObjectId(filters._id);
        filters._id = good_id;
    }
    try {
        await client.connect();
        console.log(req.body.filters)
        const result = await client.db(req.body.dbName).collection(req.body.collectionName)
            .updateOne(filters, { $set: req.body.data });

        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
        res.status(200).send(`${result.modifiedCount} document(s) was/were updated.`);
    } catch (e) {
        res.status(500).send(e);
    } finally {
        await client.close();
    }
})

//upsert One:

app.patch('/sertOne', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.body.dbName}`;
    const client = new MongoClient(uri);
    try {
        const filters = req.body.filters;
        if (filters._id) {
            const ObjectId = require('mongodb').ObjectId;
            let good_id = new ObjectId(filters._id);
            filters._id = good_id;
        }
        await client.connect();
        const result = await client.db(req.body.dbName).collection(req.body.collectionName)
            .updateOne(filters,
                { $set: req.body.data },
                { upsert: true });
        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        if (result.upsertedCount > 0) {
            console.log(`One document was inserted with the id ${result.upsertedId}`);
            res.status(200).send(result.upsertedId);
        } else {
            console.log(`${result.modifiedCount} document(s) was/were updated.`);
            res.status(200).send(`${result.modifiedCount} document(s) was/were updated.`);
        }
    } catch (e) {
        res.status(500).send(e);
    } finally {
        await client.close();
    }
})

//update many:

app.patch('/many', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.body.dbName}`;
    const client = new MongoClient(uri);
    try {
        const filters = req.body.filters;
        if (filters._id) {
            const ObjectId = require('mongodb').ObjectId;
            let good_id = new ObjectId(filters._id);
            filters._id = good_id;
        }
        await client.connect();
        const result = await client.db(req.body.dbName).collection(req.body.collectionName)
            .updateMany(filters,
                { $set: req.body.data });
        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
        res.status(200).send(`${result.modifiedCount} document(s) was/were updated.`);

    } catch (e) {
        res.status(500).send(e);
    } finally {
        await client.close();
    }
})



//transaction:
app.patch('/transaction', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.body.dbName}`;
    const client = new MongoClient(uri);
    let filters = req.body.filters;
    let idShop = req.body.filters._id;
    await client.connect();

    const session = client.startSession();

    try {

        const shopColl = client.db("kolofresh").collection(req.body.mainCollectionName);
        const productColl = client.db("kolofresh").collection(req.body.foreignCollectionName);
        const ObjectId = require('mongodb').ObjectId;
        if (filters._id) {
            const ObjectId = require('mongodb').ObjectId;
            let good_id = new ObjectId(filters._id);
            filters._id = good_id;
        }
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };
        const transactionResults = await session.withTransaction(async () => {
            const shop = await client.db("kolofresh").collection("shops").findOne(filters);
            console.log(`the shop is ${JSON.stringify(shop)}`)
            console.log(req.body.filters._id)
            const shopUpdateResults = await shopColl.updateOne(filters, { $set: { isRemoved: true } }, { session });
            console.log(`${shopUpdateResults.matchedCount} document(s) found  matched the id. ${req.body.filters._id}`);
            console.log(`${shopUpdateResults.modifiedCount} document(s) was/were deleted.`);
            const productUpdateResults = await productColl.updateMany({ idShop: idShop }, { $set: { isRemoved: true } }, { session });
            console.log(`${productUpdateResults.matchedCount} document(s) found  matched the id. ${req.body.filters._id}`);
            console.log(`${productUpdateResults.modifiedCount} document(s) was/were deleted.`);

        }, transactionOptions);

        if (transactionResults) {
            console.log("the transaction was successful")
        } else {
            console.log("the transaction failed")
        }


    } catch (err) {
        console.error(err);
    } finally {

        await session.endSession();
        await client.close();
        res.send("success");
    }
});




//delete document:

app.delete('/', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.body.dbName}`;
    const client = new MongoClient(uri);
    try {
        const filters = req.body.filters;
        if (filters._id) {
            const ObjectId = require('mongodb').ObjectId;
            let good_id = new ObjectId(filters._id);
            filters._id = good_id;
        }
        await client.connect();
        const result = await client.db(req.body.dbName).collection(req.body.collectionName)
            .deleteMany(filters);
        res.status(200).send(`${result.deletedCount} document(s) was/were deleted.`);
    } catch (e) {
        res.status(500).send(e);
    } finally {
        await client.close();
    }
})

//Soft Delete:
app.delete('/one', async (req, res) => {
    console.log({ token: req.body.token, isRemoved: req.body.isRemoved, dbName: req.body.dbName, collection: req.body.collectionName })
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.body.dbName}`;
    const client = new MongoClient(uri);
    try {
        const filters = req.body.filters;
        if (filters._id) {
            const ObjectId = require('mongodb').ObjectId;
            let good_id = new ObjectId(filters._id);
            filters._id = good_id;
        }
        await client.connect();
        const result = await client.db(req.body.dbName).collection(req.body.collectionName)
            .updateOne(filters, { $set: { isRemoved: true } });
        console.log(result)
        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} document(s) was/were deleted.`);
        res.status(200).send(`${result.modifiedCount} document(s) was/were deleted.`);
    } catch (e) {
        res.status(500).send(e);
    } finally {
        await client.close();
    }
})


//Soft Delete Many: done
app.delete('/many', async (req, res) => {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@kolofreshdev.hecij.mongodb.net/${req.body.dbName}`;
    const client = new MongoClient(uri);
    try {
        const filters = req.body.filters;
        if (filters._id) {
            const ObjectId = require('mongodb').ObjectId;
            let good_id = new ObjectId(filters._id);
            filters._id = good_id;
        }
        await client.connect();
        const result = await client.db(req.body.dbName).collection(req.body.collectionName)
            .updateMany(filters,
                { $set: { isRemoved: true } });

        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} document(s) was/were deleted.`);
        res.status(200).send(`${result.modifiedCount} document(s) was/were deleted.`);

    } catch (e) {
        res.status(500).send(e);
    } finally {
        await client.close();
    }


})



module.exports = app;
