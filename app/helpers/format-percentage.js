import Ember from "ember";
// import config from "weather/config/environment";

export
default Ember.Handlebars.makeBoundHelper(function(value, options) {
  return Math.round(value * 100) + "%";
});
