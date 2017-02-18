import { debug } from 'webrew-helpers-log'
import { merge } from 'event-stream'
import { writeFile, readFileSync, mkdirSync } from 'fs'
import filter from 'gulp-filter'
import gulp, { task, watch, src, dest, parallel, series } from 'gulp'
import { obj } from 'stream-combiner2'
import gulpFont from 'gulp-font'
import gulpTtf2eot from 'gulp-ttf2eot'
import gulpTtf2woff from 'gulp-ttf2woff'
import gulpTtf2woff2 from 'gulp-ttf2woff2'
import ttf2eot from 'ttf2eot'
import ttf2woff from 'ttf2woff'
import ttf2woff2 from 'ttf2woff2'

import config from './../config'

let fontConfig = {
    ext: `.css`,
    fontface: `${config.src}/assets/fonts`,
    relative: `/assets/fonts`,
    dest: `${config.dest}/assets/fonts`,
    embed: [
        `woff`
    ],
    collate: false
}

export function font(done) {
    src(`${config.src}/assets/fonts/**/*.{ttf, otf}`)
        .on(`data`, (data, cb) => {


            let eotBase64Data = (new Buffer(ttf2eot(new Uint8Array(data.contents)).buffer)).toString(`base64`)
            let woffBase64Data = (new Buffer(ttf2woff(new Uint8Array(data.contents)).buffer)).toString(`base64`)
            let woff2Base64Data = `` //(new Buffer(ttf2woff2(new Uint8Array(data.contents)).buffer)).toString(`base64`)
            let ttfBase64Data = (data.contents).toString(`base64`)

            console.log(data.basename)
            console.log(data.extname)
            console.log(data.base)
            console.log(data.path.replace(data.extname, '.json'))

            let font = JSON.parse(readFileSync(data.path.replace(data.extname, '.json')))
            console.log(font)

            let name = font.name
            let weight = font.weight
            let style = font.style

            writeFile(`${config.dest}/assets/fonts/${data.basename.replace(data.extname, '')}.css`, `@font-face {
                font-family: "${name}";
                weight: "${weight}";
                style: "${style}";
                src: url('data:font/opentype;base64, ${eotBase64Data}.eot');
                src: url('data:font/opentype;base64, ${eotBase64Data}.eot?#iefix') format("embedded-opentype")
                    url('data:application/x-font-woff2;charset=utf-8;base64, ${woff2Base64Data}') format("woff2")
                    url('data:application/x-font-woff;charset=utf-8;base64, ${woffBase64Data}') format("woff")
                    url('data:font/truetype;charset=utf-8;base64, ${ttfBase64Data}') format("ttf");
                }`, function (err) {
                    if (err) {
                        return console.log(err)
                    }
                    console.log('Succeded')
                    // console.log(`@font-face {
                    //     font-family: "${name}";
                    //     weight: "${weight}";
                    //     style: "${style}";
                    //     src: url('data:font/opentype;base64, ${eotBase64Data}.eot');
                    //     src: url('data:font/opentype;base64, ${eotBase64Data}.eot?#iefix') format("embedded-opentype")
                    //         url('data:application/x-font-woff2;charset=utf-8;base64, ${woff2Base64Data}') format("woff2")
                    //         url('data:application/x-font-woff;charset=utf-8;base64, ${woffBase64Data}') format("woff")
                    //         url('data:font/truetype;charset=utf-8;base64, ${ttfBase64Data}') format("ttf");
                    // }`)
                })

        })
        .pipe(dest(config.dest))
    merge(
        // src(`${config.src}/assets/fonts/**/*.{ttf, otf}`)
        //     .pipe(gulpTtf2woff2())
        //     .pipe(dest(config.dest)),
        src(`${config.src}/assets/fonts/**/*.{ttf, otf}`)
            .pipe(gulpTtf2eot())
            .pipe(dest(config.dest)),
        src(`${config.src}/assets/fonts/**/*.{ttf, otf}`)
            .pipe(gulpTtf2woff())
            .pipe(dest(config.dest)),
        src(`${config.src}/assets/fonts/**/*.{ttf, otf}`)
            .pipe(dest(config.dest))
    )
    done()
}

font.description = `Generate web font package from ttf and otf files.`