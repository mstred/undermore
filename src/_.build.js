 /*global exports,Buffer,atob,btoa,escape,unescape*/
/*jslint browser:true*/

/**
 * NOTE: DO NOT EDIT THIS FILE
 * THIS FILE IS GENERATED VIA GRUNT
 * PLEASE ADD NEW UNDERMORE MIXINS TO
 * _source/
 * ONE MIXIN PER FILE (to allow custom builds)
 */


/**
 * The ecmascript String prototype
 * @external String
 * @see {@link http://www.ecma-international.org/ecma-262/5.1/#sec-15.5.3.1 ECMASCript 5.1 String.prototype}
 */
/**
 * undermore fills in the gaps where standards lag behind by providing a lot of tiny functions
 * that really should just already be there--these are tiny, unit tested additions to underscore.js, which
 * reside in _.* -- e.g. _.curry()
 *
 * @module undermore
 * @link https://github.com/atomantic/undermore.js
 * @copyright 2013 Adam Eivy (@antic)
 * @license MIT
 *
 * @param {object} exports The location of the underscore library to mixin all of the undermore methods
 */
(function(exports) {

    'use strict';

    // Establish the root object, `window` in the browser, or `global` on the server.
    var _ = exports._,
        // chars for base64 methods
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';


    // add the mixins to underscore
    _.mixin({ /**
 * base64_decode decode a string
 *
 * @link https://github.com/davidchambers/Base64.js
 * @param {string} str The string to decode
 * @return {string}
 */
base64_decode: function(str) {

    // allow browser implementation if it exists
    // https://developer.mozilla.org/en-US/docs/Web/API/window.btoa
    if (atob) {
        // utf8 decode after the fact to make sure we convert > 0xFF to ascii
        return _.utf8_decode(atob(str));
    }
    // allow node.js Buffer implementation if it exists
    if (Buffer) {
        return new Buffer(str, 'base64').toString('binary');
    }
    // now roll our own
    if (atob) {
        return _.utf8_decode(atob(str));
    }

    // decoder
    // [https://gist.github.com/1020396] by [https://github.com/atk]
    str = str.replace(/=+$/, '');
    for (
        // initialize result and counters
        var bc = 0, bs, buffer, idx = 0, output = '';
        // get next character
        buffer = str.charAt(idx++);
        // character found in table? initialize bit storage and add its ascii value;
        ~ buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
    }
    return output;
}, 
 /**
 * base64_encode encode a string
 *
 * Note: it might be work including an urlsafe flag
 * (see https://github.com/knowledgecode/base64.js)
 *
 * @link https://github.com/davidchambers/Base64.js
 * @param {string} str The string to encode
 * @return {string}
 */
base64_encode: function(str) {
    // allow browser implementation if it exists
    // https://developer.mozilla.org/en-US/docs/Web/API/window.btoa
    if (btoa) {
        // first utf8 encode to keep from throwing an error if we are out of 0xFF
        return btoa(_.utf8_encode(str));
    }
    // allow node.js Buffer implementation if it exists
    if (Buffer) {
        var buffer = (str instanceof Buffer) ? str : new Buffer(str.toString(), 'binary');
        return buffer.toString('base64');
    }
    // now roll our own
    // [https://gist.github.com/999166] by [https://github.com/nignag]
    for (
        // initialize result and counter
        var block, charCode, idx = 0, map = chars, output = '';
        // if the next input index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
        str.charAt(idx | 0) || (map = '=', idx % 1);
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
        charCode = str.charCodeAt(idx += 3 / 4);
        block = block << 8 | charCode;
    }
    return output;
}, 
 /**
  * create a partial application function (curry)
  * 
  * @link http://stackoverflow.com/questions/113780/javascript-curry-what-are-the-practical-applications
  * @param {function} fnBase The function to curry or partially apply
  * @return {function}
  * @example
     var adder = function() {
         var n = 0, args = [].slice.call(arguments);
         for (var i = 0, len = args.length; i < len; i++) {
             n += args[i];
         }   
         return n;
     };
     adder(2,2) === 4;
     // curry adder for later application as a partial
     var addTwelve = _.curry(adder, 12);
     addTwelve(5,3) === 20;
  */
curry: function(fnBase) {
    // convert arguments to an array and store reference upward of return closure
    var args = [].slice.call(arguments, 1);
    return function() {
        // apply the original function with old arguments combined with new arguments
        return fnBase.apply(this, args.concat(args.slice.call(arguments)));
    };
}, 
 /**
 * empty event handler function, which simply prevents default handling
 * @example
 *  $('thing').on('click',this.conf.onClick||_.eFn)
 */
eFn: function(e) {
    e.preventDefault();
}, 
 /**
 * Generic empty function to speed up supplying anon empty functions.
 * If you are using jQuery, you could use $.noop if returning undefined is desireable
 * but this one is useful for anything requiring a boolean true return
 *
 * @return {boolean} true
 * @example
 *  this.onComplete = conf.onComplete||_.fn;
 */
fn: function() {
    return true;
}, 
 /**
 * get a new function, which runs two functions serially within a given context
 *
 * @param {function} originalFn The original function to run
 * @param {function} moreFn The extra function to run in the same context after the first
 * @param {object} scope The context in which to run the fn
 * @return {function} the new function which will serially call the given functions in the given scope
 * @example
 *   var fn = _.fnMore(oldFn,newFn,someObj);
 *   fn();
 *   // runs oldFn, then newFn in the context of someObj
 */
fnMore: function(originalFn, moreFn, scope) {
    return scope ?
        function() {
            originalFn.apply(scope, arguments);
            moreFn.apply(scope, arguments);
    } : function() {
        originalFn();
        moreFn();
    };
}, 
 /**
 * Get the english ordinal suffix for any number
 *
 * @param {number} n number The number to evaluate
 * @return {string} The ordinal for that number
 * @example:
 *  _.ord(1) === 'st'
 *  _.ord(345) === 'th'
 */
ord: function(n) {
    var sfx = ["th", "st", "nd", "rd"],
        v = n % 100;
    return sfx[(v - 20) % 10] || sfx[v] || sfx[0];
}, 
 /**
 * utf8 decode a string
 *
 * @link http://monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
 * @param {string} str The string to decode
 * @return {string}
 */
utf8_decode: function(str) {
    return decodeURIComponent(escape(str));
}, 
 /**
 * utf8 encode a string
 *
 * @link http://monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
 * @param {string} str The string to encode
 * @return {string}
 */
utf8_encode: function(str) {
    return unescape(encodeURIComponent(str));
}, 
 /**
 * generate a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f,
 * and y is replaced with a random hexadecimal digit from 8 to b.
 *
 * @link http://www.ietf.org/rfc/rfc4122.txt
 * @return {string} random uuid
 * @example
 *  var uuid = _.uuid();
 */
uuid: function() {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
} 
    }); // mixin

}(typeof exports === 'object' && exports || this)); 