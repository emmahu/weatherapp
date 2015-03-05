import Ember from 'ember';
import DataManager from "weather/datamanager";

var IndexController = Ember.ArrayController.extend({

  useUSUnits: Ember.computed.alias('dataManager.useUSUnits'),
  actions:{
    toggleUnits: function(){
      var useType = !this.get('useUSUnits');
      this.set('useUSUnits',useType);
    },
    startEditing: function() {
      this.set('isEditing', false);
    },
    editCity: function() {
      var curr = this.get('isEditing');
      this.set('isEditing', !curr);
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