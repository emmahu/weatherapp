import Ember from 'ember';
// import config from "weather/appconfig";
import DataManager from 'weather/datamanager';

var CityController = Ember.ObjectController.extend({
  actions:{
    toggleUnits: function(){
      var useType = !this.get('useUSUnits');
      this.set('useUSUnits',useType);
    }
  },


  useUSUnits: Ember.computed.alias('dataManager.useUSUnits'),

  init: function(){
    this._super();
    this.set('dataManager', DataManager);
  }

});

export default CityController;