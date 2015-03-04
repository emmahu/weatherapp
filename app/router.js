import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('city', {path: 'city/:city_id'});
  this.route('add', {path: 'add'});
  this.route('edit', {path: 'edit'});
  // this.resource('attribution',{path:'http://forecast.io/'});
});

export default Router;
