import Ember from 'ember';
import City from 'weather/models/city';
import DataManager from 'weather/datamanager';

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
  // useUSUnits: Ember.computed.alias('config.useUSUnits'),
  // actions:{
  //   toggleUnits: function(){
  //     var useType = !this.get('useUSUnits');
  //     this.set('useUSUnits',useType);
  //     // console.log(config);
  //   }
  // },

  model: function(params) {
    return DataManager.findCity(params.city_id);
  },

  setupController: function(controller, model) {
    $('body').removeClass().addClass('show-selected-city');
    $('body').removeClass('is-cloudy').removeClass('is-night').removeClass('is-day').addClass(model.get('conditionClassname'));
    $('nav').removeClass('is-cloudy').removeClass('is-night').removeClass('is-day').addClass(model.get('conditionClassname'));
    controller.set('content', model);
  }
});

export default CityRoute;