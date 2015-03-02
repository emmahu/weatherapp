/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'weather',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
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

      // These are backed by localStorage.
      // If true, we will render using US (non SI) units
      useUSUnits: false
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
