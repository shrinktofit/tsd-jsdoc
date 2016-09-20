import * as path from 'path';
import * as fs from 'fs';
import * as env from 'jsdoc/env';
import * as helper from 'jsdoc/util/templateHelper';
import Emitter from './Emitter';

/**
 * @param {TAFFY} data - The TaffyDB containing the data that jsdoc parsed.
 * @param {object} opts - Options passed into jsdoc.
 */
export function publish(data: TDocletDb, opts: any) {
    // remove undocumented stuff.
    data({ undocumented: true }).remove();

    // get the doc list
    const docs = data().get();

    // create an emitter to parse the docs
    const emitter = new Emitter(docs);

    // emit the output
    if (opts.destination === 'console') {
        console.log(emitter.emit());
    }
    else {
        fs.mkdirSync(opts.destination);

        const pkg = (helper.find(data, { kind: 'package' }) || [])[0] as IPackageDoclet;
        const out = path.join(opts.destination, pkg && pkg.name ? `${pkg.name}.d.ts` : 'types.d.ts');

        fs.writeFileSync(out, emitter.emit());
    }
};