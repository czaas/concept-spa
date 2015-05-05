var express = require('express');
var router = express.Router();

// this url will be /users/userlist as declared in the ../app.js file and a single forward slash is the root of this folder!
router.get('/userlist', function(req, res){
	var db = req.db;
	db.collection('userlist').find().toArray(function(err, items){
		res.json(items);
	});
});

router.post('/adduser', function(req, res){
	var db = req.db;
	db.collection('userlist').insert(req.body, function(err, result){
		res.send((err === null) ? { msg: '' } : { msg: err }	);
	});
});

router.put('/edituser/:id', function(req, res){
	var db = req.db;
	var userToEdit = req.params.id;
	
	db.collection('userlist').update(userToEdit, req.body, function(err, result){
		res.send((err === null) ? { msg: '' } : { msg: err });
	});
});

// example of user update
//db.userlist.update({"fullname": "No men"}, {$set: { "username": "AnotherTest!2" }})

// When we want to delete someone we send them to this url with a param which is their ID
router.delete('/deleteuser/:id', function(req, res){
	var db = req.db;
	var userToDelete = req.params.id;
	db.collection('userlist').removeById(userToDelete, function(err, result){
		res.send((result === 1) ? { msg: '' } : { msg: 'Error: ' + err });
	});
});

module.exports = router;