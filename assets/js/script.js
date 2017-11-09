
$(document).ready(function(){

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBG8jW6tDtzxrio45pKiPJue3ciuded0a0",
    authDomain: "train-scheduler-ef5fb.firebaseapp.com",
    databaseURL: "https://train-scheduler-ef5fb.firebaseio.com",
    projectId: "train-scheduler-ef5fb",
    storageBucket: "train-scheduler-ef5fb.appspot.com",
    messagingSenderId: "712122224354"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database
    var database = firebase.database();

    var trainName = "";
    var destination = "";
    var frequency = 0;
    var firstTrainTime = "";
    var minutesAway = 0;
    var trains =[];
    

    $("#add-train").on("click", function(event) {
      // Prevent the page from refreshing
      event.preventDefault();
 		var train = {
     	trainName: "",
     	destination: "",
     	frequency: "",
      firstTrainTime: ""
     };
      // Get inputs
      trainName = $("#train-name").val().trim();
      destination = $("#destination").val().trim();
      frequency = $("#frequency").val().trim();
      firstTrainTime = $("#first-train-time").val().trim();

     train.trainName = trainName;
     train.destination = destination;
     train.frequency = frequency;
     train.firstTrainTime = firstTrainTime;

      trains.push(train);

      // Change what is saved in firebase
      database.ref().set({
      	trains: trains
      });
    });


     database.ref().on("value", function(snapshot) {
     	var result = snapshot.val();
     	console.log(snapshot.val());
     	$("#table-body").empty();
     	trains = result.trains;
     	for(var i = 0; i < result.trains.length; i++){
     		var trainNameResult = result.trains[i].trainName;
     		var destinationResult = result.trains[i].destination;
     		var frequencyResult = result.trains[i].frequency;
        var firstTrainTimeResult = result.trains[i].firstTrainTime;
     		addTrainRow(trainNameResult, destinationResult, frequencyResult,firstTrainTimeResult, i);

     	}
     	
      
      // If any errors are experienced, log them to console.
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

     //function to add row
     function addTrainRow(trainName, destination, frequency, firstTrainTime, i){
     	var tableBody = $("#table-body");
     	var newRow = $("<tr>");
      newRow.attr("data-number", i);
     	var newTrainName = $("<td>").html(trainName);
     	var newDestination = $("<td>").html(destination);
     	var newFrequency = $("<td>").html(frequency);
     	newRow.append(newTrainName).append(newDestination).append(newFrequency);
     	tableBody.append(newRow);


      //calculate next arrival
      var currentTime = moment();
      var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      var tRemainder = diffTime % frequency;
      var tMinutesTillTrain = frequency - tRemainder;
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");

      //add to row
      var remaindingMinutes = $("<td>").html(tMinutesTillTrain);
      var nextTrainData = $("<td>").html(moment(nextTrain).format("hh:mm A"));
      newRow.append(nextTrainData).append(remaindingMinutes);
     }

     //function to calculate next arrival



});