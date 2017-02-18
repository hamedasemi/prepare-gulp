import ttf2eot from 'ttf2eot'
import ttf2woff from 'ttf2woff'

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// consts
const PLUGIN_NAME = 'gulp-font';

// plugin level function (dealing with files)
function gulpPrefixer(options) {
    // if (!options) {
    //     throw new PluginError(PLUGIN_NAME, 'Missing options!');
    // }

    // creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, cb) {
        // file.contents = new Buffer(file.contents);
        // this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
        // return cb();

        console.log(file.base)

        // make sure the file goes through the next gulp plugin
        this.push(file);
        let eotBase64File = (new Buffer(ttf2eot(new Uint8Array(file.contents)).buffer)).toString(`base64`)
        let woffBase64File = (new Buffer(ttf2woff(new Uint8Array(file.contents)).buffer)).toString(`base64`)
        let ttfBase64File = (file.contents).toString(`base64`)

        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: 'hello.woff',
            contents: new Buffer(ttf2woff(file.contents))
        }));
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: 'hello.eot',
            contents: new Buffer(ttf2eot(file.contents))
        }));
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: 'hello.css',
            contents: new Buffer(`@font-face {
                font-family: "${'name'}";
                weight: "${'weight'}";
                style: "${'style'}";
                src: url('data:font/opentype;base64, ${eotBase64File}.eot');
                src: url('data:font/opentype;base64, ${eotBase64File}.eot?#iefix') format("embedded-opentype")
                    url('data:application/x-font-woff2;charset=utf-8;base64, ${'woff2Base64File'}') format("woff2")
                    url('data:application/x-font-woff;charset=utf-8;base64, ${woffBase64File}') format("woff")
                    url('data:font/truetype;charset=utf-8;base64, ${ttfBase64File}') format("ttf");
                }`)
        }));
        // tell the stream engine that we are done with this file
        cb();
    });

    // stream.write();

    // returning the file stream
    return stream;
}

// exporting the plugin main function
module.exports = gulpPrefixer;