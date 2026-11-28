// Quantities are standard freight lots. All clocks use simulation seconds.
export class PortLedger {
  constructor(){
    this.grain=4;this.flour=1;this.millParts=4;
    this.portFlour=2;this.spares=3;this.kits=1;this.airshipKits=1;
    this.cargo={kind:'spares',lots:2}; // First service is already inbound from the west.
    this.nextHarvest=34;this.nextMilling=18;this.nextShift=55;
    this.lastDelivery='Западный порт отправил запчасти на мельницу.';
  }
  update(time){
    while(Math.min(this.nextHarvest,this.nextMilling,this.nextShift)<=time){
      const tick=Math.min(this.nextHarvest,this.nextMilling,this.nextShift);
      if(tick===this.nextHarvest){this.grain=Math.min(12,this.grain+2);this.nextHarvest+=50;}
      if(tick===this.nextMilling){
        if(this.grain>=2 && this.millParts>0 && this.flour<=6){
          this.grain-=2;this.flour+=2;this.millParts--;
        }
        this.nextMilling+=36;
      }
      if(tick===this.nextShift){
        if(this.portFlour>0 && (this.kits<4 || this.spares<8)){
          this.portFlour--;this.kits=Math.min(4,this.kits+1);this.spares=Math.min(8,this.spares+2);
        }
        this.nextShift+=48;
      }
    }
  }
  unload(east){
    const {kind,lots}=this.cargo;
    if(!lots)return;
    if(east && kind==='spares')this.millParts+=lots;
    else if(!east && kind==='flour')this.portFlour+=lots;
    else return;
    this.lastDelivery=east?'Мельница получила запчасти, партий — '+lots+'.':'Мука для рабочих доставлена, партий — '+lots+'.';
    this.cargo={kind:null,lots:0};
  }
  load(east){
    if(this.cargo.lots)return;
    const kind=east?'flour':'spares',lots=Math.max(0,Math.min(this[kind],4,east?10-this.portFlour:10-this.millParts));
    this[kind]-=lots;this.cargo={kind,lots};
  }
  loadAirship(){const lots=Math.min(2-this.airshipKits,this.kits);this.kits-=lots;this.airshipKits+=lots;}
  issueKit(){if(!this.airshipKits)return false;this.airshipKits--;return true;}
  get manifest(){
    return this.cargo.lots?(this.cargo.kind==='flour'?'мука на запад':'запчасти на восток')+' · '+this.cargo.lots+' п.':'без груза';
  }
}
