import Ember from "ember";
// import config from "weather/config/environment";

export
default Ember.Handlebars.makeBoundHelper(function(value, options) {

  var precipitation = value,
      useUSUnits = options.hash['unitParam'];
  // console.log(this.get('hourly').precipIntensity);
  if(precipitation === 0) {
    return '--';
  }

  // If using US units, convert from mm to inches.
  // var useUSUnits = ENV.APP.useUSUnits,
  var amount = ((useUSUnits) ? (precipitation * 0.0393701).toFixed(2) : precipitation);

  return amount + ((useUSUnits) ? ' in' : ' mm');
});