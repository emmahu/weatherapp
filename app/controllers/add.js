import Ember from 'ember';
import City from 'weather/models/city';
import DataManager from "weather/datamanager";

var addController = Ember.Controller.extend({
  cityList: null,
  letter: '',
  displayList: function() {
    var input = this.get('typeCity');
    if (input.length > 0) {
      if (input.length == 1) {
        this.set('letter', '');
        this.set('cityList', null);
      } else {
        //get the auto input array
        var self = this;
        //reset to null for a new input
        this.set('cityList', null);
        $.ajax({
          url: 'http://coen268.peterbergstrom.com/locationautocomplete.php?query='+input,
          dataType: 'jsonp',
          jsonp: "callback",
          success: function(data) {
            if (data == null || data.length == 0) {
            } else {
              self.set('cityList',data);
            }
          }
        });
      }
    } else {
      this.set('letter', '');
      this.set('cityList', null);
    }
  }.observes('typeCity'),


  actions: {
    addCity: function (cityId) {
      //create a new city model
      var cityList = this.get('cityList');
      var cityObject = cityList.findBy('id', cityId);
      console.log(cityId);

      var cur = City.create({
        id: cityId,
        name: cityObject.displayName,
        lat: cityObject.lat,
        lng: cityObject.lng,
        lastUpdated: -1,
        weatherData: null
      });
      DataManager.fetchDataForCity(cur);
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