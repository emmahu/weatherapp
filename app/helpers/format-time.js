import Ember from "ember";
import config from "weather/config/environment";

export
default Ember.Handlebars.makeBoundHelper(function(value, options) {
    // var date = this.get('localDate'),
    var date = value,
        // showMinutes = true,
        showMinutes = options.hash['showMinutes'],
        hours    = date.getHours(),
        meridian = 'AM';

    if(hours >= 12) {
      if(hours > 12) {
        hours -= 12;
      }
      meridian = 'PM';
    }

    if (hours == 0) {
      hours = 12;
    }

    if(showMinutes) {
      var minutes = date.getMinutes();
      if(minutes < 10) {
        minutes = '0'+minutes;
      }

      return hours + ':' + minutes + ' ' + meridian;
    }
    return hours + ' ' + meridian;
  });