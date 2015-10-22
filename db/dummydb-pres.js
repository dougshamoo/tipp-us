var dummyArtists = [
  {
    name: 'DJ Kat',
    description: 'M-m-m-m-m-meow',
    email: 'kat@kat.com',
    password: 'katpass',
    artistUrl: 'https://en.wikipedia.org/wiki/Cat',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1445536688/djCat_t5bugl.jpg',
    merchantAccountID: 'katMerchantAccountId',
  },
  {
    name: 'Piano Dog',
    description: 'I ain\'t nothin but a hound dog',
    email: 'dog@dog.com',
    password: 'dogpass',
    artistUrl: 'https://en.wikipedia.org/wiki/Dog',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1445536691/pianoDog_lvspck.jpg',
    merchantAccountID: 'dogMerchantAccountId',
  },
  {
    name: 'The String Ferret',
    description: 'I\'m a ferret and I play the violin',
    email: 'ferret@ferret.com',
    password: 'ferretpass',
    artistUrl: 'https://en.wikipedia.org/wiki/Ferret',
    imageUrl: 'http://res.cloudinary.com/dd2e2t0fb/image/upload/v1445536693/ferretViolin_jgsm5j.jpg',
    merchantAccountID: 'ferretMerchantAccountId',
  },
];

var positions = [
  [33.9637225, -83.444641], // the Foundry
  [33.9582088, -83.4500383], // Watt Club
  [33.9583192, -83.4472341], // Georgia Theatre
];

// var venues = [
//   'The Foundry',
//   'Watt Club',
//   'Georgia Theatre',
// ];

var dummyShows = [
  {
    venue: 'The Foundry',
    latitude: positions[0][0],
    longitude: positions[0][1],
    startTime: '2015-10-22 13:30:00-08',
    stopTime: '2015-10-22 22:00:00-08',
  },
  {
    venue: 'Watt Club',
    latitude: positions[1][0],
    longitude: positions[1][1],
    startTime: '2015-10-22 13:30:00-08',
    stopTime: '2015-10-22 22:00:00-08',
  },
  {
    venue: 'Georgia Theatre',
    latitude: positions[2][0],
    longitude: positions[2][1],
    startTime: '2015-10-22 13:30:00-08',
    stopTime: '2015-10-22 22:00:00-08',
  },
];

var Sequelize = require('sequelize');
var sequelize = null;

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  // var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
  });
} else {
  // the application is executed on the local machine ...
  var config = require('../server/config.js');
  sequelize = new Sequelize(config.db.db, config.db.user, config.db.password, {
    dialect:  'postgres',
    host: '127.0.0.1',
    port: 5432,
  });
}

global.db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  artist: sequelize.import(__dirname + '/models/artist'),
  show: sequelize.import(__dirname + '/models/show'),

  // add your other models here
};

global.db.artist.associate(global.db);
global.db.show.associate(global.db);

// {force: true} drops tables before recreating them
sequelize.sync({force: true}).then(function() {
  dummyArtists.forEach(function(dummy, index) {
    global.db.artist.create(dummy)
    .then(function(artist) {
      global.db.show.create(dummyShows[index])
      .then(function(show) {
        show.setArtist(artist);
      });
    });
  });
});

// might need to put this somewhere to fix hang... seems to fix but
// somehow causes data not to be loaded right in app though.

// .then(function() {
//   process.exit(0);
// });