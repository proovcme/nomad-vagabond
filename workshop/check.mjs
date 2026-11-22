import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import production from '../src/content/passage.js';
import {references} from '../src/content/references.js';
import {check} from './productionSchema.js';
const root=fileURLToPath(new URL('../',import.meta.url));
try{
 const doc=process.argv.includes('--stdin')?JSON.parse(fs.readFileSync(0,'utf8')):production;
 check(doc);
 for(const {clip} of doc.radio)if(clip&&!fs.existsSync(path.join(root,'assets/audio/fog-passage',clip+'.mp3')))throw Error('Нет записи '+clip+'.mp3');
 if(references.some(r=>!r.note||!r.article||!r.url?.startsWith('https://')||(r.image&&!fs.existsSync(path.join(root,'assets/encyclopedia',r.image)))))throw Error('Проверьте статьи и ссылки атласа');
 console.log('Проверены главы, персонажи, сценарий, кадры, звук, эффекты и '+references.length+' записей атласа.');
}catch(e){console.error(e.message);process.exitCode=1;}
