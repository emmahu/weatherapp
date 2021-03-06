import Ember from 'ember';

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
    return this.get('weatherData.hourly.data.0');
  }.property('weatherData'),

  daily: function(){
    return this.get('weatherData.daily.data.0');
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
    return this.get('weatherData.hourly.data.0.summary');
  }.property('weatherData'),

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

  hourlyListWidth: function() {
    return 'width: ' + (Math.min(this.get('weatherData.hourly.data').length, 24) * 64) + 'px;';
  }.property('weatherData'),

  hourlyData: function() {
    var data = this.get('weatherData.hourly.data');
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
    return newData;
  }.property('weatherData'),

  dailyData: function() {
    var data = this.get('weatherData.daily.data');
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
    return newData;
  }.property('weatherData'),

  precipType: function(){
    return this.get('hourly.precipType') === 'snow' ? 'Chance of Snow:' : 'Chance of Rain:';
  }.property('hourly'),

  formatBearing: function() {
    // From: http://stackoverflow.com/questions/3209899/determine-compass-direction-from-one-lat-lon-to-the-other
    var bearings = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"],
        conditions = this.get('hourly'),
        brng = conditions.windBearing,
        index    = brng - 22.5;

    if (index < 0) {
      index += 360;
    }
    index = parseInt(index / 45);

    return(bearings[index]);
  }.property('hourly'),

  sinceLastRefresh: function() {
    return new Date().getTime() - this.get('lastUpdated');
  }.property('lastUpdated'),

  isCurLocation: function() {
    return (this.get('id') === 'currentlocation');
  }.property('id')

});


export default City;