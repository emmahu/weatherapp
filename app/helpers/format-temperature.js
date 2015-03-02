import Ember from "ember";
import config from "weather/config/environment";

export default Ember.Handlebars.makeBoundHelper(function(value, options) {
  return Math.round(config.APP.useUSUnits ? (value * 9/5 + 32) : value) +"˚";;
});