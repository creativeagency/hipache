(function () {
    /*globals describe:false, before:false, after:false*/
    'use strict';

    var npmlog = require('npmlog');

    if (process.env.NO_MEMCACHED) {
        npmlog.error('Test', 'No memcached server on this machine! No tests, then.');
        return;
    }

    // Useful if you want to see servers talk to you
    // require('npmlog').level = 'silly';

    // var expect = require('chai').expect;

    var Driver = require('../../lib/drivers/memcached');
    var Server = require('../fixtures/servers/memcached');
    var testReading = require('./driver-test-reading');

    var s1 = new Server();
    var s2 = new Server();

    // Start all servers beforehand
    before(function (done) {
        // XXX memcache doesn't output anything on stdout
        s1.start(['9001']);//, '-vv']);
        s2.start(['9002']);//, '-vv']);
        setTimeout(done, 1000);
    });

    // Shutdown pips!
    after(function (done) {
        s1.stop();
        s2.stop();
        setTimeout(done, 1000);
    });

    describe('Memcached', function () {

        [
        // Simple
            ['memcached://:9001'],
        // Use prefixes
            ['memcached://:9001/#someprefix'],
        // Cluster
            ['memcached://:9001/#prefix', 'memcached://:9002/#prefix']
        ].forEach(function (setup) {
            describe(setup, function () {
                testReading(Driver, setup);
            });
        });
    });

})();
