# Weather

This is one of my projects in mobile web programming course. This webapp is based on
Ember.js. Feature list:

* Brief & detailed weather forecasts for cities (based on forecast.io API)
* Forecasts are automatically refreshed
* Timezone (and daylight saving time) cognitive
* Four different color schemes based on day/night and sunny/cloudy
* US/SI unit switch, i.e. ˚F/˚C, mi/km, etc.
* Weather forecast for current location (based on location API)
* Add city to the city list (based on location autocompletion API)
* Delete city

This project is for learning and fun. DO NOT use it for any commercial purpose.

## Screenshots

![City List](https://raw.githubusercontent.com/emmahu/weatherapp/master/screenshots/city-list.png "City List")

![City Detail](https://raw.githubusercontent.com/emmahu/weatherapp/master/screenshots/city-detail.png "City Detail")

![Add City](https://raw.githubusercontent.com/emmahu/weatherapp/master/screenshots/add-city.png "Add City")

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

[grunt-build-control](https://github.com/robwierzbowski/grunt-build-control) is used to deploy this repo via github's page service. To deploy, run:

* `npm install -g grunt-cli`
* `ember build -prod`
* `grunt buildcontrol:pages`

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

