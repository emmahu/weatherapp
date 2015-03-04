import Ember from 'ember';
var DataManager = Ember.Object.create({
  // Here you can pass flags/options to your application instance
      // when it is created
  weatherAPIBaseURL:   'https://api.forecast.io/forecast/',

  // The API key. Replace with your own.
  weatherAPIKey: 'e157d0906b1d14f719ca4d1ad2a05325',

  // The key for the current location self will be kept in the data. It is special so it is defined here.
  currentLocationKey: 'currentlocation',

  // The data is set to refresh every 10 minutes or 600,000 milliseconds.
  dataRefreshInterval: 600000,

  // The display time updates every 5 seconds or 5,000 milliseconds.
  timeUpdateInterval: 5000,

  // The id of the selected city self is shown in the details.
  selectedCityId: '',

  useUSUnits: true,

  // fmt: function(apiKey, lat, lng) {
  //   // var self = this;
  //   return apiKey + '/'+ lat + "," + lng + "?units=si";
  // },

  // // API interaction
  // fetchDataForCity: function(city) {
  //   var self = this;
  //   return Ember.$.ajax({
  //     url: self.get('weatherURLFormat').fmt(self.get('weatherAPIKey'), city.get('lat'), city.get('lng')),
  //     jsonp: 'callback',
  //     dataType: 'jsonp',
  //     success: function(weatherData) {
  //       city.set('weatherData', weatherData).set('lastUpdated', new Date().getTime());
  //       self.dataDidChange();
  //     }
  // },
  //   });

  // shouldRefreshCity: function(city) {
  //   return (city && (city.get('lastUpdated') === -1) || (new Date().getTime() > city.get('lastUpdated') + this.get('dataRefreshInterval')));
  // },


  // findCity: function(id) {
  //   var city = this.cityDataForId(id);
  //   if (this.shouldRefreshCity(city)) {
  //     return fetchDataForCity();
  //   } else {
  //     return city;
  //   }
  // }

});

export default DataManager;
