const axios = require("axios")



collections = {
   Shop:"shops"
}

module.exports = class Request {
  constructor() {
  }
  async post() {
    let data = {
      "dbName" : "kolofresh", 
      "collectionName" : collections[this.constructor.name],
      "data" : this
    }
    let obj
    await axios.post(process.env.CRUDService+'/one', data).then(({ data }) => {
      obj = data
    }).catch(e => {
      obj = e
    })
    return obj
  }

  async get(filters) {
    let data = {
      "dbName" : "kolofresh", 
      "collectionName" : collections[this.constructor.name],
      "filters" : filters
    }
    let items;
    console.log(data)
    await axios.get(process.env.CRUDService, {
      params: data
    }).then(({ data }) => {
      items = data;
    })
    return items
  }

  async getByIds(filters) {
    let data = {
      "dbName" : "kolofresh", 
      "collectionName" : collections[this.constructor.name],
      "filters" : filters
    }
    let items;
    console.log(data)
    await axios.get(process.env.CRUDService+'/id', {
      params: data
    }).then(({ data }) => {
      items = data;
    })
    return items
  }

  async update(filters) {
    let data = {
      "dbName" : "kolofresh", 
      "collectionName" : collections[this.constructor.name],
      "filters" : filters,
      "data" : this
    }
    let items;
    await axios.patch(process.env.CRUDService+'/one', data).then(({ data }) => {
      items = data
    }).catch(e => {
      return e
    })
    return items
  }
  async delete(filters) { 
    let items
    let data = {
      "dbName" : "kolofresh", 
      "collectionName" : collections[this.constructor.name],
      "filters" : filters
    }
    console.log(data);
    await axios.delete(process.env.CRUDService+'/one', data).then(({ data }) => {
      items = data
    }).catch(e => {
      //console.log(e)
      return e
    })
    return items
  }

  async transaction(filters) {
    let items
    let data = {
      "filters":filters,
      "dbName" : "kolofresh",
      "mainCollectionName" : collections[this.constructor.name],
      "foreignCollectionName" : "products",
    }
    console.log(`this is filters received ${JSON.stringify(filters)}`)
    console.log(`this is data received ${JSON.stringify(data)}`)
    await axios.patch(process.env.CRUDService+'/transaction',data).then(({ data }) => {
      items = data
} 
).catch(e => {
      return e
    })
    return items
  }

  //posting in email service
  async postEmail(url, data) {
    let obj
    await axios.post(url, data).then(({ data }) => {
      obj = data
    }).catch(e => {
      obj = e
    })
    return obj
  }

  








}
