import { src, dest } from 'gulp';
import { obj } from 'stream-combiner2';

import newer from 'gulp-newer';
import font from './../plugins/gulp-font';

import config from './../config';

export function fonts(done) {
    obj([
        src(`${config.src}/assets/fonts/**/*.ttf`),
        // newer(config.dest),
        font({
            embed: true
        }),
        dest(config.dest)

    ]).on(`error`, console.error.bind(console));
    done()
}