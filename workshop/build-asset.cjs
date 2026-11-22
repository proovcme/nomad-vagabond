// Bake the same source with the same engine as the interactive workspace.
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const {spawn}=require('node:child_process'),{createInterface}=require('node:readline');
const {chromium}=require('playwright');
const root=path.join(__dirname,'..');
async function main(){
 const [source,id]=process.argv.slice(2);
 if(!source||!/^[-a-z0-9_]{1,50}$/.test(id||''))throw Error('Использование: npm run asset:build -- <проект.nomad.json или preset:cutter> <id>');
 const preset=source.startsWith('preset:')?source.slice(7):null;
 const input=preset?null:await fs.readFile(path.resolve(source));
 const temporary=await fs.mkdtemp(path.join(os.tmpdir(),'nomad-asset-'));
 const server=spawn('python3',['-u','-m','http.server','0','-b','127.0.0.1'],{cwd:root,stdio:['ignore','pipe','ignore']});
 let browser,timeout;
 try{
  const port=await new Promise((resolve,reject)=>{
    timeout=setTimeout(()=>reject(Error('Не удалось запустить предпросмотр')),8000);
    server.once('error',reject);server.once('exit',()=>reject(Error('Локальный сервер завершился')));
    createInterface({input:server.stdout}).on('line',line=>{const m=line.match(/port (\d+)/);if(m){clearTimeout(timeout);resolve(m[1]);}});
  });
  browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1280,height:800}});
  await page.goto('http://127.0.0.1:'+port+'/workshop/models.html');await page.locator('#parts button').first().waitFor();
  if(preset){await page.selectOption('#template',preset);await page.click('#apply');}
  else{await page.locator('#file').setInputFiles({name:'source.json',mimeType:'application/json',buffer:input});await page.waitForFunction(()=>document.querySelector('#status').textContent==='Проект открыт');}
  const download=async(button,out)=>{const ready=page.waitForEvent('download',{timeout:30000});await page.click(button);await (await ready).saveAs(path.join(temporary,out));};
  await download('#save','source.json');await download('#export','model.glb');
  const file=await fs.readFile(path.join(temporary,'model.glb'));
  if(file.toString('ascii',0,4)!=='glTF'||file.readUInt32LE(8)!==file.length)throw Error('Некорректный GLB');
  const model=JSON.parse(file.subarray(20,20+file.readUInt32LE(12)).toString());
  if(!model.meshes?.length||model.images?.some(i=>i.bufferView===undefined)||model.buffers.some(b=>b.uri))throw Error('GLB должен содержать геометрию и встроенные ресурсы');
  await page.addScriptTag({url:'/vendor/babylonjs.loaders.min.js'});
  const roundtrip=await page.evaluate(async data=>{
    const scene=BABYLON.EngineStore.LastCreatedScene;
    const result=await BABYLON.SceneLoader.LoadAssetContainerAsync('','data:model/gltf-binary;base64,'+data,scene,undefined,'.glb');
    const count=result.meshes.filter(m=>m.getTotalVertices()>0).length;result.dispose();return count;
  },file.toString('base64'));
  if(!roundtrip)throw Error('Загрузчик игры не открыл геометрию');
  await page.addStyleTag({content:'.views,.readout{visibility:hidden}'});
  await page.locator('#view').screenshot({path:path.join(temporary,'preview.png')});
  const runtime=path.join(root,'assets/workshop'),sources=path.join(root,'workshop/projects');
  await Promise.all([fs.mkdir(runtime,{recursive:true}),fs.mkdir(sources,{recursive:true})]);
  for(const [name,destination] of [['source.json',path.join(sources,id+'.nomad.json')],['preview.png',path.join(sources,id+'.png')],['model.glb',path.join(runtime,id+'.glb')]]){
    const tmp=destination+'.'+process.pid+'.tmp';await fs.copyFile(path.join(temporary,name),tmp);await fs.rename(tmp,destination);
  }
  console.log('workshop/'+id+' · '+roundtrip+' деталей, '+file.length+' байт · повторный импорт проверен');
 }finally{clearTimeout(timeout);try{await browser?.close();}finally{server.kill();await fs.rm(temporary,{force:true,recursive:true});}}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
