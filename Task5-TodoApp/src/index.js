const express = require('express')
const hbs = require('hbs')
const path = require('path')
const fs = require('fs')
const {ObjectID} = require('mongodb')
const app = express()
const publicDir = path.join(__dirname, '../public')
const viewsDir = path.join(__dirname, '../design/views')
const layouts = path.join(__dirname, '../design/layouts')
const dbconnection = require('./utills/functions')
app.set('view engine', 'hbs')
app.set('views',viewsDir)
hbs.registerPartials(layouts)
app.use(express.static(publicDir))
app.use(express.urlencoded())

app.get('', (req,res)=>{
    res.render('index')
})

app.get('/add', (req,res)=>{
    res.render('form', { action:'add', data:{title:'', description:''}, id:'' })
})

app.post('/add', (req, res)=>{
    data = req.body
    dbconnection(db=>{
        if(!db) return console.log('fe error')
        db.collection('tasks').insertOne(data, (err,data)=>{
            if(err) console.log(err)
            else console.log(data.insertedCount)
        })
    })
    res.redirect('/showAll')
})

app.get('/edit/:id', (req, res)=>{
    dbconnection(db=>{
        db.collection('tasks').findOne({_id:new ObjectID(req.params.id)}, (err, result)=>{
            if(err) res.send('404', {error:'no data'})
            else res.render('form', {action:'edit', 
                data:{title:result.title, description:result.description}, id:req.params.id})
        })
    }) 
})

app.post('/edit/:id', (req,res)=>{
    data = req.body
    dbconnection(db=>{
        if(!db) return console.log('fe error')
        db.collection('tasks').updateOne({_id:new ObjectID(req.params.id)},
        {$set:{title:data.title, description:data.description}}, (err,data)=>{
            if(err) console.log(err)
            else console.log(data.insertedCount)
        })
    })
    res.redirect('/showAll')
})

app.get('/delete/:id', (req,res)=>{
    dbconnection(db=>{
        db.collection('tasks').deleteOne({_id:new ObjectID(req.params.id)})
        .then(res=>console.log(res.deletedCount))
        .catch(e=> console.log(e))
    })
    res.redirect('/showAll')
})

app.get('/showAll', (req,res)=>{
    dbconnection(db=>{
        if(!db) return res.send('404', {error: 'error in show data'})
        db.collection('tasks').find().toArray((err, result)=>{
            if(err) res.send('404', {error:err})
            else res.render('allData',{data:result, len:result.length})
        })
    })
})

app.get('/showsingle/:id', (req,res)=>{
    dbconnection(db=>{
        db.collection('tasks').findOne({_id:new ObjectID(req.params.id)}, (err, result)=>{
            console.log(result)
            if(err) res.send('404', {error:'no data'})
            else res.render('singledata',{data:result})
        })
    })
})

app.get('*', (req, res)=>{
    res.render('404', {error:'invalid url'})
})
app.listen(3000)