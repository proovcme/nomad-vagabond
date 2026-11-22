// Run against a running workbench. The published game can also be checked separately.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
async function main(){
 const base=process.argv[2]||'http://127.0.0.1:5191/';
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  if(!process.argv.includes('--game-only')){
   await page.goto(new URL('workshop/',base).href);
   await page.getByRole('button',{name:'Ролики',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('#screen').contentDocument?.querySelector('output')?.textContent.includes(' · '));
   const download=page.waitForEvent('download',{timeout:60000});
   await page.getByRole('button',{name:'Записать WebM'}).click();
   const recording=await download;
   assert.match(recording.suggestedFilename(),/\.webm$/);
   const fs=require('node:fs/promises');const video=await fs.readFile(await recording.path());
   assert.equal(video.readUInt32BE(0),0x1a45dfa3);assert(video.length>10000);
   await page.getByRole('button',{name:'Персонажи',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('#animation')?.options.length>0);
   await page.getByRole('link',{name:'Модели и материалы'}).click();
   await page.locator('#parts button').first().waitFor();
   const count=await page.locator('#parts button').count();await page.click('#copy');
   assert.equal(await page.locator('#parts button').count(),count+1);
   await page.click('#undo');assert.equal(await page.locator('#parts button').count(),count);
  }
  await page.goto(base);await page.click('#atlas-menu');
  const atlas=page.frameLocator('dialog iframe');await atlas.getByRole('searchbox').fill('Tribal');
  await atlas.getByRole('heading',{name:/Tribal/}).waitFor();await atlas.getByRole('button',{name:'Закрыть'}).click();
  await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
  await page.click('#start-btn');await page.locator('#prologue-skip').click({timeout:90000});await page.click('#pause-hud-btn');await page.click('#atlas-pause');
  await atlas.getByRole('button',{name:'Закрыть'}).click();await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
  assert(await page.locator('#resume-btn').isVisible());assert.deepEqual(errors,[]);
  console.log('Проверка пройдена:',base);
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
