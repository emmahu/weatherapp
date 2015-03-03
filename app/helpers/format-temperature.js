import Ember from "ember";
// import config from "weather/config/environment";
import config from "weather/appconfig";

export default Ember.Handlebars.makeBoundHelper(function(value, options) {
  // var useUSUnits = options.hash['unitParam'] || config.APP.useUSUnits;
  var useUSUnits = options.hash['unitParam'] || config.useUSUnits;
  // console.log(useUSUnits);
  return Math.round(useUSUnits ? (value * 9/5 + 32) : value) +"˚";
});