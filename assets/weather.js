/* jshint ignore:start */

/* jshint ignore:end */

define('weather/adapter/application', function () {

	'use strict';

	// import DS from'ember-data';

	// exportdefault DS.LSAdapter.extend({

	//   namespace: 'api/v1'

	// });

});
define('weather/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'weather/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('weather/controllers/add', ['exports', 'ember', 'weather/models/city', 'weather/datamanager'], function (exports, Ember, City, DataManager) {

  'use strict';

  var addController = Ember['default'].Controller.extend({
    cityList: null,
    letter: "",
    displayList: (function () {
      var input = this.get("typeCity");
      if (input.length > 0) {
        if (input.length == 1) {
          this.set("letter", "");
          this.set("cityList", null);
        } else {
          //get the auto input array
          var self = this;
          //reset to null for a new input
          this.set("cityList", null);
          $.ajax({
            url: "http://coen268.peterbergstrom.com/locationautocomplete.php?query=" + input,
            dataType: "jsonp",
            jsonp: "callback",
            success: function success(data) {
              if (data == null || data.length == 0) {} else {
                self.set("cityList", data);
              }
            }
          });
        }
      } else {
        this.set("letter", "");
        this.set("cityList", null);
      }
    }).observes("typeCity"),

    actions: {
      addCity: function addCity(cityId) {
        //create a new city model
        var cityList = this.get("cityList");
        var cityObject = cityList.findBy("id", cityId);
        console.log(cityId);

        var cur = City['default'].create({
          id: cityId,
          name: cityObject.displayName,
          lat: cityObject.lat,
          lng: cityObject.lng,
          lastUpdated: -1,
          weatherData: null
        });
        DataManager['default'].fetchDataForCity(cur);
        var cities = DataManager['default'].get("LocalStorageModels");
        cities.push(cur);
        DataManager['default'].set("LocalStorageModels", cities);
        //reset to null
        this.set("cityList", null);
        this.set("typeCity", "");
        this.transitionToRoute("index");
      },
      back: function back() {
        //reset to null
        this.set("cityList", null);
        this.set("typeCity", "");
        this.transitionTo("index");
      }
    }
  });

  exports['default'] = addController;

});
define('weather/controllers/city', ['exports', 'ember', 'weather/datamanager'], function (exports, Ember, DataManager) {

  'use strict';

  var CityController = Ember['default'].ObjectController.extend({
    actions: {
      toggleUnits: function toggleUnits() {
        var useType = !this.get("useUSUnits");
        this.set("useUSUnits", useType);
      }
    },

    useUSUnits: Ember['default'].computed.alias("dataManager.useUSUnits"),

    init: function init() {
      this._super();
      this.set("dataManager", DataManager['default']);
    }

  });

  exports['default'] = CityController;

});
define('weather/controllers/index', ['exports', 'ember', 'weather/datamanager'], function (exports, Ember, DataManager) {

  'use strict';

  var IndexController = Ember['default'].ArrayController.extend({

    useUSUnits: Ember['default'].computed.alias("dataManager.useUSUnits"),
    actions: {
      toggleUnits: function toggleUnits() {
        var useType = !this.get("useUSUnits");
        this.set("useUSUnits", useType);
      },
      startEditing: function startEditing() {
        this.set("isEditing", false);
      },
      editCity: function editCity() {
        var curr = this.get("isEditing");
        this.set("isEditing", !curr);
      },
      "delete": function (city) {
        this.get("dataManager").deleteCity(city);
      },
      addcity: function addcity() {
        // this.transitionTo('addcity');
        this.transitionTo("add");
      }
    },

    isEditing: false,

    init: function init() {
      this._super();
      this.set("dataManager", DataManager['default']);
    }

  });

  exports['default'] = IndexController;

});
define('weather/datamanager', ['exports', 'ember', 'weather/models/city'], function (exports, Ember, City) {

  'use strict';

  var DataManager = Ember['default'].Object.create({
    // Here you can pass flags/options to your application instance
    // when it is created
    weatherAPIBaseURL: "https://api.forecast.io/forecast/",

    // The API key. Replace with your own.
    weatherAPIKey: "e157d0906b1d14f719ca4d1ad2a05325",

    // The key for the current location self will be kept in the data. It is special so it is defined here.
    currentLocationKey: "currentlocation",

    // The data is set to refresh every 10 minutes or 600,000 milliseconds.
    dataRefreshInterval: 600000,

    // The display time updates every 5 seconds or 5,000 milliseconds.
    timeUpdateInterval: 5000,

    // The id of the selected city self is shown in the details.
    selectedCityId: "",

    useUSUnits: true,

    LocalStorageModels: [City['default'].create({
      id: "sanjose",
      name: "San Jose",
      lat: 37.3382082,
      lng: -121.88632860000001,
      lastUpdated: -1,
      weatherData: null
    }), City['default'].create({
      id: "sydney",
      name: "Sydney",
      lat: -33.8674869,
      lng: 151.20699020000006,
      lastUpdated: -1,
      weatherData: null
    })],

    ////////////////////////////////////////////////////////////////////////////////
    // Local Storage and Data Interaction
    ////////////////////////////////////////////////////////////////////////////////

    // Load from local storage.
    loadDataFromLocalStorage: function loadDataFromLocalStorage() {
      var self = DataManager;
      var localStorageCities = JSON.parse(localStorage.getItem("cities"));
      if (localStorageCities) {
        var cities = [];
        for (var i = 0; i < localStorageCities.length; i++) {
          cities.push(City['default'].create(localStorageCities[i]));
        }
        self.set("LocalStorageModels", cities);
      }
      self.useUSUnits = JSON.parse(localStorage.getItem("useUSUnits"));
      if (self.useUSUnits === null || self.useUSUnits === undefined) {
        self.useUSUnits = true;
      }
    },

    // Save back to local storage.
    syncLocalStorage: function syncLocalStorage() {
      var self = DataManager,
          cities = self.LocalStorageModels,
          savedCities = [];
      for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        savedCities.push({
          id: city.get("id"),
          name: city.get("name"),
          lat: city.get("lat"),
          lng: city.get("lng"),
          lastUpdated: city.get("lastUpdated"),
          weatherData: city.get("weatherData")
        });
      }
      localStorage.setItem("cities", JSON.stringify(savedCities));
      localStorage.setItem("useUSUnits", JSON.stringify(self.useUSUnits));
    },

    dataDidChange: function dataDidChange() {
      this.syncLocalStorage();
    },

    deleteCity: function deleteCity(city) {
      var self = this,
          cities = self.get("LocalStorageModels");
      for (var i = 0; i < cities.length; i++) {
        var tmp = cities[i];
        if (tmp.get("id") === city) {
          cities.removeObject(tmp);
          break;
        }
      }
      self.set("LocalStorageModels", cities);
      self.dataDidChange();
    },

    // API interaction
    fetchDataForCity: function fetchDataForCity(city) {
      var self = this;
      return Ember['default'].$.ajax({
        url: self.get("weatherAPIBaseURL") + self.get("weatherAPIKey") + "/" + city.get("lat") + ", " + city.get("lng") + "?units=si",
        jsonp: "callback",
        dataType: "jsonp" }).done(function (weatherData) {
        city.set("weatherData", weatherData).set("lastUpdated", new Date().getTime());
        self.dataDidChange();
      }).then(function () {
        return this;
      });
    },

    shouldRefreshCity: function shouldRefreshCity(city) {
      return city && city.get("lastUpdated") === -1 || new Date().getTime() > city.get("lastUpdated") + this.get("dataRefreshInterval");
    },

    findCity: function findCity(id) {
      var city = this.cityDataForId(id);
      if (city && this.shouldRefreshCity(city)) {
        return this.fetchDataForCity(city);
      } else {
        return Ember['default'].$.when(city);
      }
    },

    paginationInfo: function paginationInfo(id) {
      var cities = this.get("LocalStorageModels");
      var dots = new Array(cities.length);
      for (var i = 0, iLen = cities.length; i < iLen; i++) {
        if (cities[i].get("id") === id) {
          dots[i] = true;
          return {
            showPagination: iLen > 1,
            prevCityId: i === 0 ? null : cities[i - 1].get("id"),
            nextCityId: i === iLen - 1 ? null : cities[i + 1].get("id"),
            dots: dots
          };
        }
      }
      return null;
    },

    // Return for a given id, the city
    cityDataForId: function cityDataForId(id) {
      var cities = this.get("LocalStorageModels");
      // var city = null;
      for (var i = 0, iLen = cities.length; i < iLen; i++) {
        if (cities[i].get("id") === id) {
          return cities[i];
        }
      }
      return null;
    },

    refreshAllCitiesWeather: function refreshAllCitiesWeather() {
      var self = DataManager;
      var cities = self.get("LocalStorageModels");
      for (var i = 0, iLen = cities.length; i < iLen; i++) {
        var city = cities[i];
        if (self.shouldRefreshCity(city)) {
          self.fetchDataForCity(city);
        }
      }
    },

    refreshAllCitiesTime: function refreshAllCitiesTime() {
      var self = DataManager;
      var cities = self.get("LocalStorageModels");
      for (var i = 0, iLen = cities.length; i < iLen; i++) {
        var city = cities[i];
        // This will trigger recalculation of sinceLastRefresh computed property.
        city.notifyPropertyChange("lastUpdated");
      }
    },
    ////////////////////////////////////////////////////////////////////////////////
    // Current Location Handling
    ////////////////////////////////////////////////////////////////////////////////

    // If current location is updated, then add the current location to the
    // cities array if needed at the top of the list.
    currentLocationWasUpdated: function currentLocationWasUpdated(position) {
      var self = DataManager;
      var city = self.cityDataForId(self.currentLocationKey),
          shouldPush = false;

      // If the current location does not exist in the cities array,
      // create a new city.
      if (!city) {
        city = City['default'].create({
          id: self.currentLocationKey,
          name: "Current Location",
          lastUpdated: -1,
          weatherData: null
        });
        shouldPush = true;
      }

      // Either way, set the location information.
      city.set("lat", position.coords.latitude);
      city.set("lng", position.coords.longitude);

      // Only push onto the array if it does not exist already.
      if (shouldPush) {
        self.get("LocalStorageModels").unshift(city);
        self.fetchDataForCity(city);
      }
    },

    // If current location is denied, then just remove it from the list.
    currentLocationWasDenied: function currentLocationWasDenied() {
      var self = DataManager;
      var cities = self.get("LocalStorageModels"),
          city = self.cityDataForId(self.currentLocationKey);
      if (city) {
        console.log("call here");
        cities.splice(cities.indexOf(city), 1);
      }
      // self.syncLocalStorage();
    }

  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(DataManager.currentLocationWasUpdated, DataManager.currentLocationWasDenied);
  }

  DataManager.loadDataFromLocalStorage();

  DataManager.addObserver("useUSUnits", function () {
    DataManager.syncLocalStorage();
  });

  var updateTimeTimer = (function (_updateTimeTimer) {
    var _updateTimeTimerWrapper = function updateTimeTimer() {
      return _updateTimeTimer.apply(this, arguments);
    };

    _updateTimeTimerWrapper.toString = function () {
      return _updateTimeTimer.toString();
    };

    return _updateTimeTimerWrapper;
  })(function () {
    DataManager.refreshAllCitiesTime();
    Ember['default'].run.later(DataManager, updateTimeTimer, DataManager.timeUpdateInterval);
  });

  updateTimeTimer();

  var updateWeatherTimer = (function (_updateWeatherTimer) {
    var _updateWeatherTimerWrapper = function updateWeatherTimer() {
      return _updateWeatherTimer.apply(this, arguments);
    };

    _updateWeatherTimerWrapper.toString = function () {
      return _updateWeatherTimer.toString();
    };

    return _updateWeatherTimerWrapper;
  })(function () {
    DataManager.refreshAllCitiesWeather();
    Ember['default'].run.later(DataManager, updateWeatherTimer, DataManager.dataRefreshInterval);
  });

  updateWeatherTimer();

  exports['default'] = DataManager;

  // context: city

});
define('weather/helpers/format-percentage', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (value, options) {
    return Math.round(value * 100) + "%";
  });

});
define('weather/helpers/format-precipitation', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (value, options) {

    var precipitation = value,
        useUSUnits = options.hash.unitParam;
    if (precipitation === 0) {
      return "--";
    }

    // If using US units, convert from mm to inches.
    var amount = useUSUnits ? (precipitation * 0.0393701).toFixed(2) : precipitation;

    return amount + (useUSUnits ? " in" : " mm");
  });

});
define('weather/helpers/format-pressurefromhpa', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (value, options) {
    var pressure = value,
        useUSUnits = options.hash.unitParam;
    // If using US units, convert to inches.
    if (useUSUnits) {
      return (pressure * 0.000295299830714 * 100).toFixed(2) + " in";
    }

    return pressure.toFixed(2) + " hPa";
  });

});
define('weather/helpers/format-temperature', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (value, options) {
    // var useUSUnits = options.hash['unitParam'] || config.useUSUnits;
    var useUSUnits = options.hash.unitParam;
    return Math.round(useUSUnits ? value * 9 / 5 + 32 : value) + "˚";
  });

});
define('weather/helpers/format-time', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (value, options) {
    // var date = this.get('localDate'),
    var date = value,

    // showMinutes = true,
    showMinutes = options.hash.showMinutes,
        hours = date.getHours(),
        meridian = "AM";

    if (hours >= 12) {
      if (hours > 12) {
        hours -= 12;
      }
      meridian = "PM";
    }

    if (hours == 0) {
      hours = 12;
    }

    if (showMinutes) {
      var minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      return hours + ":" + minutes + " " + meridian;
    }
    return hours + " " + meridian;
  });

});
define('weather/helpers/format-visibility', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (value, options) {
        // formatVisibilty: function() {
        var visibility = value;

        // If using US units, convert to miles.
        var useUSUnits = options.hash.unitParam,
            distance = (useUSUnits ? visibility * 0.621371 : visibility).toFixed(1);

        return distance + (useUSUnits ? " mi" : " km");
    });

});
define('weather/helpers/format-wind', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (value, options) {
        var conditions = value,
            useUSUnits = options.hash.unitParam,
            formatBearing = options.hash.formatBearing,
            speed = (useUSUnits ? conditions.windSpeed * 0.621371 : conditions.windSpeed).toFixed(1);
        return speed + (useUSUnits ? " mph" : " kph") + " " + formatBearing;
        // return speed + (useUSUnits ? ' mph' : ' kph') + ' ' + this.get('formatBearing');
    });

});
define('weather/helpers/local-date', ['exports', 'ember', 'weather/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (value, options) {
    var time = value;
    var timezoneOffset = options.hash.offset;
    var timeOffsetSinceLastRefresh = options.hash.since;
    // var time = this.get('weatherData').currently.time,
    // timezoneOffset = this.get('weatherData').offset,
    // timeOffsetSinceLastRefresh = new Date().getTime() - this.get('lastUpdated');
    timeOffsetSinceLastRefresh = timeOffsetSinceLastRefresh ? timeOffsetSinceLastRefresh : 0;
    var date = new Date(time * 1000 + timeOffsetSinceLastRefresh);
    var utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());

    utc.setHours(utc.getHours() + timezoneOffset);
    return utc;
  });

});
define('weather/helpers/week-day', ['exports', 'ember', 'weather/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (value, options) {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][value.getDay()];
  });

});
define('weather/initializers/app-version', ['exports', 'weather/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('weather/initializers/export-application-global', ['exports', 'ember', 'weather/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('weather/models/city', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var City = Ember['default'].Object.extend({
    id: "sanjose",
    name: "sanjose",
    lat: 0,
    lng: 0,
    lastUpdated: -1,
    weatherData: null,

    localDate: (function () {
      var time = this.get("weatherData").currently.time,
          timezoneOffset = this.get("weatherData").offset,
          timeOffsetSinceLastRefresh = new Date().getTime() - this.get("lastUpdated");
      timeOffsetSinceLastRefresh = timeOffsetSinceLastRefresh ? timeOffsetSinceLastRefresh : 0;
      var date = new Date(time * 1000 + timeOffsetSinceLastRefresh);
      var utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());

      utc.setHours(utc.getHours() + timezoneOffset);
      return utc;
    }).property("weatherData", "lastUpdated"),

    hourly: (function () {
      return this.get("weatherData.hourly.data.0");
    }).property("weatherData"),

    daily: (function () {
      return this.get("weatherData.daily.data.0");
    }).property("weatherData"),

    conditionClassname: (function () {
      var classNames = "",
          data = this.get("weatherData");

      if (data) {
        var conditionsNow = data.hourly.data[0],
            date = new Date(conditionsNow.time * 1000);

        // It is day if you're between sunrise and sunset. Then add the is-day class. Otherwise, add is-night
        if (conditionsNow.time >= data.daily.data[0].sunriseTime && conditionsNow.time <= data.daily.data[0].sunsetTime) {
          classNames += "is-day ";
        } else {
          classNames += "is-night ";
        }

        // If the icon name includes cloudy OR there is a cloudCover above 0.2, make it cloudy.
        // The 0.2 is completely arbitary.
        if (conditionsNow.icon.indexOf("cloudy") !== -1 || conditionsNow.cloudCover > 0.2) {
          classNames += "is-cloudy ";
        }
      }
      return classNames;
    }).property("weatherData"),

    summary: (function () {
      return this.get("weatherData.hourly.data.0.summary");
    }).property("weatherData"),

    relativeDate: (function () {
      var localDate = this.get("localDate"),
          diff = Math.round((localDate.getTime() - new Date().getTime()) / (24 * 3600 * 1000)),
          relativeDate = "Today";
      if (diff < 0) {
        relativeDate = "Yesterday";
      } else if (diff > 0) {
        relativeDate = "Tomorrow";
      }
      return relativeDate;
    }).property("localDate"),

    hourlyListWidth: (function () {
      return "width: " + Math.min(this.get("weatherData.hourly.data").length, 24) * 64 + "px;";
    }).property("weatherData"),

    hourlyData: (function () {
      var data = this.get("weatherData.hourly.data");
      var newData = [];
      for (var i = 0; i < Math.min(data.length, 24); ++i) {
        var d = data[i];
        newData.push({
          first: i === 0,
          icon: "images/" + d.icon + ".png",
          temperature: d.temperature,
          time: d.time
        });
      }
      return newData;
    }).property("weatherData"),

    dailyData: (function () {
      var data = this.get("weatherData.daily.data");
      var newData = [];
      for (var i = 0; i < Math.min(data.length, 24); ++i) {
        var d = data[i];
        newData.push({
          icon: "images/" + d.icon + ".png",
          temperatureMax: d.temperatureMax,
          temperatureMin: d.temperatureMin,
          time: d.time
        });
      }
      return newData;
    }).property("weatherData"),

    precipType: (function () {
      return this.get("hourly.precipType") === "snow" ? "Chance of Snow:" : "Chance of Rain:";
    }).property("hourly"),

    formatBearing: (function () {
      // From: http://stackoverflow.com/questions/3209899/determine-compass-direction-from-one-lat-lon-to-the-other
      var bearings = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"],
          conditions = this.get("hourly"),
          brng = conditions.windBearing,
          index = brng - 22.5;

      if (index < 0) {
        index += 360;
      }
      index = parseInt(index / 45);

      return bearings[index];
    }).property("hourly"),

    sinceLastRefresh: (function () {
      return new Date().getTime() - this.get("lastUpdated");
    }).property("lastUpdated"),

    isCurLocation: (function () {
      return this.get("id") === "currentlocation";
    }).property("id")

  });

  exports['default'] = City;

});
define('weather/router', ['exports', 'ember', 'weather/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.resource("city", { path: "city/:city_id" });
    this.route("add", { path: "add" });
    this.route("edit", { path: "edit" });
    // this.resource('attribution',{path:'http://forecast.io/'});
  });

  exports['default'] = Router;

});
define('weather/routes/city', ['exports', 'ember', 'weather/models/city', 'weather/datamanager'], function (exports, Ember, City, DataManager) {

  'use strict';

  var CityRoute = Ember['default'].Route.extend({

    model: function model(params) {
      return DataManager['default'].findCity(params.city_id);
    },

    setupController: function setupController(controller, model) {
      $("body").removeClass().addClass("show-selected-city");
      $("body").removeClass("is-cloudy").removeClass("is-night").removeClass("is-day").addClass(model.get("conditionClassname"));
      $("nav").removeClass("is-cloudy").removeClass("is-night").removeClass("is-day").addClass(model.get("conditionClassname"));
      controller.set("content", model).set("pagination", DataManager['default'].paginationInfo(model.get("id")));
    }
  });

  exports['default'] = CityRoute;

});
define('weather/routes/edit', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var EditRoute = Ember['default'].Route.extend({});

	exports['default'] = EditRoute;

});
define('weather/routes/index', ['exports', 'ember', 'weather/models/city', 'weather/datamanager'], function (exports, Ember, City, DataManager) {

  'use strict';

  var IndexRoute = Ember['default'].Route.extend({

    model: function model() {
      var cities = DataManager['default'].get("LocalStorageModels");
      var promises = [];
      for (var i = 0; i < cities.length; ++i) {
        promises.push(DataManager['default'].findCity(cities[i].get("id")));
        // console.log(cities[i].get('id'));
      }
      return Ember['default'].$.when.apply(Ember['default'].$, promises).then(function () {
        return cities;
      });
    },

    setupController: function setupController(controller, model) {
      $("body").removeClass().addClass("show-cities-list");
      controller.set("model", model);
    }
  });

  exports['default'] = IndexRoute;

});
define('weather/templates/add', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"class","subList");
            var el2 = dom.createElement("div");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1]);
            var morph0 = dom.createMorphAt(dom.childAt(element0, [0]),-1,-1);
            element(env, element0, context, "action", ["addCity", get(env, context, "city.id")], {});
            content(env, morph0, context, "city.formatted_address");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          block(env, morph0, context, "each", [get(env, context, "cityList")], {"keyword": "city"}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("header");
        dom.setAttribute(el1,"id","cityList");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","listTile");
        var el3 = dom.createTextNode("\n  Enter city, zip code, or airport location.\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"id","cancel");
        var el3 = dom.createTextNode("Cancel");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1,"class","listBody");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [4]);
        var morph0 = dom.createMorphAt(element1,2,3);
        var morph1 = dom.createMorphAt(dom.childAt(fragment, [2]),0,-1);
        inline(env, morph0, context, "input", [], {"id": "listInput", "type": "text", "value": get(env, context, "typeCity")});
        element(env, element2, context, "action", ["back"], {});
        block(env, morph1, context, "if", [get(env, context, "cityList")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('weather/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
        var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('weather/templates/city', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createTextNode("                  Now\n");
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                  ");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, subexpr = hooks.subexpr, inline = hooks.inline;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
              inline(env, morph0, context, "format-time", [subexpr(env, context, "local-date", [get(env, context, "forecast.time")], {"offset": get(env, context, "weatherData.offset")})], {"showMinutes": false});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("ul");
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("li");
            var el4 = dom.createTextNode("\n");
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("              ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("li");
            var el4 = dom.createTextNode("\n                ");
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("img");
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n              ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("li");
            var el4 = dom.createTextNode("\n                ");
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n              ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element6 = dom.childAt(fragment, [1, 1]);
            var element7 = dom.childAt(element6, [3, 1]);
            var morph0 = dom.createMorphAt(dom.childAt(element6, [1]),0,1);
            var morph1 = dom.createMorphAt(dom.childAt(element6, [5]),0,1);
            block(env, morph0, context, "if", [get(env, context, "forecast.first")], {}, child0, child1);
            element(env, element7, context, "bind-attr", [], {"src": get(env, context, "forecast.icon")});
            inline(env, morph1, context, "format-temperature", [get(env, context, "forecast.temperature")], {"unitParam": get(env, context, "usUnitAlias")});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          set(env, context, "usUnitAlias", blockArguments[0]);
          block(env, morph0, context, "each", [get(env, context, "hourlyData")], {"keyword": "forecast"}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("ul");
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("li");
            var el4 = dom.createTextNode("\n                ");
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n              ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("li");
            var el4 = dom.createTextNode("\n                ");
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("img");
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n              ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("li");
            var el4 = dom.createTextNode("\n                ");
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n              ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("li");
            var el4 = dom.createTextNode("\n                ");
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n              ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, subexpr = hooks.subexpr, inline = hooks.inline, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element4 = dom.childAt(fragment, [1, 1]);
            var element5 = dom.childAt(element4, [3, 1]);
            var morph0 = dom.createMorphAt(dom.childAt(element4, [1]),0,1);
            var morph1 = dom.createMorphAt(dom.childAt(element4, [5]),0,1);
            var morph2 = dom.createMorphAt(dom.childAt(element4, [7]),0,1);
            inline(env, morph0, context, "week-day", [subexpr(env, context, "local-date", [get(env, context, "forecast.time")], {"offset": get(env, context, "weatherData.offset")})], {});
            element(env, element5, context, "bind-attr", [], {"src": get(env, context, "forecast.icon")});
            inline(env, morph1, context, "format-temperature", [get(env, context, "forecast.temperatureMax")], {"unitParam": get(env, context, "usUnitAlias")});
            inline(env, morph2, context, "format-temperature", [get(env, context, "forecast.temperatureMin")], {"unitParam": get(env, context, "usUnitAlias")});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          set(env, context, "usUnitAlias", blockArguments[0]);
          block(env, morph0, context, "each", [get(env, context, "dailyData")], {"keyword": "forecast"}, child0, null);
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createTextNode("◀");
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "link-to", ["city", get(env, context, "pagination.prevCityId")], {}, child0, null);
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createTextNode("◀");
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "link-to", ["city", get(env, context, "id")], {}, child0, null);
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            var el2 = dom.createTextNode("\n            •\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1]);
            element(env, element0, context, "bind-attr", [], {"class": ":dot dot:current"});
            return fragment;
          }
        };
      }());
      var child3 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createTextNode("▶");
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "link-to", ["city", get(env, context, "pagination.nextCityId")], {}, child0, null);
            return fragment;
          }
        };
      }());
      var child4 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createTextNode("▶");
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "link-to", ["city", get(env, context, "id")], {}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","next-prev-nav");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","indicator-dots");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1]);
          var element2 = dom.childAt(element1, [1]);
          var element3 = dom.childAt(element1, [5]);
          var morph0 = dom.createMorphAt(element2,0,1);
          var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),0,1);
          var morph2 = dom.createMorphAt(element3,0,1);
          element(env, element2, context, "bind-attr", [], {"class": ":prev-button pagination.prevCityId::disabled"});
          block(env, morph0, context, "if", [get(env, context, "pagination.prevCityId")], {}, child0, child1);
          block(env, morph1, context, "each", [get(env, context, "pagination.dots")], {"keyword": "dot"}, child2, null);
          element(env, element3, context, "bind-attr", [], {"class": ":next-button pagination.nextCityId::disabled"});
          block(env, morph2, context, "if", [get(env, context, "pagination.nextCityId")], {}, child3, child4);
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("☰");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","selected-city");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","city-header");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h2");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h4");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","today");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","today-overview");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","today-hourly-list-container");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","today-hourly-list");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","forecast");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","forecast-list");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("section");
        dom.setAttribute(el2,"id","today-details");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        dom.setAttribute(el3,"class","today-summary");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","today-details-list");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            Sunrise:\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            Sunset:\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            Humidity:\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            Wind:\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            Feels like:\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            Precipitation:\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            Pressure:\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            Visibility:\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("li");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("nav");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","celsius");
        var el6 = dom.createTextNode("˚C");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n         ⁄\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","fahrenheit");
        var el6 = dom.createTextNode("˚F");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","list-button");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, inline = hooks.inline, element = hooks.element, block = hooks.block, subexpr = hooks.subexpr;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element8 = dom.childAt(fragment, [0]);
        var element9 = dom.childAt(element8, [1]);
        var element10 = dom.childAt(element8, [3]);
        var element11 = dom.childAt(element10, [1]);
        var element12 = dom.childAt(element10, [3, 1]);
        var element13 = dom.childAt(element8, [7]);
        var element14 = dom.childAt(element13, [3]);
        var element15 = dom.childAt(element14, [7, 1]);
        var element16 = dom.childAt(fragment, [2]);
        var element17 = dom.childAt(element16, [1]);
        var element18 = dom.childAt(element17, [1]);
        var element19 = dom.childAt(element18, [1]);
        var morph0 = dom.createMorphAt(dom.childAt(element9, [1]),-1,-1);
        var morph1 = dom.createMorphAt(dom.childAt(element9, [3]),-1,-1);
        var morph2 = dom.createMorphAt(dom.childAt(element9, [5]),-1,-1);
        var morph3 = dom.createMorphAt(dom.childAt(element11, [1]),0,1);
        var morph4 = dom.createMorphAt(dom.childAt(element11, [3]),0,1);
        var morph5 = dom.createMorphAt(dom.childAt(element11, [5]),0,1);
        var morph6 = dom.createMorphAt(dom.childAt(element11, [7]),0,1);
        var morph7 = dom.createMorphAt(element12,0,1);
        var morph8 = dom.createMorphAt(dom.childAt(element8, [5, 1]),0,1);
        var morph9 = dom.createMorphAt(dom.childAt(element13, [1]),0,1);
        var morph10 = dom.createMorphAt(dom.childAt(element14, [1, 1, 3]),0,1);
        var morph11 = dom.createMorphAt(dom.childAt(element14, [3, 1, 3]),0,1);
        var morph12 = dom.createMorphAt(dom.childAt(element15, [1]),0,1);
        var morph13 = dom.createMorphAt(dom.childAt(element15, [3]),0,1);
        var morph14 = dom.createMorphAt(dom.childAt(element14, [9, 1, 3]),0,1);
        var morph15 = dom.createMorphAt(dom.childAt(element14, [13, 1, 3]),0,1);
        var morph16 = dom.createMorphAt(dom.childAt(element14, [15, 1, 3]),0,1);
        var morph17 = dom.createMorphAt(dom.childAt(element14, [19, 1, 3]),0,1);
        var morph18 = dom.createMorphAt(dom.childAt(element14, [21, 1, 3]),0,1);
        var morph19 = dom.createMorphAt(dom.childAt(element14, [25, 1, 3]),0,1);
        var morph20 = dom.createMorphAt(element17,2,3);
        var morph21 = dom.createMorphAt(dom.childAt(element17, [4]),0,1);
        content(env, morph0, context, "name");
        content(env, morph1, context, "summary");
        inline(env, morph2, context, "format-temperature", [get(env, context, "hourly.temperature")], {"unitParam": get(env, context, "useUSUnits")});
        inline(env, morph3, context, "week-day", [get(env, context, "localDate")], {});
        content(env, morph4, context, "relativeDate");
        inline(env, morph5, context, "format-temperature", [get(env, context, "daily.temperatureMax")], {"unitParam": get(env, context, "useUSUnits")});
        inline(env, morph6, context, "format-temperature", [get(env, context, "daily.temperatureMin")], {"unitParam": get(env, context, "useUSUnits")});
        element(env, element12, context, "bind-attr", [], {"style": get(env, context, "hourlyListWidth")});
        block(env, morph7, context, "with", [get(env, context, "useUSUnits")], {}, child0, null);
        block(env, morph8, context, "with", [get(env, context, "useUSUnits")], {}, child1, null);
        content(env, morph9, context, "weatherData.daily.summary");
        inline(env, morph10, context, "format-time", [subexpr(env, context, "local-date", [get(env, context, "daily.sunriseTime")], {"offset": get(env, context, "weatherData.offset")})], {"showMinutes": true});
        inline(env, morph11, context, "format-time", [subexpr(env, context, "local-date", [get(env, context, "daily.sunsetTime")], {"offset": get(env, context, "weatherData.offset")})], {"showMinutes": true});
        content(env, morph12, context, "precipType");
        inline(env, morph13, context, "format-percentage", [get(env, context, "hourly.precipProbability")], {});
        inline(env, morph14, context, "format-percentage", [get(env, context, "hourly.humidity")], {});
        inline(env, morph15, context, "format-wind", [get(env, context, "hourly")], {"unitParam": get(env, context, "useUSUnits"), "formatBearing": get(env, context, "formatBearing")});
        inline(env, morph16, context, "format-temperature", [get(env, context, "hourly.apparentTemperature")], {"unitParam": get(env, context, "useUSUnits")});
        inline(env, morph17, context, "format-precipitation", [get(env, context, "hourly.precipIntensity")], {"unitParam": get(env, context, "useUSUnits")});
        inline(env, morph18, context, "format-pressurefromhpa", [get(env, context, "hourly.pressure")], {"unitParam": get(env, context, "useUSUnits")});
        inline(env, morph19, context, "format-visibility", [get(env, context, "hourly.visibility")], {"unitParam": get(env, context, "useUSUnits")});
        element(env, element16, context, "bind-attr", [], {"class": get(env, context, "conditionClassname")});
        element(env, element18, context, "bind-attr", [], {"class": ":celsius-or-fahrenheit useUSUnits:use-fahrenheit:use-celsius"});
        element(env, element19, context, "action", ["toggleUnits"], {});
        block(env, morph20, context, "if", [get(env, context, "pagination.showPagination")], {}, child2, null);
        block(env, morph21, context, "link-to", ["index"], {}, child3, null);
        return fragment;
      }
    };
  }()));

});
define('weather/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          var child0 = (function() {
            return {
              isHTMLBars: true,
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("        ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("ul");
                var el2 = dom.createTextNode("\n          ");
                dom.appendChild(el1, el2);
                var el2 = dom.createElement("li");
                dom.setAttribute(el2,"class","city-info");
                var el3 = dom.createTextNode("\n          ");
                dom.appendChild(el2, el3);
                var el3 = dom.createElement("div");
                dom.setAttribute(el3,"class","noncircle");
                var el4 = dom.createTextNode("\n             ");
                dom.appendChild(el3, el4);
                var el4 = dom.createElement("div");
                dom.setAttribute(el4,"id","dash");
                dom.appendChild(el3, el4);
                var el4 = dom.createTextNode("\n            ");
                dom.appendChild(el3, el4);
                dom.appendChild(el2, el3);
                var el3 = dom.createTextNode("\n            ");
                dom.appendChild(el2, el3);
                var el3 = dom.createElement("div");
                dom.setAttribute(el3,"class","time");
                var el4 = dom.createTextNode("\n              ");
                dom.appendChild(el3, el4);
                var el4 = dom.createTextNode("\n            ");
                dom.appendChild(el3, el4);
                dom.appendChild(el2, el3);
                var el3 = dom.createTextNode("\n            ");
                dom.appendChild(el2, el3);
                var el3 = dom.createElement("div");
                dom.setAttribute(el3,"class","city-name");
                var el4 = dom.createTextNode("\n              ");
                dom.appendChild(el3, el4);
                var el4 = dom.createTextNode("\n            ");
                dom.appendChild(el3, el4);
                dom.appendChild(el2, el3);
                var el3 = dom.createTextNode("\n          ");
                dom.appendChild(el2, el3);
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("\n          ");
                dom.appendChild(el1, el2);
                var el2 = dom.createElement("li");
                dom.setAttribute(el2,"class","temperature");
                var el3 = dom.createTextNode("\n            ");
                dom.appendChild(el2, el3);
                var el3 = dom.createTextNode("\n          ");
                dom.appendChild(el2, el3);
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("\n        ");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, get = hooks.get, element = hooks.element, subexpr = hooks.subexpr, inline = hooks.inline, content = hooks.content;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var element5 = dom.childAt(fragment, [1]);
                var element6 = dom.childAt(element5, [1]);
                var element7 = dom.childAt(element6, [1]);
                var morph0 = dom.createMorphAt(dom.childAt(element6, [3]),0,1);
                var morph1 = dom.createMorphAt(dom.childAt(element6, [5]),0,1);
                var morph2 = dom.createMorphAt(dom.childAt(element5, [3]),0,1);
                element(env, element7, context, "action", ["delete", get(env, context, "id")], {});
                inline(env, morph0, context, "format-time", [subexpr(env, context, "local-date", [get(env, context, "weatherData.currently.time")], {"offset": get(env, context, "weatherData.offset"), "since": get(env, context, "sinceLastRefresh")})], {"showMinutes": true});
                content(env, morph1, context, "name");
                inline(env, morph2, context, "format-temperature", [get(env, context, "hourly.temperature")], {"unitParam": get(env, context, "usUnitAlias")});
                return fragment;
              }
            };
          }());
          var child1 = (function() {
            return {
              isHTMLBars: true,
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("        ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("ul");
                var el2 = dom.createTextNode("\n          ");
                dom.appendChild(el1, el2);
                var el2 = dom.createElement("li");
                dom.setAttribute(el2,"class","city-info");
                var el3 = dom.createTextNode("\n            ");
                dom.appendChild(el2, el3);
                var el3 = dom.createElement("div");
                var el4 = dom.createTextNode("\n             ");
                dom.appendChild(el3, el4);
                var el4 = dom.createElement("div");
                dom.setAttribute(el4,"id","dash");
                dom.appendChild(el3, el4);
                var el4 = dom.createTextNode("\n            ");
                dom.appendChild(el3, el4);
                dom.appendChild(el2, el3);
                var el3 = dom.createTextNode("\n            ");
                dom.appendChild(el2, el3);
                var el3 = dom.createElement("div");
                var el4 = dom.createTextNode("\n              ");
                dom.appendChild(el3, el4);
                var el4 = dom.createTextNode("\n            ");
                dom.appendChild(el3, el4);
                dom.appendChild(el2, el3);
                var el3 = dom.createTextNode("\n            ");
                dom.appendChild(el2, el3);
                var el3 = dom.createElement("div");
                var el4 = dom.createTextNode("\n              ");
                dom.appendChild(el3, el4);
                var el4 = dom.createTextNode("\n            ");
                dom.appendChild(el3, el4);
                dom.appendChild(el2, el3);
                var el3 = dom.createTextNode("\n          ");
                dom.appendChild(el2, el3);
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("\n          ");
                dom.appendChild(el1, el2);
                var el2 = dom.createElement("li");
                dom.setAttribute(el2,"class","temperature");
                var el3 = dom.createTextNode("\n            ");
                dom.appendChild(el2, el3);
                var el3 = dom.createTextNode("\n          ");
                dom.appendChild(el2, el3);
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("\n        ");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, get = hooks.get, element = hooks.element, subexpr = hooks.subexpr, inline = hooks.inline, content = hooks.content;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var element0 = dom.childAt(fragment, [1]);
                var element1 = dom.childAt(element0, [1]);
                var element2 = dom.childAt(element1, [1]);
                var element3 = dom.childAt(element1, [3]);
                var element4 = dom.childAt(element1, [5]);
                var morph0 = dom.createMorphAt(element3,0,1);
                var morph1 = dom.createMorphAt(element4,0,1);
                var morph2 = dom.createMorphAt(dom.childAt(element0, [3]),0,1);
                element(env, element2, context, "action", ["delete", get(env, context, "id")], {});
                element(env, element2, context, "bind-attr", [], {"class": "controller.isEditing:circle:noncircle"});
                element(env, element3, context, "bind-attr", [], {"class": "controller.isEditing:time-edit:time"});
                inline(env, morph0, context, "format-time", [subexpr(env, context, "local-date", [get(env, context, "weatherData.currently.time")], {"offset": get(env, context, "weatherData.offset"), "since": get(env, context, "sinceLastRefresh")})], {"showMinutes": true});
                element(env, element4, context, "bind-attr", [], {"class": "controller.isEditing:city-name-edit:city-name"});
                content(env, morph1, context, "name");
                inline(env, morph2, context, "format-temperature", [get(env, context, "hourly.temperature")], {"unitParam": get(env, context, "usUnitAlias")});
                return fragment;
              }
            };
          }());
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, block = hooks.block;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
              var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
              block(env, morph0, context, "if", [get(env, context, "isCurLocation")], {}, child0, child1);
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, element = hooks.element, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element8 = dom.childAt(fragment, [1]);
            var morph0 = dom.createMorphAt(element8,0,1);
            element(env, element8, context, "bind-attr", [], {"class": get(env, context, "conditionClassname")});
            block(env, morph0, context, "link-to", ["city", get(env, context, "id")], {"disabled": get(env, context, "controller.isEditing")}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          set(env, context, "usUnitAlias", blockArguments[0]);
          block(env, morph0, context, "each", [get(env, context, "model")], {}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("        Done\n");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createTextNode("      Edit\n");
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","cities-list");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("nav");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"class","edit-title");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"class","attribution");
        dom.setAttribute(el3,"href","http://forecast.io/");
        dom.setAttribute(el3,"target","_blank");
        var el4 = dom.createTextNode("Powered by Forecast");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","celsius");
        var el6 = dom.createTextNode("˚C");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ⁄\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","fahrenheit");
        var el6 = dom.createTextNode("˚F ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3,"class","plus");
        var el4 = dom.createTextNode("+");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element9 = dom.childAt(fragment, [2, 1]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(element9, [5]);
        var element12 = dom.childAt(element11, [1]);
        var element13 = dom.childAt(element9, [7]);
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 1]),0,1);
        var morph1 = dom.createMorphAt(element10,0,1);
        var morph2 = dom.createMorphAt(dom.childAt(element12, [3]),0,-1);
        block(env, morph0, context, "with", [get(env, context, "useUSUnits")], {}, child0, null);
        element(env, element10, context, "action", ["editCity"], {});
        block(env, morph1, context, "if", [get(env, context, "isEditing")], {}, child1, child2);
        element(env, element11, context, "bind-attr", [], {"class": ":celsius-or-fahrenheit controller.useUSUnits:use-fahrenheit:use-celsius"});
        element(env, element12, context, "action", ["toggleUnits"], {});
        inline(env, morph2, context, "format-temperature", [get(env, context, "temperature")], {"unitParam": get(env, context, "controller.useUSUnits")});
        element(env, element13, context, "action", ["addcity"], {});
        return fragment;
      }
    };
  }()));

});
define('weather/tests/adapter/application.jshint', function () {

  'use strict';

  module('JSHint - adapter');
  test('adapter/application.js should pass jshint', function() { 
    ok(true, 'adapter/application.js should pass jshint.'); 
  });

});
define('weather/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('weather/tests/controllers/add.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/add.js should pass jshint', function() { 
    ok(false, 'controllers/add.js should pass jshint.\ncontrollers/add.js: line 11, col 26, Expected \'===\' and instead saw \'==\'.\ncontrollers/add.js: line 24, col 47, Expected \'===\' and instead saw \'==\'.\ncontrollers/add.js: line 19, col 9, \'$\' is not defined.\n\n3 errors'); 
  });

});
define('weather/tests/controllers/city.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/city.js should pass jshint', function() { 
    ok(true, 'controllers/city.js should pass jshint.'); 
  });

});
define('weather/tests/controllers/index.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/index.js should pass jshint', function() { 
    ok(true, 'controllers/index.js should pass jshint.'); 
  });

});
define('weather/tests/datamanager.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('datamanager.js should pass jshint', function() { 
    ok(true, 'datamanager.js should pass jshint.'); 
  });

});
define('weather/tests/helpers/format-percentage.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/format-percentage.js should pass jshint', function() { 
    ok(false, 'helpers/format-percentage.js should pass jshint.\nhelpers/format-percentage.js: line 5, col 58, \'options\' is defined but never used.\n\n1 error'); 
  });

});
define('weather/tests/helpers/format-precipitation.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/format-precipitation.js should pass jshint', function() { 
    ok(true, 'helpers/format-precipitation.js should pass jshint.'); 
  });

});
define('weather/tests/helpers/format-pressurefromhpa.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/format-pressurefromhpa.js should pass jshint', function() { 
    ok(true, 'helpers/format-pressurefromhpa.js should pass jshint.'); 
  });

});
define('weather/tests/helpers/format-temperature.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/format-temperature.js should pass jshint', function() { 
    ok(true, 'helpers/format-temperature.js should pass jshint.'); 
  });

});
define('weather/tests/helpers/format-time.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/format-time.js should pass jshint', function() { 
    ok(false, 'helpers/format-time.js should pass jshint.\nhelpers/format-time.js: line 20, col 17, Expected \'===\' and instead saw \'==\'.\n\n1 error'); 
  });

});
define('weather/tests/helpers/format-visibility.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/format-visibility.js should pass jshint', function() { 
    ok(true, 'helpers/format-visibility.js should pass jshint.'); 
  });

});
define('weather/tests/helpers/format-wind.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/format-wind.js should pass jshint', function() { 
    ok(true, 'helpers/format-wind.js should pass jshint.'); 
  });

});
define('weather/tests/helpers/local-date.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/local-date.js should pass jshint', function() { 
    ok(false, 'helpers/local-date.js should pass jshint.\nhelpers/local-date.js: line 2, col 8, \'config\' is defined but never used.\n\n1 error'); 
  });

});
define('weather/tests/helpers/resolver', ['exports', 'ember/resolver', 'weather/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('weather/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('weather/tests/helpers/start-app', ['exports', 'ember', 'weather/app', 'weather/router', 'weather/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('weather/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('weather/tests/helpers/week-day.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/week-day.js should pass jshint', function() { 
    ok(false, 'helpers/week-day.js should pass jshint.\nhelpers/week-day.js: line 2, col 8, \'config\' is defined but never used.\nhelpers/week-day.js: line 5, col 58, \'options\' is defined but never used.\n\n2 errors'); 
  });

});
define('weather/tests/models/city.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/city.js should pass jshint', function() { 
    ok(false, 'models/city.js should pass jshint.\nmodels/city.js: line 40, col 11, \'date\' is defined but never used.\n\n1 error'); 
  });

});
define('weather/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('weather/tests/routes/city.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/city.js should pass jshint', function() { 
    ok(false, 'routes/city.js should pass jshint.\nroutes/city.js: line 12, col 5, \'$\' is not defined.\nroutes/city.js: line 13, col 5, \'$\' is not defined.\nroutes/city.js: line 14, col 5, \'$\' is not defined.\nroutes/city.js: line 2, col 8, \'City\' is defined but never used.\n\n4 errors'); 
  });

});
define('weather/tests/routes/edit.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/edit.js should pass jshint', function() { 
    ok(true, 'routes/edit.js should pass jshint.'); 
  });

});
define('weather/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(false, 'routes/index.js should pass jshint.\nroutes/index.js: line 20, col 5, \'$\' is not defined.\nroutes/index.js: line 2, col 8, \'City\' is defined but never used.\n\n2 errors'); 
  });

});
define('weather/tests/test-helper', ['weather/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('weather/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('weather/tests/untitled folder/application.jshint', function () {

  'use strict';

  module('JSHint - untitled folder');
  test('untitled folder/application.js should pass jshint', function() { 
    ok(true, 'untitled folder/application.js should pass jshint.'); 
  });

});
define('weather/untitled folder/application', function () {

	'use strict';

	// import DS from'ember-data';

	// DS.attr.transforms.object = {
	//   from: function(serialized) {
	//     return Em.none(serialized) ? {} : serialized;
	//   },
	//   to: function(deserialized) {
	//     return Em.none(deserialized) ? {} : deserialized;
	//   }
	// }

	// IT changed FROM THIS:

	// DS.attr.transforms.object = {
	//   from: function(serialized) {
	//     return Em.none(serialized) ? {} : serialized;
	//   },
	//   to: function(deserialized) {
	//     return Em.none(deserialized) ? {} : deserialized;
	//   }
	// }
	// TO THIS:

	// DS.RESTAdapter.registerTransform('object', {
	//   fromJSON: function(serialized) {
	//     return Em.none(serialized) ? {} : serialized;
	//   },
	//   toJSON: function(deserialized) {
	//     return Em.none(deserialized) ? {} : deserialized;
	//   }
	// })

	// exportdefault DS.LSSerializer.extend();

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('weather/config/environment', ['ember'], function(Ember) {
  var prefix = 'weather';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("weather/tests/test-helper");
} else {
  require("weather/app")["default"].create({"name":"weather","version":"0.0.0.7b009a89"});
}

/* jshint ignore:end */
//# sourceMappingURL=weather.map