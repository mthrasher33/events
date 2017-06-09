var express = require('express');
var request = require('request');
var router = express.Router();
var jsonfile = require('jsonfile')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/facebook', function(req,res,next){
	var pages = [230622880690991, 350502711478, 361509650872623];
	var events = [];
	var accessToken = 'EAABoVMNCYKQBAJpu0SwEd5bZCSvpvuRzKHobDhBNjp3eybXKetFIYqMZA3iboISPWqOHQRBE9tSsDJvVpa64vj49E1hv3liMaZB1DaXTeQf6CG90hRbIq233a0XnTgEYbReW27vDa6SUirg1q3f00v6flSTrZBen92v8vTE0V2J3fBnS99wZAtWZCeciKqfgwZD';
	var url = 'https://graph.facebook.com/v2.9/230622880690991/events?&access_token=' + accessToken;
	var file = '/Users/matthewth/Desktop/data' + events.length + '.json'

	//var url = req.params.id ? 'https://graph.facebook.com/v2.9/'+ req.params.id+'/events?&access_token=' + accessToken : 'https://graph.facebook.com/v2.9/99758046345/events?&access_token=' + accessToken
	//city of minneapolis government: 99758046345
	//women's march: 230622880690991
	//isaiah: 350502711478
	//our revolution: 361509650872623
	//logan park neighborhood association: 163447610383117
	//audubon park neighborhood association: 296448873767813
	//nemaa: 203197488168
	//our streets: 195451112356


	getPageEventData(url, function(){
  		processEventAttendees(events, 0, function(){processEventInterested(events,0,function(){console.log('done'); var obj = events; jsonfile.writeFile(file, obj, function(err){console.log(err)})})})//function(){console.log('done'); res.send(events)})
   	});

	//on big events, something happens where this gets called twice and starts running in parallel but for whatever reason, they both terminate at the same time and move on to process events interested and then run at the same time. 
	function processEventAttendees(array, index, callback){
		console.log('Getting attendees for ' + array[index].name)
		getEventAttendees('https://graph.facebook.com/v2.9/'+array[index].id+'/attending?&access_token=' + accessToken, array[index], function(){
	        //so on the bigger pages, we don't get to the callback, and we double call a bunch of stuff
	        //actually, it looks like I just run into all sorts of problems with the really big events. like this function is firing off again before i get all the attendees
	        console.log('index:' + index + ' array.length: ' + array.length)

	        if(++index === array.length) {
	            callback();
	            return; //maybe I don't need the return?
	        }

	        //it looks like this is firing before we have the results from getEventAttendees (sometimes on larger events?)
	        processEventAttendees(array, index, callback);
	    });
	}

	//oh boy, and then sometimse on big events, this fires off the processEventAttendees callback? 
	//I sometimes have three of these running simultaneously. Woof.
	function processEventInterested(array, index, callback){
		console.log('Getting interested for ' + array[index].name)
		getEventInterested('https://graph.facebook.com/v2.9/'+array[index].id+'/interested?&access_token=' + accessToken, array[index], function(){
	        if(++index === array.length) {
	            callback();
	            return; //maybe I don't need the return?
	        }
	        processEventInterested(array, index, callback);
	    });
	}

	function getPageEventData(url, callback) {
		request(url, function (error, response, body) {
			if(!error){
				 	
				var resJSON = JSON.parse(body)
	 			var next = resJSON.paging ? resJSON.paging.next : false

	 			for(var key in resJSON.data){
	 				events.push(resJSON.data[key])
	 				events[key].attendees = [];
	 				events[key].interested = [];
	 			}

				if (next) { // if set, this is the next URL to query
	             	getPageEventData(next, callback);
	           		
	           	} else {
	           		console.log('firigng the callback in getpageeventdata');
	              	callback(); //Call when we are finished
	            }
			} else {
				console.log('Error retrieving page event data: ' + error);
			}

		});
	}

	function getEventAttendees(url, event, callback){
		request(url, function (error, response, body) {
			if(!error){
		 	
				var resJSON = JSON.parse(body)
	 			var next = resJSON.paging ? resJSON.paging.next : false

	 			for(var key in resJSON.data){
	 				if(event.attendees){event.attendees.push(resJSON.data[key])}
	 			}

				if (next) { // if set, this is the next URL to query
	             	getEventAttendees(next, event, callback);
	           		
	           	} else {
	           		console.log('firigng the callback in get event attendees'); //we are firing the callback incorrectly in scenarios where we have large events. or it may be called when we do no in fact have a next?

	              	callback(); //Call when we are finished 
	            }
			} else {
				console.log('Error retrieving page event data: ' + error);

			}

		});
	}

	function getEventInterested(url, event, callback){
		request(url, function (error, response, body) {
			if(!error ){
				 	
				var resJSON = JSON.parse(body)
	 			var next = resJSON.paging ? resJSON.paging.next : false

	 			for(var key in resJSON.data){
	 				if(event.interested){event.interested.push(resJSON.data[key])}
	 			}

				if (next) { // if set, this is the next URL to query
	             	getEventInterested(next, event, callback);
	           		
	           	} else {
	              	callback(); //Call when we are finished
	            }
			} else {
				console.log('Error retrieving page event data: ' + error);
			}

		});
	}
})

module.exports = router;