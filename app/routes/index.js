import Ember from 'ember';
import City from 'weather/models/city';
import DataManager from 'weather/datamanager';

var IndexRoute = Ember.Route.extend({

  model: function() {
    DataManager.syncLocalStorage();
    DataManager.loadDataFromLocalStorage();
    var cities = DataManager.get('LocalStorageModels');
    // console.log(cities);
    var promises = [];
    for (var i = 0 ; i < cities.length; ++i) {
      promises.push(DataManager.findCity(cities[i].get('id')));
      console.log(cities[i].get('id'));
    }
    return Ember.$.when.apply(Ember.$, promises).then(function(){
      return cities;
    });
  },

  setupController: function(controller, model){
    // alert("good");
    $('body').removeClass().addClass('show-cities-list');
    controller.set('model', model);
  }
});


export default IndexRoute;
