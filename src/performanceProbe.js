/** Opt-in engine timings. No pixel readback and no observer cost in ordinary play. */
export class PerformanceProbe {
  constructor(scene){
    this.scene=scene;this.engine=scene.getEngine();this.frames=[];this.cpu=[];this.draws=[];this.gpu=[];this.count=0;
    this.sceneProbe=new BABYLON.SceneInstrumentation(scene);
    for(const name of ['captureFrameTime','captureRenderTime','captureRenderTargetsRenderTime','captureActiveMeshesEvaluationTime'])this.sceneProbe[name]=true;
    this.engineProbe=new BABYLON.EngineInstrumentation(this.engine);this.engineProbe.captureGPUFrameTime=true;
    scene.onDisposeObservable.addOnce(()=>{this.sceneProbe.dispose();this.engineProbe.dispose();});
  }
  record(){
    if(++this.count<180)return; // exclude shader compilation and initial scene loading
    const e=this.engine,p=this.sceneProbe;
    this.frames.push(e.getDeltaTime());this.cpu.push(p.frameTimeCounter.current);this.draws.push(p.drawCallsCounter.current);
    const gpu=this.engineProbe.gpuFrameTimeCounter.current/1e6;if(gpu>0)this.gpu.push(gpu);
    for(const a of [this.frames,this.cpu,this.draws,this.gpu])if(a.length>180)a.shift();
    if(this.count%60)return;
    const stats=a=>{const s=[...a].sort((a,b)=>a-b);return s.length?{median:+s[Math.floor(s.length*.5)].toFixed(2),p95:+s[Math.min(s.length-1,Math.floor(s.length*.95))].toFixed(2)}:null;};
    document.body.dataset.profile=JSON.stringify({samples:this.frames.length,frameMs:stats(this.frames),cpuFrameMs:stats(this.cpu),gpuMs:stats(this.gpu),drawCalls:stats(this.draws),renderTargetsMs:p.renderTargetsRenderTimeCounter.current,meshEvaluationMs:p.activeMeshesEvaluationTimeCounter.current,renderSize:[e.getRenderWidth(),e.getRenderHeight()],quality:this.scene.metadata?.graphicsQuality,triangles:this.scene.getActiveIndices()/3,shadowCasters:this.scene.lights.reduce((n,l)=>n+(l.getShadowGenerator()?.getShadowMap()?.renderList?.length||0),0)});
  }
}
