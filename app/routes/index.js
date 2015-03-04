import Ember from 'ember';
import City from 'weather/models/city';
import DataManager from 'weather/datamanager';

var IndexRoute = Ember.Route.extend({


// need to add query

  // Query params are sort, order, filter, and filterValue
  // sync with the IndexController
  // queryParams: {
  //   sort: {
  //     refreshModel: true
  //   },
  //   order: {
  //     refreshModel: true
  //   },
  //   filter: {
  //     refreshModel: true
  //   },
  //   filterValue: {
  //     refreshModel: true
  //   }
  // },

  setupController: function(controller, model){
    // alert("good");
    $('body').removeClass().addClass('show-cities-list');
    controller.set('model', model);
  },

  model: function() {
    var cities = DataManager.get('LocalStorageModels');
    var promises = [];
    for (var i = 0 ; i < cities.length; ++i) {
      promises.push(DataManager.findCity(cities[i].get('id')));
    }
    return Ember.$.when.apply(Ember.$, promises).then(function(){
      return cities;
    });
  }
});


export default IndexRoute;
