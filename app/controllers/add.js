import Ember from 'ember';
import City from 'weather/models/city';
import DataManager from "weather/datamanager";

var addController = Ember.Controller.extend({
  cityList: null,
  letter: '',
  // displayMsg: 'Please type to find a city.',
  displayList: function() {
    var input = this.get('typeCity');
    if (input.length > 0) {
      if (input.length == 1) {
        // this.set('displayMsg', 'Keep typing...');
        this.set('letter', '');
        this.set('cityList', null);
      } else {
        //get the auto input array
        var self = this;
        //reset to null for a new input
        this.set('cityList', null);
        $.ajax({
          // url: 'http://coen268.peterbergstrom.com/timezones.php?search='+input,
          url: 'http://coen268.peterbergstrom.com/locationautocomplete.php?query='+input,
          dataType: 'jsonp',
          jsonp: "callback",
          success: function(data) {
            if (data == null || data.length == 0) {
              // self.set('displayMsg', 'No results found, try another city.');
            } else {
              self.set('cityList',data);
            }
          }
        });
      }
    } else {
      this.set('letter', '');
      this.set('cityList', null);
      // this.set('displayMsg', 'Please type to find a city.');
    }
  }.observes('typeCity'),


  actions: {
    addCity: function (cityId) {
      //create a new city model
      var cityList = this.get('cityList');
      var cityObject = cityList.findBy('id', cityId);

      var cur = City.create({
        id: cityObject.displayName.replace(/\s/g, '').toLowerCase(),
        name: cityObject.displayName,
        lat: cityObject.lat,
        lng: cityObject.lng,
        lastUpdated: -1,
        weatherData: null
      });
      // console.log(cur);
      // DataManager.fetchDataForCity(cur);
      var cities = DataManager.get('LocalStorageModels');
      cities.push(cur);
      DataManager.set('LocalStorageModels', cities);
      //reset to null
      this.set('cityList', null);
      this.set('typeCity', '');
      this.transitionToRoute('index');
    },
    back: function() {
      //reset to null
      this.set('cityList', null);
      this.set('typeCity', '');
      this.transitionTo('index');
    }
  }
});

export default addController;