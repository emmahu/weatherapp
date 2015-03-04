import Ember from 'ember';
import ENV from "weather/config/environment";

var City = Ember.Object.extend({
  id: 'sanjose',
  name: 'sanjose',
  lat: 0,
  lng: 0,
  lastUpdated: -1,
  weatherData: null,


  localDate: function() {
    var time = this.get('weatherData').currently.time,
        timezoneOffset = this.get('weatherData').offset,
        timeOffsetSinceLastRefresh = new Date().getTime() - this.get('lastUpdated');
    timeOffsetSinceLastRefresh = timeOffsetSinceLastRefresh ? timeOffsetSinceLastRefresh : 0;
    var date  = new Date(time * 1000 + timeOffsetSinceLastRefresh);
    var utc   = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());

    utc.setHours(utc.getHours() + timezoneOffset);
    return utc;
  }.property('weatherData','lastUpdated'),



  hourly: function(){
    return this.get('weatherData').hourly.data[0];
  }.property('weatherData'),

  daily: function(){
    return this.get('weatherData').daily.data[0];
  }.property('weatherData'),

  conditionClassname: function() {
    var classNames = '',
        data = this.get('weatherData');

    if(data) {
      var conditionsNow = data.hourly.data[0],
          date          = new Date(conditionsNow.time * 1000);

      // It is day if you're between sunrise and sunset. Then add the is-day class. Otherwise, add is-night
      if(conditionsNow.time >= data.daily.data[0].sunriseTime && conditionsNow.time <= data.daily.data[0].sunsetTime) {
        classNames += 'is-day ';
      } else {
        classNames += 'is-night ';
      }

      // If the icon name includes cloudy OR there is a cloudCover above 0.2, make it cloudy.
      // The 0.2 is completely arbitary.
      if(conditionsNow.icon.indexOf('cloudy') !== -1 || conditionsNow.cloudCover > 0.2) {
        classNames += 'is-cloudy ';
      }
    }
    return classNames;
  }.property("weatherData"),

  summary: function(){
    return this.get('weatherData').hourly.data[0].summary;
  }.property('weatherData'),

  // updateSelectedCityToday: function() {
  //   var localDate = this.get('localDate'),
  //       diff = Math.round((localDate.getTime() - new Date().getTime())/(24*3600*1000)),
  //       relativeDate   = 'Today';
  //   if(diff < 0) {
  //     relativeDate = 'Yesterday';
  //   } else if(diff > 0) {
  //     relativeDate = 'Tomorrow';
  //   }

  //   var weatherData = this.get('weatherData');

  // },
  relativeDate: function() {
    var localDate = this.get('localDate'),
        diff = Math.round((localDate.getTime() - new Date().getTime())/(24*3600*1000)),
        relativeDate   = 'Today';
    if(diff < 0) {
      relativeDate = 'Yesterday';
    } else if(diff > 0) {
      relativeDate = 'Tomorrow';
    }
    return relativeDate;
  }.property('localDate'),

  // weekDayForDate: function() {
  //   var date = this.get('localDate');
  //   return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][date.getDay()];
  // }.property('localDate'),

  hourlyListWidth: function() {
    return 'width: ' + (Math.min(this.get('weatherData').hourly.data.length, 24) * 64) + 'px;';
  }.property('weatherData'),

  hourlyData: function() {
    var data = this.get('weatherData').hourly.data;
    var newData = [];
    for (var i = 0; i < Math.min(data.length, 24); ++i) {
      var d = data[i];
      newData.push({
        first: (i===0),
        icon: 'images/' + d.icon + '.png',
        temperature: d.temperature,
        time: d.time
      });
    }
    // console.log(data.length, newData.length);
    return newData;
  }.property('weatherData'),

  dailyData: function() {
    var data = this.get('weatherData').daily.data;
    var newData = [];
    for (var i = 0; i < Math.min(data.length, 24); ++i) {
      var d = data[i];
      newData.push({
        icon: 'images/' + d.icon + '.png',
        temperatureMax: d.temperatureMax,
        temperatureMin: d.temperatureMin,
        time: d.time
      });
    }
    // console.log(data.length, newData.length);
    // console.log(ENV.APP.useUSUnits);
    return newData;
  }.property('weatherData'),

  precipType: function(){
    return this.get('hourly').precipType === 'snow' ? 'Chance of Snow:' : 'Chance of Rain:';
  }.property('hourly'),

  formatBearing: function() {
    // From: http://stackoverflow.com/questions/3209899/determine-compass-direction-from-one-lat-lon-to-the-other
    var bearings = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"],
        conditions = this.get('hourly'),
        brng = conditions.windBearing,
        // brng ＝ this.get('hourly').windBearing,
        index    = brng - 22.5;

    // console.log(this.get('hourly').windBearing);

    if (index < 0) {
      index += 360;
    }
    index = parseInt(index / 45);

    return(bearings[index]);
  }.property('hourly'),

  sinceLastRefresh: function() {
    return new Date().getTime() - this.get('lastUpdated');
  }.property('lastUpdated')

  // Get the data for a individual city
  // isLast denotes that it is the last in the list
  // getWeatherDataForCityId: function(){

  //   var self = this,
  //       city = self.get('controller.content');

  //   // If this is called within the refresh interval, then just bail here.
  //   if (!city || (new Date().getTime() - this.dataRefreshInterval) < city.lastUpdated) return;
  //   // Always return with SI units. Conversion to imperial/US can be done on the client side.
  //   // However, doing it with the API is just fine as well.
  //   $.ajax({
  //     url: self.config.weatherAPIBaseURL + self.config.weatherAPIKey + '/'+ city.lat +","+city.lng+"?units=si",
  //     jsonp: 'callback',
  //     dataType: 'jsonp',
  //     success: function(data) {
  //       city.weatherData = data;
  //       city.lastUpdated = new Date().getTime();
  //       self.syncLocalStorage();

  //       // The context here is list and if it is the last
  //       // item in the list, then we render the list at that point.
  //       // Otherwise, we would render too often.
  //       if (context === 'list' && isLast) {
  //         self.renderCitiesList();

  //       // If it is on the details page, then render that single city.
  //       } else if (context === 'detail') {
  //         self.renderSelectedCity();
  //       }
  //     }
  //   });
  // }.property('city')

});


export default City;