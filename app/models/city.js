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
    var localDate = this.get('localDate'),
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
        first: (i==0),
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



  formatWind: function() {

    // If US units, then convert from km to miles.
    var conditions = this.get('hourly'),
        useUSUnits = ENV.APP.useUSUnits,
        speed    = (useUSUnits ? conditions.windSpeed * 0.621371 : conditions.windSpeed).toFixed(1);
    // console.log(useUSUnits);
    // console.log(conditions.windBearing);
    // console.log(new Date(conditions.windBearing), true);
    // Also, add the bearing.
    return speed + (useUSUnits ? ' mph' : ' kph') + ' ' + this.get('formatBearing');
    // return speed + (useUSUnits ? ' mph' : ' kph') + ' ' + this.formatBearing(new Date(conditions.windBearing), true);
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

  formatPrecipitation: function() {
    var precipitation = this.get('hourly').precipIntensity;
    // console.log(this.get('hourly').precipIntensity);
    if(precipitation == 0) {
      return '--';
    }

    // If using US units, convert from mm to inches.
    var useUSUnits = ENV.APP.useUSUnits,
        amount      = ((useUSUnits) ? (precipitation * 0.0393701).toFixed(2) : precipitation);

    return amount + ((useUSUnits) ? ' in' : ' mm');
  }.property('hourly'),

  formatPressureFromHPA: function() {
    var pressure = this.get('hourly').pressure;
    // If using US units, convert to inches.
    if(ENV.APP.useUSUnits) {
      return ((pressure*0.000295299830714*100).toFixed(2)) + " in";
    }

    return (pressure).toFixed(2) + ' hPa';
  }.property('hourly'),

  formatVisibilty: function() {
    var visibility = this.get('hourly').visibility;

    // If using US units, convert to miles.
    var useUSUnits = this.useUSUnits,
        distance    = (useUSUnits ? visibility * 0.621371 : visibility).toFixed(1);

    return distance + ((useUSUnits) ? ' mi' : ' km');
  }.property('hourly')

  // formatTime: function() {
  //   var date = this.get('localDate'),
  //       showMinutes = true,
  //       // var date = value,
  //       // showMinutes = options.hash['showMinutes'],
  //       hours    = date.getHours(),
  //       meridian = 'AM';

  //   if(hours >= 12) {
  //     if(hours > 12) {
  //       hours -= 12;
  //     }
  //     meridian = 'PM';
  //   }

  //   if (hours == 0) {
  //     hours = 12;
  //   }

  //   if(showMinutes) {
  //     var minutes = date.getMinutes();
  //     if(minutes < 10) {
  //       minutes = '0'+minutes;
  //     }

  //     return hours + ':' + minutes + ' ' + meridian;
  //   }
  //   return hours + ' ' + meridian;
  // }.property('localDate'),

  // todayDetailsData: function() {
  //   var weatherData       = this.weatherData,
  //       currentConditions = weatherData.hourly.data[0];
  //   [
  //         {
  //           label:'Sunrise:',
  //           value: this.formatTime(this.)
  //           // value: this.formatTime(this.getLocalDate(weatherData.daily.data[0].sunriseTime, weatherData.offset), true)
  //         },
  //         {
  //           label:'Sunset:',
  //           value: this.formatTime(this.getLocalDate(weatherData.daily.data[0].sunsetTime, weatherData.offset), true)
  //         },
  //         {
  //           label: '',
  //           value: '',
  //         },
  //         {
  //           label: currentConditions.precipType === 'snow' ? 'Chance of Snow:' : 'Chance of Rain:',
  //           value: this.formatPercentage(currentConditions.precipProbability)
  //         },
  //         {
  //           label: 'Humidity:',
  //           value: this.formatPercentage(currentConditions.humidity)
  //         },
  //         {
  //           label: '',
  //           value: '',
  //         },
  //         {
  //           label: 'Wind:',
  //           value: this.formatWind(currentConditions)
  //         },
  //         {
  //           label: 'Feels like:',
  //           value: this.formatTemperature(currentConditions.apparentTemperature),
  //         },
  //         {
  //           label: '',
  //           value: '',
  //         },
  //         {
  //           label: 'Precipitation:',
  //           value: this.formatPrecipitation(currentConditions.precipIntensity)
  //         },
  //         {
  //           label: 'Pressure:',
  //           value: this.formatPressureFromHPA(currentConditions.pressure)
  //         },
  //         {
  //           label: '',
  //           value: '',
  //         },
  //         {
  //           label: 'Visibility:',
  //           value: this.formatVisibilty(currentConditions.visibility),
  //         }
  //       ];
  // }


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