import ttf2eot from 'ttf2eot'
import ttf2woff from 'ttf2woff'
import otf2ttf from 'otf2ttf'

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// consts
const PLUGIN_NAME = 'gulp-font';

// plugin level function (dealing with files)
function gulpPrefixer(options) {
    if (!options) {
        throw new PluginError(PLUGIN_NAME, 'Missing options!');
    }

    // creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, cb) {
        // file.contents = new Buffer(file.contents);
        // this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
        // return cb();

        let fileName = file.basename.replace(file.extname, '')
        let fileExtention = file.extname

        console.log(fileExtention)
        if(fileExtention === '.otf') file.contents = otf2ttf(file.contents)
        // make sure the file goes through the next gulp plugin
        // this.push(file);
        let woffBase64File = (new Buffer(ttf2woff(new Uint8Array(file.contents)).buffer)).toString(`base64`)

        options.embed || this.push(new gutil.File({
            cwd: "",
            base: "",
            path: `${fileName}.woff`,
            contents: new Buffer(ttf2woff(file.contents))
        }));

        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: `${fileName}.css`,
            contents: new Buffer(`@font-face {
                font-family: '${'name'}';
                weight: '${'weight'}';
                style: '${'style'}';
                src: url('data:application/x-font-woff2;charset=utf-8;base64, ${'woff2Base64File'}') format('woff2')
                    ${options.embed ? `url('data:application/x-font-woff;charset=utf-8;base64, ${woffBase64File}') format('woff')` : `url('${fileName}.woff') format('woff')`};
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