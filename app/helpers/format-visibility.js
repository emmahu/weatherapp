import Ember from "ember";
// import config from "weather/config/environment";

export
default Ember.Handlebars.makeBoundHelper(function(value, options) {
  // formatVisibilty: function() {
    var visibility = value;

    // If using US units, convert to miles.
    var useUSUnits = options.hash['unitParam'],
        distance    = (useUSUnits ? visibility * 0.621371 : visibility).toFixed(1);

    return distance + ((useUSUnits) ? ' mi' : ' km');
});