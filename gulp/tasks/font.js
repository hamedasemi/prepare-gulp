import {debug} from 'webrew-helpers-log';

import gulp, {task, watch, src, dest, parallel, series} from 'gulp';
import {obj} from 'stream-combiner2';
import gulpFont from 'gulp-font';
import gulpTtf2eot from 'gulp-ttf2eot';
import gulpTtf2woff from 'gulp-ttf2woff';
import gulpTtf2woff2 from 'gulp-ttf2woff2';

import config from './../config';

let fontConfig = {
    ext: `.css`,
    fontface: `${config.src}/assets/fonts`,
    relative: `/assets/fonts`,
    dest: `${config.dest}/assets/fonts`,
    embed: [
        `woff`
    ],
    collate: false
};

export function fontTtf2Ttf() {
    return src(`${config.src}/assets/fonts/**/*.{ttf}`)
        .pipe(dest(config.dest));
}

export function fontTtf2Eot() {
    return src(`${config.src}/assets/fonts/**/*.{ttf}`)
        .pipe(gulpTtf2eot())
        .pipe(dest(config.dest));
}

export function fontTtf2woff() {
    return src(`${config.src}/assets/fonts/**/*.{ttf}`)
        .pipe(gulpTtf2woff())
        .pipe(dest(config.dest));
}

export function fontTtf2woff2() {
    return src(`${config.src}/assets/fonts/**/*.{ttf}`)
        .pipe(gulpTtf2woff2())
        .pipe(dest(config.dest));
}

export const font = parallel(
    fontTtf2woff2, fontTtf2woff, fontTtf2Eot, fontTtf2Ttf
)

font.description = `Generate web font package from ttf and otf files.`;