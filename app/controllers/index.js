import Ember from 'ember';
// import config from "weather/config/environment";
// import config from "weather/appconfig";
import DataManager from "weather/datamanager";

var IndexController = Ember.ArrayController.extend({

  useUSUnits: Ember.computed.alias('dataManager.useUSUnits'),
  // useUSUnits: Ember.computed.alias('config.useUSUnits'),
  // datamanager: Ember.computed.alias('DataManager'),


  actions:{
    toggleUnits: function(){
      var useType = !this.get('useUSUnits');
      this.set('useUSUnits',useType);
    }
  },

  init: function(){
    this._super();
    this.set('dataManager', DataManager);
  }

});


export default IndexController;