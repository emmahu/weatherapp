import Ember from 'ember';
import config from "weather/appconfig";

var CityController = Ember.ObjectController.extend({
  actions:{
    toggleUnits: function(){
      var useType = !this.get('useUSUnits');
      this.set('useUSUnits',useType);
    }
  },


  useUSUnits: Ember.computed.alias('config.useUSUnits'),

// //   useUSUnitsDidChange: function() {
// //     // this.reload();
// //   }.observes('useUSUnits'),

  init: function(){
    this._super();
    this.set('config', config);
    // controller.set('useUSUnits',Ember.computed.alias('config.useUSUnits'));
  }

});

export default CityController;