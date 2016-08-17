
populateSelects(hotels, 'hotel');
populateSelects(activities,'activity');
populateSelects(restaurants,'restaurant');
var days = [];
var dayCount = 1;

function populateSelects(dataArray, elementName){
  dataArray.forEach(function(element){
    var newOption = $('<option value="' + element.name + '">' + element.name +  '</option>');
    $('#' + elementName + '-choices ').append(newOption) ;
  });
}


$('#add-hotel').on('click', function(){
  addItinerary.call(this, hotels, 'My Hotel', 'hotel');
});
$('#add-restaurant').on('click', function(){
  addItinerary.call(this, restaurants, 'My Restaurants', 'restaurant');
});
$('#add-activity').on('click', function(){
  addItinerary.call(this, activities, 'My Activities', 'activity');
});

$('#day-add').on('click',function(){
  dayCount++;
  $newDayButton = $('<button class="btn btn-circle day-btn">'+dayCount+'</button>');
  $('#day-add').before($newDayButton);

});

$('.day-btn').on('click',"div",function(){
  console.log($(this));
  clearView();
  $('.selected').removeClass('selected');
  $(this).addClass('selected');

})

function addItinerary(dataArray, name, type){

  var eventName = $(this).prev('select').val();
  var selectedItem;

  //get Info on event (lat/long, etc)
  for (var i = 0; i < dataArray.length; i++) {
    if(eventName === dataArray[i].name) {
      selectedItem = dataArray[i];
      break;
    }
  }

  var currentDay = getSelectedDay();
  // console.log(currentDay.markerObject);
  var markerObject = currentDay.markerObject;
  // console.log(markerObject);
  if(markerObject.hasOwnProperty(eventName)) { return; }

  //render new itinerary-item
  var $selectedItemName = $('<span class="title ' +type+ '">'+selectedItem.name+'</span>' +
  '<button class="event-btn btn btn-xs btn-danger remove btn-circle">x</button>');
  $('h4:contains(' + name + ')').next().children().append($selectedItemName);

  //adding itinerary-item to day object
  currentDay[type].push(selectedItem);

  var latLng = selectedItem.place.location;

  //add marker object model and view
  markerObject[selectedItem.name] = drawMarkerGlobal(type, latLng);

  console.log('added',currentDay);

  $('.event-btn').on('click', function(){
    var placename = $(this).prev().text();
    var day = getSelectedDay();

    day.markerObject[placename].setMap(null);
    delete day.markerObject[placename];

    var eventType = $(this).prev().attr('class').split(' ')[1];
    var indexToRemove = day[eventType].indexOf(placename);
    day[eventType].splice(indexToRemove,1);

    $(this).prev().remove();
    $(this).remove();

  });
}

function getSelectedDay(){
  var dayNum = +$('.selected').text();
  if(!days[dayNum]){
    var day = { hotel: [], restaurant: [], activity: [], markerObject: {} };
    days[dayNum] = day;
    console.log('HI WE ARE IN GET SELECTED DAY',JSON.stringify(day));
  }
  else{
    var day = days[dayNum];
  }
  return day;
}

function clearView(){
  $('.itinerary-item').children().remove();
  var day = getSelectedDay();
  var markerObj = day.markerObject;
  for(var marker in markerObj) {
    marker.setMap(null);
  }
}
