import Ember from 'ember';

var IndexController = Ember.ArrayController.extend({
  // The data is set to refresh every 10 minutes or 600,000 milliseconds.
  dataRefreshInterval: 600000,

  // The display time updates every 5 seconds or 5,000 milliseconds.
  timeUpdateInterval: 5000,

  // The id of the selected city self is shown in the details.
  selectedCityId: '',

  // These are backed by localStorage.
  // If true, we will render using US (non SI) units
  useUSUnits: true,



});


export default IndexController;