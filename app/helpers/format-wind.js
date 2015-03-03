  import Ember from "ember";
// import config from "weather/config/environment";

export
default Ember.Handlebars.makeBoundHelper(function(value, options) {
    var conditions = value,
        useUSUnits = options.hash['unitParam'],
        formatBearing = options.hash['formatBearing'],
        speed    = (useUSUnits ? conditions.windSpeed * 0.621371 : conditions.windSpeed).toFixed(1);
    return speed + (useUSUnits ? ' mph' : ' kph') + ' ' + formatBearing;
    // return speed + (useUSUnits ? ' mph' : ' kph') + ' ' + this.get('formatBearing');
});