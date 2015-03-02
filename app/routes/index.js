import Ember from 'ember';
import City from 'weather/models/city';

var IndexRoute = Ember.Route.extend({


// need to add query

  // Query params are sort, order, filter, and filterValue
  // sync with the IndexController
  // queryParams: {
  //   sort: {
  //     refreshModel: true
  //   },
  //   order: {
  //     refreshModel: true
  //   },
  //   filter: {
  //     refreshModel: true
  //   },
  //   filterValue: {
  //     refreshModel: true
  //   }
  // },
  setupController: function(controller, model){
    // alert("good");
    $('body').removeClass().addClass('show-cities-list');
    controller.set('model', model);
  },

  model: function() {
    // alert("good");
    return [
      City.create({
        id: 'sanjose',
        name: 'San Jose',
        lat: 37.3382082,
        lng: -121.88632860000001,
        lastUpdated: -1,
        weatherData: {
          daily: {
            data: [
            {
              sunriseTime: new Date().getTime()
            }
            ]
          },
          currently: {
            time: 1425146974
          },
          offset: 0,
          hourly: {
            data: [
            {
              temperature: 49,
              time: new Date().getTime(),
              icon: 'sunny',
              summary: 'this is summary'
            }
            ]
          }
        }
      }),
      City.create({
        id: 'sydney',
        name: 'Sydney',
        lat: -33.8674869,
        lng: 151.20699020000006,
        lastUpdated: -1,
        weatherData: {
          daily: {
            data: [
            {
              sunriseTime: new Date().getTime()
            }
            ]
          },
          currently:{
            time:1425180711
          },
          offset: 0,
          hourly:{
            data:[
            {
              temperature: 7,
              time: new Date().getTime(),
              icon: 'cloudy',
              summary: 'this is summary'
            }
            ]
          }
        }
      })
      ];
    // return this.store.find('city', params);
  }
});


export default IndexRoute;
