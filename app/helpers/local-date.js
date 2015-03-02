import Ember from "ember";
import config from "weather/config/environment";

export default Ember.Handlebars.makeBoundHelper(function(value, options) {
  var time = value;
  var timezoneOffset = options.hash['offset'];
  var timeOffsetSinceLastRefresh = options.hash['since'];
  // var time = this.get('weatherData').currently.time,
      // timezoneOffset = this.get('weatherData').offset,
      // timeOffsetSinceLastRefresh = new Date().getTime() - this.get('lastUpdated');
  timeOffsetSinceLastRefresh = timeOffsetSinceLastRefresh ? timeOffsetSinceLastRefresh : 0;
  var date  = new Date(time * 1000 + timeOffsetSinceLastRefresh);
  var utc   = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());

  utc.setHours(utc.getHours() + timezoneOffset);
  return utc;
});