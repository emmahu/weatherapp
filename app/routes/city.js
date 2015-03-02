import Ember from 'ember';
import City from 'weather/models/city';

var CityRoute = Ember.Route.extend({

  // actions: {
  //   delete: function(id) {
  //     // Make sure that you really want to delete it before doing it.
  //     var shouldDelete = confirm('Are you sure you want to delete this city?');
  //     if(shouldDelete) {
  //       this.store.find('city', id).then(function (city) {
  //         city.destroyRecord();
  //       });
  //       this.transitionTo('index');
  //     }
  //   }
  // },

  model: function(params) {
    // alert("good");
    return City.create({
        id: 'sanjose',
        name: 'San Jose',
        lat: 37.3382082,
        lng: -121.88632860000001,
        lastUpdated: -1,
        weatherData: {
          "latitude":37.3382082,"longitude":-121.88632860000001,"timezone":"America/Los_Angeles","offset":-8,"currently":{"time":1425258346,"summary":"Partly Cloudy","icon":"partly-cloudy-day","nearestStormDistance":9,"nearestStormBearing":89,"precipIntensity":0,"precipProbability":0,"temperature":62.26,"apparentTemperature":62.26,"dewPoint":39.61,"humidity":0.43,"windSpeed":5.21,"windBearing":314,"visibility":10,"cloudCover":0.4,"pressure":1012.75,"ozone":417.92},"minutely":{"summary":"Partly cloudy for the hour.","icon":"partly-cloudy-day","data":[{"time":1425258300,"precipIntensity":0,"precipProbability":0},{"time":1425258360,"precipIntensity":0,"precipProbability":0},{"time":1425258420,"precipIntensity":0,"precipProbability":0},{"time":1425258480,"precipIntensity":0,"precipProbability":0},{"time":1425258540,"precipIntensity":0,"precipProbability":0},{"time":1425258600,"precipIntensity":0,"precipProbability":0},{"time":1425258660,"precipIntensity":0,"precipProbability":0},{"time":1425258720,"precipIntensity":0,"precipProbability":0},{"time":1425258780,"precipIntensity":0,"precipProbability":0},{"time":1425258840,"precipIntensity":0,"precipProbability":0},{"time":1425258900,"precipIntensity":0,"precipProbability":0},{"time":1425258960,"precipIntensity":0,"precipProbability":0},{"time":1425259020,"precipIntensity":0,"precipProbability":0},{"time":1425259080,"precipIntensity":0,"precipProbability":0},{"time":1425259140,"precipIntensity":0,"precipProbability":0},{"time":1425259200,"precipIntensity":0,"precipProbability":0},{"time":1425259260,"precipIntensity":0,"precipProbability":0},{"time":1425259320,"precipIntensity":0,"precipProbability":0},{"time":1425259380,"precipIntensity":0,"precipProbability":0},{"time":1425259440,"precipIntensity":0,"precipProbability":0},{"time":1425259500,"precipIntensity":0,"precipProbability":0},{"time":1425259560,"precipIntensity":0,"precipProbability":0},{"time":1425259620,"precipIntensity":0,"precipProbability":0},{"time":1425259680,"precipIntensity":0,"precipProbability":0},{"time":1425259740,"precipIntensity":0,"precipProbability":0},{"time":1425259800,"precipIntensity":0,"precipProbability":0},{"time":1425259860,"precipIntensity":0,"precipProbability":0},{"time":1425259920,"precipIntensity":0,"precipProbability":0},{"time":1425259980,"precipIntensity":0,"precipProbability":0},{"time":1425260040,"precipIntensity":0,"precipProbability":0},{"time":1425260100,"precipIntensity":0,"precipProbability":0},{"time":1425260160,"precipIntensity":0,"precipProbability":0},{"time":1425260220,"precipIntensity":0,"precipProbability":0},{"time":1425260280,"precipIntensity":0,"precipProbability":0},{"time":1425260340,"precipIntensity":0,"precipProbability":0},{"time":1425260400,"precipIntensity":0,"precipProbability":0},{"time":1425260460,"precipIntensity":0,"precipProbability":0},{"time":1425260520,"precipIntensity":0,"precipProbability":0},{"time":1425260580,"precipIntensity":0,"precipProbability":0},{"time":1425260640,"precipIntensity":0,"precipProbability":0},{"time":1425260700,"precipIntensity":0,"precipProbability":0},{"time":1425260760,"precipIntensity":0,"precipProbability":0},{"time":1425260820,"precipIntensity":0.0031,"precipIntensityError":0.0014,"precipProbability":0.01,"precipType":"rain"},{"time":1425260880,"precipIntensity":0.0031,"precipIntensityError":0.0015,"precipProbability":0.01,"precipType":"rain"},{"time":1425260940,"precipIntensity":0.0032,"precipIntensityError":0.0014,"precipProbability":0.01,"precipType":"rain"},{"time":1425261000,"precipIntensity":0.0032,"precipIntensityError":0.0015,"precipProbability":0.01,"precipType":"rain"},{"time":1425261060,"precipIntensity":0.0032,"precipIntensityError":0.0015,"precipProbability":0.01,"precipType":"rain"},{"time":1425261120,"precipIntensity":0.0032,"precipIntensityError":0.0015,"precipProbability":0.01,"precipType":"rain"},{"time":1425261180,"precipIntensity":0.0032,"precipIntensityError":0.0015,"precipProbability":0.01,"precipType":"rain"},{"time":1425261240,"precipIntensity":0.0032,"precipIntensityError":0.0015,"precipProbability":0.01,"precipType":"rain"},{"time":1425261300,"precipIntensity":0.0032,"precipIntensityError":0.0015,"precipProbability":0.01,"precipType":"rain"},{"time":1425261360,"precipIntensity":0.0032,"precipIntensityError":0.0015,"precipProbability":0.01,"precipType":"rain"},{"time":1425261420,"precipIntensity":0.0033,"precipIntensityError":0.0015,"precipProbability":0.01,"precipType":"rain"},{"time":1425261480,"precipIntensity":0.0033,"precipIntensityError":0.0016,"precipProbability":0.01,"precipType":"rain"},{"time":1425261540,"precipIntensity":0.0034,"precipIntensityError":0.0016,"precipProbability":0.01,"precipType":"rain"},{"time":1425261600,"precipIntensity":0.0034,"precipIntensityError":0.0017,"precipProbability":0.01,"precipType":"rain"},{"time":1425261660,"precipIntensity":0.0035,"precipIntensityError":0.0019,"precipProbability":0.01,"precipType":"rain"},{"time":1425261720,"precipIntensity":0.0035,"precipIntensityError":0.0019,"precipProbability":0.01,"precipType":"rain"},{"time":1425261780,"precipIntensity":0.0035,"precipIntensityError":0.0021,"precipProbability":0.01,"precipType":"rain"},{"time":1425261840,"precipIntensity":0.0036,"precipIntensityError":0.0022,"precipProbability":0.01,"precipType":"rain"},{"time":1425261900,"precipIntensity":0.0037,"precipIntensityError":0.0024,"precipProbability":0.01,"precipType":"rain"}]},"hourly":{"summary":"Mostly cloudy starting tonight.","icon":"partly-cloudy-day","data":[{"time":1425258000,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":62.97,"apparentTemperature":62.97,"dewPoint":39.47,"humidity":0.42,"windSpeed":5.22,"windBearing":313,"visibility":10,"cloudCover":0.41,"pressure":1012.72,"ozone":418.2},{"time":1425261600,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.003,"precipProbability":0.06,"precipType":"rain","temperature":55.67,"apparentTemperature":55.67,"dewPoint":39.89,"humidity":0.55,"windSpeed":5.23,"windBearing":320,"visibility":10,"cloudCover":0.28,"pressure":1012.99,"ozone":415.31},{"time":1425265200,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":52.34,"apparentTemperature":52.34,"dewPoint":40.6,"humidity":0.64,"windSpeed":4.94,"windBearing":317,"visibility":9.98,"cloudCover":0.2,"pressure":1013.33,"ozone":412.52},{"time":1425268800,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":50.19,"apparentTemperature":50.19,"dewPoint":40.94,"humidity":0.7,"windSpeed":4.64,"windBearing":315,"visibility":9.69,"cloudCover":0.12,"pressure":1013.61,"ozone":410.29},{"time":1425272400,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":48.64,"apparentTemperature":47.67,"dewPoint":40.67,"humidity":0.74,"windSpeed":3.52,"windBearing":309,"visibility":9.35,"cloudCover":0.07,"pressure":1013.83,"ozone":408.16},{"time":1425276000,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":46.89,"apparentTemperature":46.89,"dewPoint":39.73,"humidity":0.76,"windSpeed":2.89,"windBearing":306,"visibility":9.24,"cloudCover":0.04,"pressure":1013.93,"ozone":405.72},{"time":1425279600,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":46.19,"apparentTemperature":46.19,"dewPoint":39.87,"humidity":0.78,"windSpeed":2.3,"windBearing":295,"visibility":8.92,"cloudCover":0.03,"pressure":1013.99,"ozone":402.72},{"time":1425283200,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":45.6,"apparentTemperature":45.6,"dewPoint":39.87,"humidity":0.8,"windSpeed":1.74,"windBearing":271,"visibility":8.84,"cloudCover":0.05,"pressure":1013.89,"ozone":399.4},{"time":1425286800,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":45.03,"apparentTemperature":45.03,"dewPoint":39.55,"humidity":0.81,"windSpeed":1.7,"windBearing":263,"visibility":8.65,"cloudCover":0.13,"pressure":1013.67,"ozone":396.12},{"time":1425290400,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":44.49,"apparentTemperature":44.49,"dewPoint":39.28,"humidity":0.82,"windSpeed":1.78,"windBearing":246,"visibility":8.32,"cloudCover":0.26,"pressure":1013.28,"ozone":392.77},{"time":1425294000,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":43.9,"apparentTemperature":43.9,"dewPoint":39.14,"humidity":0.83,"windSpeed":2.37,"windBearing":236,"visibility":7.7,"cloudCover":0.45,"pressure":1012.78,"ozone":389.47},{"time":1425297600,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":43.66,"apparentTemperature":43.66,"dewPoint":39.45,"humidity":0.85,"windSpeed":2.81,"windBearing":232,"visibility":7.37,"cloudCover":0.63,"pressure":1012.37,"ozone":386.91},{"time":1425301200,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":43.63,"apparentTemperature":43.63,"dewPoint":40.2,"humidity":0.88,"windSpeed":2.96,"windBearing":232,"visibility":6.59,"cloudCover":0.79,"pressure":1012.12,"ozone":385.46},{"time":1425304800,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":43.64,"apparentTemperature":42.1,"dewPoint":40.77,"humidity":0.9,"windSpeed":3.37,"windBearing":237,"visibility":6.03,"cloudCover":0.91,"pressure":1011.95,"ozone":384.76},{"time":1425308400,"summary":"Overcast","icon":"cloudy","precipIntensity":0,"precipProbability":0,"temperature":44.83,"apparentTemperature":43.09,"dewPoint":42.06,"humidity":0.9,"windSpeed":3.77,"windBearing":241,"visibility":5.83,"cloudCover":0.99,"pressure":1011.82,"ozone":384.44},{"time":1425312000,"summary":"Overcast","icon":"cloudy","precipIntensity":0,"precipProbability":0,"temperature":47.73,"apparentTemperature":45.85,"dewPoint":43.73,"humidity":0.86,"windSpeed":4.54,"windBearing":250,"visibility":6.3,"cloudCover":1,"pressure":1011.71,"ozone":384.51},{"time":1425315600,"summary":"Overcast","icon":"cloudy","precipIntensity":0,"precipProbability":0,"temperature":50.21,"apparentTemperature":50.21,"dewPoint":44.89,"humidity":0.82,"windSpeed":5.37,"windBearing":255,"visibility":6.78,"cloudCover":0.97,"pressure":1011.63,"ozone":384.97},{"time":1425319200,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":51.09,"apparentTemperature":51.09,"dewPoint":45.32,"humidity":0.81,"windSpeed":5.61,"windBearing":250,"visibility":6.47,"cloudCover":0.93,"pressure":1011.54,"ozone":385.46},{"time":1425322800,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":52.19,"apparentTemperature":52.19,"dewPoint":45.6,"humidity":0.78,"windSpeed":6.19,"windBearing":249,"visibility":6.33,"cloudCover":0.89,"pressure":1011.36,"ozone":385.97},{"time":1425326400,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":53.26,"apparentTemperature":53.26,"dewPoint":45.56,"humidity":0.75,"windSpeed":6.79,"windBearing":249,"visibility":6.48,"cloudCover":0.84,"pressure":1011.16,"ozone":386.52},{"time":1425330000,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":54.22,"apparentTemperature":54.22,"dewPoint":45.35,"humidity":0.72,"windSpeed":7.1,"windBearing":252,"visibility":7.09,"cloudCover":0.78,"pressure":1011.02,"ozone":386.77},{"time":1425333600,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":55.72,"apparentTemperature":55.72,"dewPoint":45.55,"humidity":0.69,"windSpeed":6.8,"windBearing":252,"visibility":8.25,"cloudCover":0.7,"pressure":1010.93,"ozone":386.53},{"time":1425337200,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":56.35,"apparentTemperature":56.35,"dewPoint":45.31,"humidity":0.66,"windSpeed":6.41,"windBearing":258,"visibility":9.29,"cloudCover":0.6,"pressure":1010.92,"ozone":386.01},{"time":1425340800,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":56.49,"apparentTemperature":56.49,"dewPoint":45.3,"humidity":0.66,"windSpeed":6.08,"windBearing":262,"visibility":10,"cloudCover":0.51,"pressure":1011.12,"ozone":385.46},{"time":1425344400,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0.0018,"precipProbability":0.01,"precipType":"rain","temperature":55.2,"apparentTemperature":55.2,"dewPoint":45.53,"humidity":0.7,"windSpeed":5.35,"windBearing":262,"visibility":10,"cloudCover":0.41,"pressure":1011.58,"ozone":385.14},{"time":1425348000,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0026,"precipProbability":0.03,"precipType":"rain","temperature":51.59,"apparentTemperature":51.59,"dewPoint":44.77,"humidity":0.77,"windSpeed":4.28,"windBearing":263,"visibility":10,"cloudCover":0.31,"pressure":1012.24,"ozone":384.79},{"time":1425351600,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0029,"precipProbability":0.04,"precipType":"rain","temperature":49.48,"apparentTemperature":48.78,"dewPoint":44.74,"humidity":0.84,"windSpeed":3.35,"windBearing":264,"visibility":10,"cloudCover":0.26,"pressure":1012.97,"ozone":384.01},{"time":1425355200,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.0022,"precipProbability":0.02,"precipType":"rain","temperature":48.48,"apparentTemperature":48.48,"dewPoint":44.73,"humidity":0.87,"windSpeed":2.6,"windBearing":261,"visibility":10,"cloudCover":0.27,"pressure":1013.75,"ozone":382.43},{"time":1425358800,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":47.82,"apparentTemperature":47.82,"dewPoint":44.67,"humidity":0.89,"windSpeed":1.54,"windBearing":240,"visibility":10,"cloudCover":0.31,"pressure":1014.55,"ozone":380.4},{"time":1425362400,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":47.26,"apparentTemperature":47.26,"dewPoint":44.61,"humidity":0.9,"windSpeed":1.29,"windBearing":211,"visibility":10,"cloudCover":0.33,"pressure":1015.23,"ozone":378.61},{"time":1425366000,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":46.68,"apparentTemperature":46.68,"dewPoint":44.4,"humidity":0.92,"windSpeed":1.14,"windBearing":200,"visibility":8.3,"cloudCover":0.33,"pressure":1015.73,"ozone":377.56},{"time":1425369600,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":46.13,"apparentTemperature":46.13,"dewPoint":44.11,"humidity":0.93,"windSpeed":0.99,"windBearing":195,"visibility":5.91,"cloudCover":0.33,"pressure":1016.1,"ozone":376.75},{"time":1425373200,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0,"precipProbability":0,"temperature":45.54,"apparentTemperature":45.54,"dewPoint":43.7,"humidity":0.93,"windSpeed":0.89,"windBearing":187,"visibility":3.8,"cloudCover":0.36,"pressure":1016.37,"ozone":375.36},{"time":1425376800,"summary":"Foggy","icon":"fog","precipIntensity":0,"precipProbability":0,"temperature":44.84,"apparentTemperature":44.84,"dewPoint":43.26,"humidity":0.94,"windSpeed":0.91,"windBearing":173,"visibility":1.89,"cloudCover":0.46,"pressure":1016.52,"ozone":372.78},{"time":1425380400,"summary":"Foggy","icon":"fog","precipIntensity":0,"precipProbability":0,"temperature":44.17,"apparentTemperature":44.17,"dewPoint":42.8,"humidity":0.95,"windSpeed":1.02,"windBearing":155,"visibility":0.27,"cloudCover":0.6,"pressure":1016.58,"ozone":369.62},{"time":1425384000,"summary":"Foggy","icon":"fog","precipIntensity":0,"precipProbability":0,"temperature":43.66,"apparentTemperature":43.66,"dewPoint":42.16,"humidity":0.94,"windSpeed":1.14,"windBearing":138,"visibility":0.15,"cloudCover":0.68,"pressure":1016.7,"ozone":366.92},{"time":1425387600,"summary":"Foggy","icon":"fog","precipIntensity":0,"precipProbability":0,"temperature":42.95,"apparentTemperature":42.95,"dewPoint":41.53,"humidity":0.95,"windSpeed":1.31,"windBearing":133,"visibility":0.31,"cloudCover":0.73,"pressure":1016.95,"ozone":365.42},{"time":1425391200,"summary":"Foggy","icon":"fog","precipIntensity":0,"precipProbability":0,"temperature":42.56,"apparentTemperature":42.56,"dewPoint":41.16,"humidity":0.95,"windSpeed":1.43,"windBearing":132,"visibility":0.53,"cloudCover":0.76,"pressure":1017.26,"ozone":364.38},{"time":1425394800,"summary":"Foggy","icon":"fog","precipIntensity":0,"precipProbability":0,"temperature":42.62,"apparentTemperature":42.62,"dewPoint":40.78,"humidity":0.93,"windSpeed":1.29,"windBearing":127,"visibility":0.8,"cloudCover":0.74,"pressure":1017.52,"ozone":362.61},{"time":1425398400,"summary":"Foggy","icon":"fog","precipIntensity":0,"precipProbability":0,"temperature":44.25,"apparentTemperature":44.25,"dewPoint":41.08,"humidity":0.89,"windSpeed":0.76,"windBearing":108,"visibility":1.12,"cloudCover":0.6,"pressure":1017.74,"ozone":359.47},{"time":1425402000,"summary":"Foggy","icon":"fog","precipIntensity":0,"precipProbability":0,"temperature":48.5,"apparentTemperature":48.5,"dewPoint":43.37,"humidity":0.82,"windSpeed":0.51,"windBearing":33,"visibility":1.49,"cloudCover":0.4,"pressure":1017.9,"ozone":355.61},{"time":1425405600,"summary":"Foggy","icon":"fog","precipIntensity":0,"precipProbability":0,"temperature":51.9,"apparentTemperature":51.9,"dewPoint":44.9,"humidity":0.77,"windSpeed":1.1,"windBearing":348,"visibility":1.89,"cloudCover":0.28,"pressure":1017.88,"ozone":351.77},{"time":1425409200,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":54.23,"apparentTemperature":54.23,"dewPoint":45.67,"humidity":0.73,"windSpeed":2,"windBearing":330,"visibility":2.33,"cloudCover":0.28,"pressure":1017.57,"ozone":348.27},{"time":1425412800,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":55.88,"apparentTemperature":55.88,"dewPoint":45.94,"humidity":0.69,"windSpeed":3.1,"windBearing":320,"visibility":2.8,"cloudCover":0.36,"pressure":1017.06,"ozone":344.79},{"time":1425416400,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":57.04,"apparentTemperature":57.04,"dewPoint":46.11,"humidity":0.67,"windSpeed":4.04,"windBearing":316,"visibility":3.29,"cloudCover":0.42,"pressure":1016.56,"ozone":341.09},{"time":1425420000,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":57.65,"apparentTemperature":57.65,"dewPoint":46.24,"humidity":0.66,"windSpeed":4.7,"windBearing":314,"visibility":3.8,"cloudCover":0.44,"pressure":1016.09,"ozone":336.9},{"time":1425423600,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":57.52,"apparentTemperature":57.52,"dewPoint":46.18,"humidity":0.66,"windSpeed":5.11,"windBearing":313,"visibility":4.32,"cloudCover":0.44,"pressure":1015.65,"ozone":332.5},{"time":1425427200,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":56.48,"apparentTemperature":56.48,"dewPoint":45.83,"humidity":0.67,"windSpeed":5.14,"windBearing":311,"visibility":4.85,"cloudCover":0.44,"pressure":1015.42,"ozone":328.46},{"time":1425430800,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":54.65,"apparentTemperature":54.65,"dewPoint":45.59,"humidity":0.71,"windSpeed":4.65,"windBearing":310,"visibility":5.38,"cloudCover":0.44,"pressure":1015.52,"ozone":324.54}]},"daily":{"summary":"No precipitation throughout the week, with temperatures rising to 78°F on Sunday.","icon":"clear-day","data":[{"time":1425196800,"summary":"Partly cloudy starting in the afternoon, continuing until evening.","icon":"partly-cloudy-day","sunriseTime":1425220825,"sunsetTime":1425261740,"moonPhase":0.38,"precipIntensity":0.0004,"precipIntensityMax":0.0045,"precipIntensityMaxTime":1425254400,"precipProbability":0.31,"precipType":"rain","temperatureMin":41.49,"temperatureMinTime":1425214800,"temperatureMax":63.35,"temperatureMaxTime":1425247200,"apparentTemperatureMin":39.81,"apparentTemperatureMinTime":1425214800,"apparentTemperatureMax":63.35,"apparentTemperatureMaxTime":1425247200,"dewPoint":40.07,"humidity":0.69,"windSpeed":1.32,"windBearing":310,"visibility":9.88,"cloudCover":0.2,"pressure":1014.05,"ozone":414.21},{"time":1425283200,"summary":"Foggy overnight.","icon":"fog","sunriseTime":1425307142,"sunsetTime":1425348199,"moonPhase":0.41,"precipIntensity":0.0008,"precipIntensityMax":0.0029,"precipIntensityMaxTime":1425351600,"precipProbability":0.04,"precipType":"rain","temperatureMin":43.63,"temperatureMinTime":1425301200,"temperatureMax":56.49,"temperatureMaxTime":1425340800,"apparentTemperatureMin":42.1,"apparentTemperatureMinTime":1425304800,"apparentTemperatureMax":56.49,"apparentTemperatureMaxTime":1425340800,"dewPoint":43.35,"humidity":0.81,"windSpeed":3.88,"windBearing":251,"visibility":8.18,"cloudCover":0.57,"pressure":1012.47,"ozone":386.02},{"time":1425369600,"summary":"Foggy in the morning.","icon":"fog","sunriseTime":1425393458,"sunsetTime":1425434657,"moonPhase":0.44,"precipIntensity":0,"precipIntensityMax":0,"precipProbability":0,"temperatureMin":42.56,"temperatureMinTime":1425391200,"temperatureMax":57.65,"temperatureMaxTime":1425420000,"apparentTemperatureMin":42.56,"apparentTemperatureMinTime":1425391200,"apparentTemperatureMax":57.65,"apparentTemperatureMaxTime":1425420000,"dewPoint":43.87,"humidity":0.82,"windSpeed":1.33,"windBearing":310,"visibility":3.66,"cloudCover":0.46,"pressure":1016.75,"ozone":346.46},{"time":1425456000,"summary":"Clear throughout the day.","icon":"clear-day","sunriseTime":1425479774,"sunsetTime":1425521115,"moonPhase":0.47,"precipIntensity":0,"precipIntensityMax":0,"precipProbability":0,"temperatureMin":42.7,"temperatureMinTime":1425474000,"temperatureMax":60.7,"temperatureMaxTime":1425510000,"apparentTemperatureMin":42.7,"apparentTemperatureMinTime":1425474000,"apparentTemperatureMax":60.7,"apparentTemperatureMaxTime":1425510000,"dewPoint":41.56,"humidity":0.69,"windSpeed":1.85,"windBearing":29,"visibility":9.98,"cloudCover":0.16,"pressure":1019.99,"ozone":334.97},{"time":1425542400,"summary":"Clear throughout the day.","icon":"clear-day","sunriseTime":1425566088,"sunsetTime":1425607573,"moonPhase":0.51,"precipIntensity":0,"precipIntensityMax":0,"precipProbability":0,"temperatureMin":44.64,"temperatureMinTime":1425564000,"temperatureMax":72.63,"temperatureMaxTime":1425596400,"apparentTemperatureMin":43.05,"apparentTemperatureMinTime":1425564000,"apparentTemperatureMax":72.63,"apparentTemperatureMaxTime":1425596400,"dewPoint":42.99,"humidity":0.61,"windSpeed":1.45,"windBearing":0,"cloudCover":0.01,"pressure":1023.58,"ozone":330.52},{"time":1425628800,"summary":"Clear throughout the day.","icon":"clear-day","sunriseTime":1425652403,"sunsetTime":1425694030,"moonPhase":0.53,"precipIntensity":0,"precipIntensityMax":0,"precipProbability":0,"temperatureMin":46.72,"temperatureMinTime":1425650400,"temperatureMax":73.35,"temperatureMaxTime":1425682800,"apparentTemperatureMin":45.95,"apparentTemperatureMinTime":1425650400,"apparentTemperatureMax":73.35,"apparentTemperatureMaxTime":1425682800,"dewPoint":43.82,"humidity":0.63,"windSpeed":3.5,"windBearing":346,"cloudCover":0,"pressure":1023.8,"ozone":320.7},{"time":1425715200,"summary":"Clear throughout the day.","icon":"clear-day","sunriseTime":1425738716,"sunsetTime":1425780487,"moonPhase":0.56,"precipIntensity":0,"precipIntensityMax":0,"precipProbability":0,"temperatureMin":46.46,"temperatureMinTime":1425736800,"temperatureMax":76.58,"temperatureMaxTime":1425769200,"apparentTemperatureMin":46.46,"apparentTemperatureMinTime":1425736800,"apparentTemperatureMax":76.58,"apparentTemperatureMaxTime":1425769200,"dewPoint":45.16,"humidity":0.63,"windSpeed":2.71,"windBearing":345,"cloudCover":0.02,"pressure":1022.63,"ozone":317.63},{"time":1425801600,"summary":"Mostly cloudy throughout the day.","icon":"partly-cloudy-day","sunriseTime":1425825029,"sunsetTime":1425866944,"moonPhase":0.59,"precipIntensity":0,"precipIntensityMax":0,"precipProbability":0,"temperatureMin":48.8,"temperatureMinTime":1425819600,"temperatureMax":77.71,"temperatureMaxTime":1425855600,"apparentTemperatureMin":48.8,"apparentTemperatureMinTime":1425819600,"apparentTemperatureMax":77.71,"apparentTemperatureMaxTime":1425855600,"dewPoint":47.27,"humidity":0.63,"windSpeed":2.42,"windBearing":343,"cloudCover":0.55,"pressure":1018.85,"ozone":318.28}]},"flags":{"sources":["nwspa","isd","nearest-precip","sref","fnmoc","rtma","rap","nam","cmc","gfs","madis","lamp","darksky"],"isd-stations":["724945-23293","724946-93232","724946-99999","745090-23244","999999-23293"],"madis-stations":["AS249","C2750","C4115","C7293","D2128","D2458","D8509","E1607","E3976","E4970","E5689","KRHV","KSJC","RJSC1","SJS01","UP626"],"lamp-stations":["KHWD","KLVK","KNUQ","KOAK","KPAO","KRHV","KSFO","KSJC","KSQL","KWVI"],"darksky-stations":["KMUX"],"units":"us"}
        }
      });


  },

    // city.save();
    // return this.store.find('city', params.city_id);


  setupController: function(controller, model) {
    $('body').removeClass().addClass('show-selected-city');
    // console.log(model.get('conditionClassname'));
    // console.log(City.conditionClassname);
    // updateSelectedCityBackground: function(city) {
    $('body').removeClass('is-cloudy').removeClass('is-night').removeClass('is-day').addClass(model.get('conditionClassname'));
    $('nav').removeClass('is-cloudy').removeClass('is-night').removeClass('is-day').addClass(model.get('conditionClassname'));

    // $('nav').removeClass('is-cloudy').removeClass('is-night').removeClass('is-day').addClass(this.conditionClassname(city.weatherData));
  // },
    controller.set('model', model);
              // .set('isNotEditing', true)
              // .set('isNotNew',     true);

  }
});

export default CityRoute;