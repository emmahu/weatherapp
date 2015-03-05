import Ember from 'ember';

var addController = Ember.ObjectController.extend({
  cityList: null,
  letter: '',
  displayMsg: 'Please type to find a city.',
  displayList: function() {
    var input = this.get('typeCity');
    if (input.length > 0) {
      if (input.length == 1) {
        this.set('displayMsg', 'Keep typing...');
        this.set('letter', '');
        this.set('cityList', null);
      } else {
        //get the auto input array
        var self = this;
        //reset to null for a new input
        this.set('cityList', null);
        $.ajax({
          url: 'http://coen268.peterbergstrom.com/timezones.php?search='+input,
          dataType: 'jsonp',
          jsonp: "callback",
          success: function(data) {
            if (data == null || data.length == 0) {
              self.set('displayMsg', 'No results found, try another city.');
            } else {
              self.createMap(data);
            }
          }
        });
      }
    } else {
      this.set('letter', '');
      this.set('cityList', null);
      this.set('displayMsg', 'Please type to find a city.');
    }
  }.observes('typeCity'),

  createMap: function(data) {
    var len = data.length;
    var map = new Object();
    for (var i=0; i<len; i++) {
      var firstLetter = data[i].cityName.charAt(0);
      if (!map.hasOwnProperty(firstLetter)) {
        map[firstLetter] = {
          firstLetter: firstLetter,
          dataList: [data[i]]
        };
      } else {
        map[firstLetter].dataList.pushObject(data[i]);
      }
    }
    var result = [];
    for (var m in map) {
      result.pushObject(map[m]);
    }
    this.set('cityList', result);
  },

  actions: {
    addCity: function (cityId) {
      //create a new city model
      var cityList = this.get('cityList');
      var cityArray = cityList.findBy('firstLetter', cityId.charAt(0).toUpperCase());
      var cityObject = cityArray.dataList.findBy('id', cityId);

      var curr = this.store.createRecord('city', {
        cityid: cityId,
        cityName: cityObject.cityName,
        timezoneName: cityObject.timezoneName,
        timezoneOffset: cityObject.timezoneOffset
      });
      curr.save();
      //reset to null
      this.set('cityList', null);
      this.set('typeCity', '');
      this.transitionToRoute('worldclock');
    },
    worldclock: function() {
      //reset to null
      this.set('cityList', null);
      this.set('typeCity', '');
      this.transitionTo('index');
    }
  }
});

export default addController;