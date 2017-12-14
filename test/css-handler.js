'use strict';


const fs = require('fs');
const pathUtil = require('path');
const co = require('co');
const compileCss = require('../lib/css-handler');


describe('css-handler', function() {
  const root = pathUtil.join(__dirname, 'fixtures/css-handler');

  const info = {
    name: 'css-test',
    path: root,
    assetsRoot: ''
  };

  const options = {
    moduleResolver: {
      resolve: function(name) {
        return {
          name: name,
          version: '1.0.0',
          path: root,
          assetsRoot: ''
        };
      }
    },

    settings: {
      applicationRoot: root,
      assets: {
        enableConcat: true
      }

    },

    compile: true
  };


  function* compile(path, opt = options) {
    const fixture = createFixture(path);
    return yield compileCss(fixture.path, fixture.body, info, opt);
  }


  function createFixture(path) {
    path = pathUtil.join(root, path);
    return {
      path: path,
      body: fs.readFileSync(path, 'utf-8').trim()
    };
  }


  it('should compile css file', function() {
    return co(function* () {
      const css = yield* compile('simple.css');
      const fixture = createFixture('simple.min.css');
      css.should.be.equal(fixture.body);
    });
  });


  it('should ignore compile with `@compile:false`', function() {
    return co(function* () {
      const css = yield* compile('ignore.css');
      css.should.be.false();
    });
  });


  it('ignore css file prefix with underscore', function() {
    return co(function* () {
      const css = yield* compile('_util.css');
      css.should.be.false();
    });
  });


  it('relative url will be transform to absolute path', function() {
    return co(function* () {
      let css = yield* compile('css/filter-url.css');
      css = css.replace(/\?_=\d+/g, '');
      const fixture = createFixture('css/filter-url.min.css');
      const expect = fixture.body.replace(/\n/g, '');
      css.should.be.equal(expect);
    });
  });

  it('relative url will not be transform to absolute path', function() {
    return co(function* () {
      const opt = Object.assign({}, options);
      opt.settings.assets.enableConcat = false;
      let css = yield* compile('css/no-filter-url.css', opt);
      css = css.replace(/\?_=\d+/g, '');
      const fixture = createFixture('css/no-filter-url.min.css');
      const expect = fixture.body.replace(/\n/g, '');
      css.should.be.equal(expect);
    });
  });
});

