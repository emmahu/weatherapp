import Ember from 'ember';
import City from 'weather/models/city';
import DataManager from 'weather/datamanager';

var CityRoute = Ember.Route.extend({

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