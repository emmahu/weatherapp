import Ember from "ember";
// import config from "weather/config/environment";

export
default Ember.Handlebars.makeBoundHelper(function(value, options) {
  var pressure = value,
      useUSUnits = options.hash['unitParam'];
  // If using US units, convert to inches.
  if(useUSUnits) {
    return ((pressure*0.000295299830714*100).toFixed(2)) + " in";
  }

  return (pressure).toFixed(2) + ' hPa';
});