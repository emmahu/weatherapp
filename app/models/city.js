// import DS from "ember-data";

// var City = DS.Model.extend({

  // id: DS.attr('string'),
  // name: DS.attr('string'),
  // lat: DS.attr('number'),
  // lng: DS.attr('number'),
  // lastUpdated: DS.attr('number', {
  //   defaultValue: function() {
  //     return -1;
  //   }
  // }),
  // weatherData: DS.attr(),
  // weatherData: DS.attr('object')
import Ember from 'ember';

var City = Ember.Object.extend({
  id: 'sanjose',
  name: 'sanjose',
  lat: 0,
  lng: 0,
  lastUpdated: -1,
  weatherData: null,

  getLocalDate: function() {
    var time = this.get('weatherData').currently.time,
        timezoneOffset = this.get('weatherData').offset,
        timeOffsetSinceLastRefresh = new Date().getTime() - this.get('lastUpdated');
    timeOffsetSinceLastRefresh = timeOffsetSinceLastRefresh ? timeOffsetSinceLastRefresh : 0;
    var date  = new Date(time * 1000 + timeOffsetSinceLastRefresh);
    var utc   = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());

    utc.setHours(utc.getHours() + timezoneOffset);
    return utc;
  }.property('weatherData','lastUpdated'),

  formatTime: function() {
    var date = this.get('getLocalDate'),
        showMinutes = true,
        hours    = date.getHours(),
        meridian = 'AM';

    if(hours >= 12) {
      if(hours > 12) {
        hours -= 12;
      }
      meridian = 'PM';
    }

    if (hours == 0) {
      hours = 12;
    }

    if(showMinutes) {
      var minutes = date.getMinutes();
      if(minutes < 10) {
        minutes = '0'+minutes;
      }

      return hours + ':' + minutes + ' ' + meridian;
    }
    return hours + ' ' + meridian;
  }.property('getLocalDate'),



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
      if(conditionsNow.icon.indexOf('cloudy') != -1 || conditionsNow.cloudCover > 0.2) {
        classNames += 'is-cloudy ';
      }
    }
    return classNames;
  }.property("weatherData"),

  summary: function(){
    return this.get('weatherData').hourly.data[0].summary;
  }.property('weatherData'),

  updateSelectedCityToday: function() {
    var localDate = this.get('getLocalDate'),
        diff = Math.round((localDate.getTime() - new Date().getTime())/(24*3600*1000)),
        relativeDate   = 'Today';
    if(diff < 0) {
      relativeDate = 'Yesterday';
    } else if(diff > 0) {
      relativeDate = 'Tomorrow';
    }

    var weatherData = this.get('weatherData');

  },
  relativeDate: function() {
    var localDate = this.get('getLocalDate'),
        diff = Math.round((localDate.getTime() - new Date().getTime())/(24*3600*1000)),
        relativeDate   = 'Today';
    if(diff < 0) {
      relativeDate = 'Yesterday';
    } else if(diff > 0) {
      relativeDate = 'Tomorrow';
    }
    return relativeDate;
  }.property('getLocalDate'),

  weekDayForDate: function() {
    var date = this.get('getLocalDate');
    return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][date.getDay()];
  }.property('getLocalDate'),

  hourlyForecastForHour: function() {
    return this.get('weatherData').hourly.data;
  }.property('weatherData'),

  hoursString: function() {
    var hourlyForecastDate    = this.getLocalDate(hourlyForecastForHour.time, city.weatherData.offset);

  }

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