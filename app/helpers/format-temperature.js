import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(value, options) {
  // var useUSUnits = options.hash['unitParam'] || config.useUSUnits;
  var useUSUnits = options.hash['unitParam'];
  return Math.round(useUSUnits ? (value * 9/5 + 32) : value) +"˚";
});