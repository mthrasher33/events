var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/facebook', function(req,res,next){
	var pages = [230622880690991, 350502711478, 361509650872623];
	var events = [];
	var accessToken = 'EAABoVMNCYKQBAB0ZCkWWbbLhxPBZBH6ZCHJiy54eeymhEmyQGiL11ZCycRz8dtEFy4AaQ1aRCxhFE3jkXtnqMckGIFZCa8wyAatmeU9ZCnsKggAIfpWC3xMY9H73ntTU1XPDdPYMSDrcrillyMyx13mJoYLWEa5ZAbkRVUhwpAbZAIjHRjLg3WV6';
	var url = 'https://graph.facebook.com/v2.9/230622880690991/events?&access_token=' + accessToken;
	//city of minneapolis government: 99758046345
	//women's march: 230622880690991
	//isaiah: 350502711478
	//our revolution: 361509650872623

	getPageEventData(url, function(){
  		processEventAttendees(events, 0, function(){processEventInterested(events,0,function(){console.log('done'); res.send(events);})})//function(){console.log('done'); res.send(events)})
   	});

	function processEventAttendees(array, index, callback){
		console.log('processEventsArray called')
		getEventAttendees('https://graph.facebook.com/v2.9/'+array[index].id+'/attending?&access_token=' + accessToken, array[index], function(){
	        if(++index === array.length) {
	            callback();
	            return;
	        }
	        processEventAttendees(array, index, callback);
	    });
	}

	function processEventInterested(array, index, callback){
		console.log('processEventInterested called')
		getEventInterested('https://graph.facebook.com/v2.9/'+array[index].id+'/interested?&access_token=' + accessToken, array[index], function(){
	        if(++index === array.length) {
	            callback();
	            return;
	        }
	        processEventInterested(array, index, callback);
	    });
	}

	function getPageEventData(url, callback) {
		request(url, function (error, response, body) {
			if(!error && response.statusCode ==200){
				 	
				var resJSON = JSON.parse(body)
	 			var next = resJSON.paging.next

	 			for(var key in resJSON.data){
	 				events.push(resJSON.data[key])
	 				events[key].attendees = [];
	 				events[key].interested = [];
	 			}

				if (next) { // if set, this is the next URL to query
	             	getPageEventData(next, callback);
	           		
	           	} else {
	              	callback(); //Call when we are finished
	            }
			} else {
				console.log('Error retrieving page event data: ' + error);
			}

		});
	}

	function getEventAttendees(url, event, callback){
		request(url, function (error, response, body) {
			if(!error && response.statusCode ==200){
		 	
				var resJSON = JSON.parse(body)
	 			var next = resJSON.paging ? resJSON.paging.next : ''

	 			for(var key in resJSON.data){
	 				if(event.attendees){event.attendees.push(resJSON.data[key])}
	 			}

				if (next) { // if set, this is the next URL to query
	             	getEventAttendees(next, event, callback);
	           		
	           	} else {
	              	callback(); //Call when we are finished
	            }
			} else {
				console.log('Error retrieving page event data: ' + error);

			}

		});
	}

	function getEventInterested(url, event, callback){
		request(url, function (error, response, body) {
			if(!error && response.statusCode ==200){
				 	
				var resJSON = JSON.parse(body)
	 			var next = resJSON.paging.next

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