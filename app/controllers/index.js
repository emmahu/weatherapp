import Ember from 'ember';
// import config from "weather/config/environment";
import config from "weather/appconfig";
// import DataManager from "weather/datamanager";

var IndexController = Ember.ArrayController.extend({
  // use: true,
  // useUSUnits: false,
  useUSUnits: Ember.computed.alias('config.useUSUnits'),
  // datamanager: Ember.computed.alias('DataManager'),
  // useUSUnits: false,
  // console.log(useUSUnits);

  actions:{
    toggleUnits: function(){
      var useType = !this.get('useUSUnits');
      this.set('useUSUnits',useType);
      // console.log(this.get('useUSUnits'));
      // console.log(this.get('config').get('useUSUnits'));
      // this.get('config').set('useUSUnits',useType);
      // this.get('dataManager').set('useUSUnits', useType);
    }
  },
  // useUSUnits: config.APP.useUSUnits,
  // actions:{
  //   toggleUnits: function(){
  //     config.APP.useUSUnits = !config.APP.useUSUnits;
  //     this.set('useUSUnits', config.APP.useUSUnits);
  //     console.log(config.APP.useUSUnits);
  //   }
  // }
  init: function(){
    this._super();
    this.set('config', config);
    // controller.set('useUSUnits',Ember.computed.alias('config.useUSUnits'));
  }

});


export default IndexController;