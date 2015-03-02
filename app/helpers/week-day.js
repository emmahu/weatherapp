import Ember from "ember";
import config from "weather/config/environment";

export
default Ember.Handlebars.makeBoundHelper(function(value, options) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][value.getDay()];
});
