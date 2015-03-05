import Ember from 'ember';
import City from 'weather/models/city';

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

  LocalStorageModels : [City.create({
      id: 'sanjose',
      name: 'San Jose',
      lat: 37.3382082,
      lng: -121.88632860000001,
      lastUpdated: -1,
      weatherData: null
    }), City.create({
      id: 'sydney',
      name: 'Sydney',
      lat: -33.8674869,
      lng: 151.20699020000006,
      lastUpdated: -1,
      weatherData: null
    })],

  ////////////////////////////////////////////////////////////////////////////////
  // Local Storage and Data Interaction
  ////////////////////////////////////////////////////////////////////////////////

  // Load from local storage.
  loadDataFromLocalStorage: function() {
    var self = DataManager;
    var localStorageCities = JSON.parse(localStorage.getItem("cities"));
    if(localStorageCities) {
      var cities = [];
      for(var i = 0; i < localStorageCities.length; i++) {
        cities.push(City.create(localStorageCities[i]));
        console.log(cities);
      }
      self.set('LocalStorageModels', cities);
    }
    self.useUSUnits = JSON.parse(localStorage.getItem("useUSUnits"));
    if(self.useUSUnits === null || self.useUSUnits === undefined) {
      self.useUSUnits = true;
    }
  },

  // Save back to local storage.
  syncLocalStorage: function() {
    var self = this,
        cities = self.LocalStorageModels,
        savedCities = [];
    for(var i = 0; i < cities.length; i++) {
      var city = cities[i];
      // savedCities.push(city.get('serializedProperties'));
      savedCities.push({
        id: city.get('id'),
        name: city.get('name'),
        lat: city.get('lat'),
        lng: city.get('lng'),
        lastUpdated: city.get('lastUpdated'),
        weatherData: city.get('weatherData')
      });
    }
    localStorage.setItem("cities", JSON.stringify(savedCities));
    localStorage.setItem("useUSUnits", JSON.stringify(self.useUSUnits));
  },

  dataDidChange: function() {
    this.syncLocalStorage();
  },

  deleteCity: function(city) {
    var self = this,
        cities = self.get('LocalStorageModels');
    for (var i = 0; i < cities.length; i++){
      var tmp = cities[i];
      // console.log(city);
      // console.log(tmp);
      // console.log(tmp.get('id'));
      if (tmp.get('id') === city) {
      // if (tmp.get('lat') === city.get('lat') && tmp.get('lng') === city.get('lng')){
        cities.removeObject(tmp);
        // console.log(cities);
        break;
      }
    }
    self.set('LocalStorageModels', cities);
    self.dataDidChange();
  },


  // API interaction
  fetchDataForCity: function(city) {
    var self = this;
    return Ember.$.ajax({
      url: self.get('weatherAPIBaseURL') + self.get('weatherAPIKey') + '/' + city.get('lat') + ', ' + city.get('lng') + "?units=si",
      jsonp: 'callback',
      dataType: 'jsonp',
      context: city
    }).done(function(weatherData) {
      this.set('weatherData', weatherData).set('lastUpdated', new Date().getTime());
      self.dataDidChange();
    }).then(function(){
      return this;
    });
  },

  shouldRefreshCity: function(city) {
    return (city && (city.get('lastUpdated') === -1) || (new Date().getTime() > city.get('lastUpdated') + this.get('dataRefreshInterval')));
  },

  findCity: function(id) {
    var city = this.cityDataForId(id);
    if (city && this.shouldRefreshCity(city)) {
      return this.fetchDataForCity(city);
    } else {
      return Ember.$.when(city);
    }
  },

  paginationInfo: function(id) {
    var cities = this.get('LocalStorageModels');
    var dots = new Array(cities.length);
    for(var i=0, iLen=cities.length; i<iLen; i++) {
      if(cities[i].get('id') === id) {
        dots[i] = true;
        return {
          showPagination: (iLen > 1),
          prevCityId: ((i == 0) ? null : cities[i-1].get('id')),
          nextCityId: ((i == iLen - 1) ? null : cities[i+1].get('id')),
          dots: dots
        };
      }
    }
    return null;
  },

  // Return for a given id, the city
  cityDataForId: function(id) {
    var cities = this.get('LocalStorageModels');
    var city = null;
    for(var i=0, iLen=cities.length; i<iLen; i++) {
      if(cities[i].get('id') === id) {
        city = cities[i];
        break;
      }
    }
    // console.log(city);
    return city;
  },

  refreshAllCitiesWeather: function() {
    var self = DataManager;
    var cities = self.get('LocalStorageModels');
    for(var i=0, iLen=cities.length; i<iLen; i++) {
      var city = cities[i];
      if (self.shouldRefreshCity(city)) {
        self.fetchDataForCity(city);
      }
    }
  },

  refreshAllCitiesTime: function() {
    var self = DataManager;
    var cities = self.get('LocalStorageModels');
    for(var i=0, iLen=cities.length; i<iLen; i++) {
      var city = cities[i];
      // This will trigger recalculation of sinceLastRefresh computed property.
      city.notifyPropertyChange('lastUpdated');
      // console.log(city.get('lastUpdated'));
    }

  }
});

DataManager.loadDataFromLocalStorage();

DataManager.addObserver('useUSUnits', function(){
  DataManager.syncLocalStorage();
});

var updateTimeTimer = function() {
  DataManager.refreshAllCitiesTime();
  Ember.run.later(DataManager, updateTimeTimer, DataManager.timeUpdateInterval);
};

updateTimeTimer();

var updateWeatherTimer = function() {
  DataManager.refreshAllCitiesWeather();
  Ember.run.later(DataManager, updateWeatherTimer, DataManager.dataRefreshInterval);
};

updateWeatherTimer();


export default DataManager;
