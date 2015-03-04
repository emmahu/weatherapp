import Ember from 'ember';
import DataManager from "weather/datamanager";

var IndexController = Ember.ArrayController.extend({

  useUSUnits: Ember.computed.alias('dataManager.useUSUnits'),
  // useUSUnits: Ember.computed.alias('config.useUSUnits'),
  // datamanager: Ember.computed.alias('DataManager'),


  actions:{
    toggleUnits: function(){
      var useType = !this.get('useUSUnits');
      this.set('useUSUnits',useType);
    },
    startEditing: function() {
      this.set('isEditing', false);
    },
    delete: function(city) {
      this.get('dataManager').deleteCity(city);
    },
    addcity: function() {
      // this.transitionTo('addcity');
      this.transitionTo('add');
    }
  },

  isEditing: false,

  init: function(){
    this._super();
    this.set('dataManager', DataManager);
  }

});


export default IndexController;