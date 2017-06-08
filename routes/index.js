var express = require('express');
var request = require('request');
var rp = require('request-promise');
var async = require('async')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/facebook', function(req,res,next){
	var pages = [230622880690991, 350502711478, 361509650872623];
	var events = [];
	var accessToken = 'EAABoVMNCYKQBAHvszxS2sZCsUqwTZBsmFZB2GLo4ZBOy0jazgSvlshRvDvmJGxmZBLNi2ZBfNbBx0KHcDjqZAfRDugdDbGCC5ESrp0N5n6cMBgFx72ldHoyLjulonPvWEqZCf2Jg8oXV1ok80udor0jBOc2Q8vZBprqaTzYDlBYQv0rDTy24bRRwxomYQBygHUXsZD';
	var url = 'https://graph.facebook.com/v2.9/99758046345/events?&access_token=' + accessToken;
	var urlEventAttendee = 'https://graph.facebook.com/v2.9/523295304728036/attending?&access_token=' + accessToken;
	var urlEventInterested = 'https://graph.facebook.com/v2.9/523295304728036/interested?&access_token=' + accessToken;
	//city of minneapolis government: 99758046345
	//women's march: 230622880690991
	//isaiah: 350502711478
	//our revolution: 361509650872623


	//kitty hall event: 523295304728036
	rp(url)
    	.then(function (response) {
        
    	})
    	.catch(function (err) {
        console.log(err)
    	});
	 
	//  getPageEventData(url, function(){
  //    		//res.send(events)
  //    		//res.send(events.toString().replace(/,/g, ''))
  // 			console.log('Number of events returned: ' + events.length);
  // 			async.each(events, getEventAttendees, function(err, results){
  // 				console.log('got all the events')
  // 				res.send(events)
  // 			});

  // 			//getPageEventData(events, function(){
  // 			//	console.log('all done with events')
  // 			//})
  // 			//events.forEach(function(event){
  // 			//	console.log(event.name)
  // 			//	getEventAttendees('https://graph.facebook.com/v2.9/'+event.id+'/attending?&access_token=' + accessToken, event, function(){
  // 			//		console.log('All done getting event attendees')
  // 			//	});
  // 			//})

  		// 	async.eachSeries(events, getEventAttendees('https://graph.facebook.com/v2.9/' + event + '/attending?&access_token=' + accessToken, function(){
			 // console.log('got all the attendees for: ' + event.name)
			 //   				event.attendees = attendees;

		  //  				console.log('Number of attendees for ' + event.name +': ' + attendees.length)
			 //   				attendees = [];  			
			 //   	}), function done(err){console.log('done')});


  	// 	async.eachSeries(events, getEventAttendees('https://graph.facebook.com/v2.9/' + event.id + '/attending?&access_token=' + accessToken, function(){
			// console.log('got all the attendees for: ' + event.name)
			//   				event.attendees = attendees;

			//   				console.log('Number of attendees for ' + event.name +': ' + attendees.length)
			//   				attendees = [];
  	// 	}), function (err){
  	// 		if(err){
  	// 			console.log('There was an async error')
  	// 		} else {
  	// 					res.send(events)

  	// 		}
  	// 	});

  		 // events.forEach(function(event){
  		 // 	getEventAttendees('https://graph.facebook.com/v2.9/' + event.id + '/attending?&access_token=' + accessToken, function(){
  		 // 		console.log('got all the attendees for: ' + event.name)
  		 // 		event.attendees = attendees;

  		 // 		console.log('Number of attendees for ' + event.name +': ' + attendees.length)
  		 // 		attendees = [];
  		 // 	})
  		 // })

  		 // setTimeout(function(){res.send(events)}, 5000)

		//res.send(events)

	 	 // getEventAttendees(urlEventAttendee, function(){
	 	 // 	getEventInterested(urlEventInterested, function(){
		 	//  	res.send(attendees)
		 	//  	console.log('Number of attendees for kitty hall: ' + attendees.length);
		 	//  	console.log('Number of interested for kitty hall: ' + interested.length);
		 	//  	console.log('Number of events: ' + events.length);
		 	//  	attendees = [];
	 	 // 	})
	 	 // })


//   	});



// getEventInterested(urlEventInterested, function(){
// 	res.send(events)
// 	console.log('Number of interested people for kitty hall: ' + events.length)
// })

