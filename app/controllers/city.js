import Ember from 'ember';
import config from "weather/appconfig";

var CityController = Ember.ObjectController.extend({
  actions:{
    toggleUnits: function(){
      var useType = !this.get('useUSUnits');
      this.set('useUSUnits',useType);
      // console.log(this.get('useUSUnits'));
      // console.log(this.get('config').get('useUSUnits'));
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

// import Ember from 'ember';
// import config from "weather/config/environment";

// var CityController = Ember.ObjectController.extend({
//   useUSUnits: config.APP.useUSUnits,
//   actions:{
//     toggleUnits: function(){
//       config.APP.useUSUnits = !config.APP.useUSUnits;
//       this.set('useUSUnits', config.APP.useUSUnits);
//       console.log(config.APP.useUSUnits);
//     }
//   }

// });


export default CityController;