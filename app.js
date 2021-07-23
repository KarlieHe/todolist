const express = require('express');
const mongoose = require('mongoose');
const capitalize = require('lodash.capitalize');
const date = require(__dirname + '/getDate.js');

const app = express();
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.use(express.static('public'));
mongoose.connect('mongodb+srv://admin-Karlie:admin-Karlie@cluster0.xgrv4.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
    name: "Welcome!!"
});

const item2 = new Item({
    name: "Hit + button to add an item."
});


const defaultItems = [item1, item2];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model('List', listSchema);

var workItems =[];

app.get('/', function (req, res) {
    //var day = date.getDate();

    List.findOne({ name: 'Today'}, function(err, foundLists){
        const list = new List({
                    name: 'Today',
                    items: defaultItems
                });
                
        if(!err){
            if(!foundLists){
                //create a new list               
                list.save(function(err){
                    if(!err) {
                        res.redirect('/');
                    }
                });   
            } else {
                //show exist list
                res.render('list', {
                    listTitle: foundLists.name, 
                    newListItems: foundLists.items
                })
            }
        }   
    })
})



app.get('/:customerListName', function(req, res) {
    const customerListName = capitalize(req.params.customerListName);
    const list = new List({
                    name: customerListName,
                    items: defaultItems
                });

    if (customerListName === 'Today'){
        res.redirect('/');
    } else {
        List.findOne({ name: customerListName }, function(err, foundLists){
            if(!err){
                if(!foundLists){
                    //create a new list               
                    
                    list.save(function(err){
                        if(!err) {
                            res.redirect('/' + customerListName);
                        }
                    });
                    
                    
                } else {
                    //show exist list
                    res.render('list', {
                        listTitle: foundLists.name, 
                        newListItems: foundLists.items
                    })
                }
            }   
        });
    }
})

app.post('/', function(req, res){
    let newItem = req.body.newItem;
    let listName = req.body.list;

    List.findOne({ name: listName }, function(err, foundList){
        const item = new Item({
            name: newItem
        });

        foundList.items.push(item)
        foundList.save(function(err){
            if(!err){
                if(listName === "Today"){
                    res.redirect('/'); 
                } else {
                    res.redirect('/' + listName );
                }  
            }
        });   
    })
});

app.post('/delete', function(req, res) {

    const itemId = req.body.listItem;
    const listName = req.body.listName;

    List.findOneAndUpdate({ name: listName }, { $pull: { items: {_id: itemId} }}, function(err){
        if (!err) {
            if(listName == 'Today'){
                res.redirect('/');
            } else {
                res.redirect('/' + listName);
            }
            
        } 
    })
    
})

app.get('/work', function (req, res){
    res.render('list', {listTitle: "Work list", newListItems: workItems})
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Server started on post 3000.')
})