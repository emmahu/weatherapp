import Ember from "ember";

export
default Ember.Handlebars.makeBoundHelper(function(value, options) {

  var precipitation = value,
      useUSUnits = options.hash['unitParam'];
  if(precipitation === 0) {
    return '--';
  }

  // If using US units, convert from mm to inches.
  var amount = ((useUSUnits) ? (precipitation * 0.0393701).toFixed(2) : precipitation);

  return amount + ((useUSUnits) ? ' in' : ' mm');
});