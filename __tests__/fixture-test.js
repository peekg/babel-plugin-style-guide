
jest.autoMockOff();

import fs from 'fs';
//import fails with babel
var babel = require( 'babel' );

describe("babel-plugin-style-guide-tests", function() {
  
  function run( file, out ) {
    return babel.transformFileSync(file, {
      optional: ['runtime'],
      blacklist: ["useStrict"],
      plugins: [ require( '../src/index' ) ]
    }).code;
  }
  
  it("fixtures", function() {
    let a, b, dir;
    dir = __dirname + "/fixtures/1";
    run( dir + "/actual.js" );
    b = fs.readFileSync( dir + "/actual.json", {encoding:"utf-8"} );
    a = fs.readFileSync( dir + "/expected.json", {encoding:"utf-8"} );
    expect( a ).toEqual( b );
  });
});