function getPageEventData(url, callback) {
	request(url, function (error, response, body) {
		if(!error && response.statusCode ==200){
			 	
			var resJSON = JSON.parse(body)
 			var next = resJSON.paging.next

 			for(var key in resJSON.data){
 				events.push(resJSON.data[key])
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

//have to call this with a url!
var attendees = [];
function getEventAttendees(url, callback){
	//var url= 'https://graph.facebook.com/v2.9/'++'/attending?&access_token=' + accessToken;
	//console.log(url);
	request(url, function (error, response, body) {
		if(!error && response.statusCode ==200){
			 	
			var resJSON = JSON.parse(body)
 			var next = resJSON.paging ? resJSON.paging.next : ''

 			//events.push(resJSON.data)
 			//event.attendees = resJSON.data

 			for(var key in resJSON.data){
 				attendees.push(resJSON.data[key])
 			}

			if (next) { // if set, this is the next URL to query
             	getEventAttendees(next, callback);
           		
           	} else {
              	callback(); //Call when we are finished
            }
		} else {
			console.log('Error retrieving page event data: ' + error);

		}

	});
}

var interested = [];
function getEventInterested(url, callback){
	request(url, function (error, response, body) {
		if(!error && response.statusCode ==200){
			 	
			var resJSON = JSON.parse(body)
 			var next = resJSON.paging.next

 			for(var key in resJSON.data){
 				interested.push(resJSON.data[key])
 			}

			if (next) { // if set, this is the next URL to query
             	getEventInterested(next, callback);
           		
           	} else {
              	callback(); //Call when we are finished
            }
		} else {
			console.log('Error retrieving page event data: ' + error);
		}

	});
}






// 	function nextPage(next, callback){
// 		console.log(next)
// 					if (next) { // if set, this is the next URL to query
//             	  		getPageEventData(next, callback);
           		
//            		 	} else {
//              	   callback(); //Call when we are finished
//             	}
// 	}

// 	function getEventAttendees(events, nextPage, next, callback, index){
// 		console.log('getting attendees for: ' + events[index].name)
// 		var url = events[index].attendeeURL;
// 		//console.log(events.length)
// 		request(url, function(error, response, body){
// 			if(!error && response.statusCode == 200){
// 				var resJSON = JSON.parse(body)
// 				events[index].attendees = resJSON.data
// 				events[index].nextAttendeeURL = resJSON.paging ? resJSON.paging.next : ''

// 				if(index + 1 === events.length){
// 					if(events[index].nextAttendeeURL){ //we have done one page of attendees and need to get more attendees for the event
// 						getEventAttendees(events, nextPage, next, callback, index)
// 						console.log('time to get the next page of attendees')
// 					} else {
// 						nextPage(next, callback); //we have gotten all our pages of attendees for this event and need to move on
// 					}

// 				} else {//get more attendees for events on this page
// 					getEventAttendees(events, nextPage, next, callback, index + 1)
// 					console.log(index + 1)
// 				}

// 			} else {
// 				console.log('Error getting event attendees: ' + error)
// 			}
// 		})
		
// 		//nextPage(next, callback);
// 	}

// 	function getPageEventData(url, callback){
// 		request(url, function (error, response, body) {
// 			if(!error && response.statusCode ==200){
// 				events = []; //have to empty the events array out
// 				var resJSON = JSON.parse(body)
// 				var next = resJSON.paging.next
// 				//console.log(resJSON);



// 				//Get one event from the page
// 				for(var key in resJSON.data){
// 					var event = new Object();
// 					event.name = resJSON.data[key].name
// 					event.id = resJSON.data[key].id
// 					event.start_time = resJSON.data[key].start_time
// 					event.end_time = resJSON.data[key].end_time
// 					event.place = resJSON.data[key].place
// 					event.attendeeURL = 'https://graph.facebook.com/v2.9/' + event.id + '/attending?&access_token=' + accessToken;


// 					events.push(event)
// 				}

// 				//console.log(next)

// 				//Then go get all the attendees for all the events
// 				getEventAttendees(events,nextPage, next, callback, 0)

// 			} else {
// 				console.log('Error with Facebook API Call: ' + error);
// 			}
// 		});
// 	}

// 	//the function that calls all the events for a page
// 	getPageEventData(url, function () {
//    		res.send(events)
//    		//res.send(events.toString().replace(/,/g, ''))
// 		console.log('We are done');
// 	});
// })

})


module.exports = router;