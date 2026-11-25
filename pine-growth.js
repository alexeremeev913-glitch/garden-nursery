// Coordinates follow the photographed specimen, from root to terminal shoots.
(() => {
  const W=345, H=600;
  const clamp=n=>Math.min(1,Math.max(0,n));
  function makeRig(){
    const bones=[];
    function bone(parent,x,y,start,end){
      const base=bones[parent];
      const ax=base ? base.x : 168, ay=base ? base.y : 598;
      const dx=x-ax, dy=y-ay;
      bones.push({parent,x,y,ax,ay,dx,dy,len:Math.hypot(dx,dy),start,end});
      return bones.length-1;
    }
    let previous=-1;
    const trunk=[[168,492],[169,441],[171,357],[170,309],[170,244],[169,197],[171,141],[171,86],[173,4]];
    const joints=trunk.map(([x,y],i)=>{
      previous=bone(previous,x,y,i*.065,.34+i*.082);
      return previous;
    });
    const whorls=[
      [0,[[136,477],[96,463],[47,465],[17,457]]],[0,[[192,476],[226,469],[276,454],[332,416]]],
      [0,[[195,481],[238,496]]],[0,[[133,480],[107,499]]],
      [1,[[137,455],[90,448],[49,428],[13,395]]],[1,[[197,440],[230,451],[264,467]]],
      [1,[[151,414],[110,393],[79,387]]],
      [2,[[141,349],[94,339],[57,326],[19,278]]],[2,[[203,357],[248,365],[289,355],[331,329]]],
      [2,[[143,351],[112,369],[78,374]]],[2,[[210,371],[233,393]]],
      [3,[[145,294],[108,278],[70,258],[46,225]]],[3,[[195,297],[235,290],[279,274],[305,240]]],
      [3,[[193,325],[226,329],[256,350]]],
      [4,[[147,232],[113,222],[95,189]]],[4,[[194,231],[230,218],[255,201],[271,169]]],
      [4,[[143,247],[117,261]]],
      [5,[[150,184],[117,177],[86,165],[63,130]]],[5,[[191,181],[209,168],[222,150]]],
      [6,[[153,125],[127,112],[108,95],[102,70]]],[6,[[194,146],[226,147],[253,117]]],
      [6,[[183,127],[206,105],[211,89]]],
      [7,[[159,77],[146,63],[140,50]]],[7,[[186,79],[201,59],[207,42]]],
      [7,[[166,57],[159,40],[155,32]]]
    ];
    const tips=[];
    for(const [joint,points] of whorls){
      let p=joints[joint];
      points.forEach(([x,y],i)=>{
        const start=.024+joint*.076+i*.034;
        p=bone(p,x,y,start,Math.min(1,start+.43+i*.018));
      });
      tips.push(p);
    }
    return {bones,anchors:[tips[0],tips[8],tips[11]]};
  }

  function pose(bones,time){
    for(const b of bones){
      const age=clamp((time-b.start)/(b.end-b.start));
      const growth=age*(2-age);
      const parent=bones[b.parent];
      b.ox=parent ? parent.tipX : b.ax;
      b.oy=parent ? parent.tipY : b.ay;
      const turn=(1-growth)*Math.sign(b.dx)*-.48*Math.min(1,Math.abs(b.dx)/b.len);
      b.cos=Math.cos(turn); b.sin=Math.sin(turn);
      b.vx=(b.dx*b.cos-b.dy*b.sin)*growth;
      b.vy=(b.dx*b.sin+b.dy*b.cos)*growth;
      b.tipX=b.ox+b.vx; b.tipY=b.oy+b.vy;
      b.width=growth*(.25+.75*age);
      b.age=age;
    }
  }

  // Atlas rectangles follow bone order: source x, y, width, height and rest-position x, y.
  const patches=[[0, 0, 29, 166, 240, 745], [31, 0, 57, 85, 228, 668], [90, 0, 96, 135, 216, 540], [188, 0, 71, 80, 217, 467], [261, 0, 79, 106, 224, 368], [342, 0, 76, 79, 220, 296], [420, 0, 77, 93, 213, 211], [499, 0, 70, 92, 222, 127], [571, 0, 47, 131, 247, 3], [620, 0, 57, 47, 203, 706], [679, 0, 79, 51, 138, 690], [760, 0, 87, 67, 64, 677], [849, 0, 58, 62, 21, 669], [909, 0, 45, 50, 253, 702], [0, 168, 70, 43, 284, 693], [72, 168, 105, 98, 337, 638], [179, 168, 128, 106, 392, 614], [309, 168, 50, 37, 253, 724], [361, 168, 123, 37, 293, 724], [486, 168, 63, 39, 197, 724], [551, 168, 83, 22, 125, 724], [636, 168, 60, 58, 201, 656], [698, 168, 85, 75, 128, 637], [785, 168, 93, 78, 57, 619], [880, 168, 95, 92, 4, 582], [0, 276, 65, 71, 254, 618], [67, 276, 72, 82, 296, 622], [141, 276, 95, 121, 341, 640], [238, 276, 47, 67, 215, 609], [287, 276, 90, 77, 153, 576], [379, 276, 98, 68, 77, 575], [479, 276, 54, 56, 211, 492], [535, 276, 95, 79, 132, 467], [632, 276, 101, 102, 59, 451], [735, 276, 115, 140, 6, 383], [852, 276, 60, 41, 257, 515], [914, 276, 84, 74, 305, 517], [0, 418, 89, 99, 373, 515], [91, 418, 88, 75, 427, 492], [181, 418, 50, 46, 214, 530], [233, 418, 68, 55, 160, 530], [303, 418, 112, 50, 66, 535], [417, 418, 74, 63, 257, 540], [493, 418, 119, 93, 295, 554], [614, 418, 65, 76, 198, 421], [681, 418, 94, 83, 141, 406], [777, 418, 94, 113, 81, 356], [873, 418, 91, 78, 48, 331], [966, 418, 53, 61, 255, 417], [0, 533, 86, 87, 288, 392], [88, 533, 99, 93, 345, 389], [189, 533, 84, 76, 404, 358], [275, 533, 50, 53, 256, 467], [327, 533, 79, 59, 288, 469], [408, 533, 87, 77, 332, 470], [497, 533, 47, 51, 216, 325], [546, 533, 105, 70, 131, 305], [653, 533, 84, 92, 116, 270], [739, 533, 65, 76, 255, 322], [806, 533, 85, 106, 282, 292], [893, 533, 93, 72, 328, 278], [0, 641, 81, 70, 359, 252], [83, 641, 55, 48, 208, 360], [140, 641, 83, 58, 146, 360], [225, 641, 50, 70, 211, 252], [277, 641, 71, 98, 167, 220], [350, 641, 90, 79, 106, 215], [442, 641, 82, 82, 79, 185], [526, 641, 62, 65, 254, 256], [590, 641, 75, 72, 275, 238], [667, 641, 57, 60, 301, 222], [726, 641, 60, 68, 204, 170], [788, 641, 68, 96, 178, 137], [858, 641, 69, 57, 149, 121], [929, 641, 59, 55, 143, 98], [0, 741, 45, 52, 257, 199], [47, 741, 77, 61, 291, 188], [126, 741, 75, 73, 326, 169], [203, 741, 37, 37, 257, 182], [242, 741, 71, 63, 268, 146], [315, 741, 54, 44, 288, 129], [371, 741, 51, 45, 213, 107], [424, 741, 60, 62, 192, 84], [486, 741, 39, 44, 201, 62], [527, 741, 47, 46, 257, 106], [576, 741, 51, 61, 271, 75], [629, 741, 42, 44, 282, 54], [673, 741, 30, 53, 235, 82], [705, 741, 33, 42, 228, 53], [740, 741, 30, 38, 226, 34]];
  function createSurface(canvas,shadow,atlas){
    const shadowCtx=shadow.getContext('2d');
    const ctx=canvas.getContext('2d');
    if(!ctx)return null;
    return {
      draw(bones){
        const dpr=Math.min(devicePixelRatio||1,1.75);
        const w=Math.max(1,Math.round(canvas.clientWidth*dpr)),h=Math.max(1,Math.round(canvas.clientHeight*dpr));
        if(canvas.width!==w || canvas.height!==h){canvas.width=w;canvas.height=h;}
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,w,h);
        bones.forEach((bone,i)=>{
          if(bone.width<.006 || !patches[i])return;
          const [sx,sy,sw,sh,x,y]=patches[i];
          // Extend along the shoot first, and expand wood and needles normal to it.
          const ux=bone.dx/bone.len, uy=bone.dy/bone.len;
          const vx=bone.vx/bone.len, vy=bone.vy/bone.len;
          const nx=-(bone.sin*ux+bone.cos*uy)*bone.width;
          const ny=(bone.cos*ux-bone.sin*uy)*bone.width;
          const a=vx*ux-nx*uy, c=vx*uy+nx*ux, b=vy*ux-ny*uy, d=vy*uy+ny*ux;
          ctx.setTransform(w/W*a,h/H*b,w/W*c,h/H*d,
            w/W*(bone.ox-a*bone.ax-c*bone.ay),h/H*(bone.oy-b*bone.ax-d*bone.ay));
          ctx.drawImage(atlas,sx,sy,sw,sh,x*W/525,y*H/913,sw*W/525,sh*H/913);
          if(i===0){
            // Widen the lowest bark rings into a root collar, keeping their grain continuous.
            const rows=Math.min(sh,32);
            for(let j=0;j<rows;j++){
              const flare=1+.58*(j/rows)**2;
              const srcY=sh-rows+j;
              const left=bone.ax+(x*W/525-bone.ax)*flare;
              ctx.drawImage(atlas,sx,sy+srcY,sw,1,left,(y+srcY)*H/913,sw*W/525*flare,H/913+.12);
            }
          }
        });
        // Early shoots carry fine needle pairs while the photographed tufts unfurl.
        ctx.setTransform(w/W,0,0,h/H,0,0);
        ctx.lineCap='round';
        for(let i=0;i<bones.length;i++){
          const b=bones[i];
          if(b.age<=0 || b.age>=.95)continue;
          const strength=Math.sin(Math.PI*b.age/.95);
          for(let j=0;j<12;j++){
            const angle=-2.88+j*.23+Math.sin(i*7+j)*.1;
            const length=(5+4*Math.sin(i+j*1.3)**2)*strength;
            const x=b.tipX, y=b.tipY+((j%4)-1)*strength;
            ctx.lineWidth=.65+.24*strength;
            ctx.strokeStyle=['#88a86a','#b3c879','#566f47'][j%3];
            ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(angle)*length*.5,y-1.8*strength,x+Math.cos(angle)*length,y+Math.sin(angle)*length);ctx.stroke();
          }
        }
        if(shadowCtx){
          const shadowWidth=Math.max(1,Math.round(w/3)),shadowHeight=Math.max(1,Math.round(h/3));
          if(shadow.width!==shadowWidth || shadow.height!==shadowHeight){
            shadow.width=shadowWidth;shadow.height=shadowHeight;
          }
          shadowCtx.clearRect(0,0,shadow.width,shadow.height);
          shadowCtx.drawImage(canvas,0,0,shadow.width,shadow.height);
        }
      }
    };
  }

  class PineGrove extends HTMLElement {
    connectedCallback(){
      this.stage=this.querySelector('.grove-stage');
      this.tree=this.querySelector('.grove-tree');
      this.notes=[...this.querySelectorAll('.grove-note')];
      this.rig=makeRig();this.life=new AbortController();
      this.motion=matchMedia('(prefers-reduced-motion: reduce)');
      const opts={signal:this.life.signal,passive:true};
      const queue=()=>{if(this.visible && !this.frame)this.frame=requestAnimationFrame(()=>{this.frame=0;this.paint();});};
      const atlas=new Image();
      const init=()=>{
        if(!this.visible || this.tried || this.motion.matches)return;
        if(!atlas.src){atlas.src='assets/pine-branches.webp';return;}
        if(!atlas.naturalWidth)return;
        this.tried=true;
        this.surface=createSurface(this.tree.querySelector('.grove-specimen'),this.tree.querySelector('.grove-shadow'),atlas);
        this.tree.classList.toggle('live',!!this.surface);
        this.classList.toggle('static-grove',!this.surface);
      };
      atlas.addEventListener('error',()=>{this.classList.add('static-grove');queue();},opts);
      this.observer=new IntersectionObserver(entries=>{
        this.visible=entries[0].isIntersecting;
        if(this.visible){init();queue();}
      },{rootMargin:'160px'});
      this.observer.observe(this.stage);
      atlas.addEventListener('load',()=>{init();queue();},opts);
      window.addEventListener('scroll',queue,opts);
      this.resize=new ResizeObserver(queue);this.resize.observe(this.stage);
      this.motion.addEventListener('change',()=>{init();queue();},opts);
      this.paint();
    }
    disconnectedCallback(){
      this.observer.disconnect();this.resize.disconnect();this.life.abort();
      cancelAnimationFrame(this.frame);this.surface=null;
    }
    paint(){
      const stage=this.stage, box=this.tree.getBoundingClientRect(), bounds=stage.getBoundingClientRect();
      const staticView=this.motion.matches || !this.surface;
      const p=staticView?1:clamp(-this.getBoundingClientRect().top/Math.max(1,this.offsetHeight-stage.offsetHeight));
      const time=.06+.94*p;
      const {bones,anchors}=this.rig;
      pose(bones,time);
      this.surface?.draw(bones);
      this.tree.style.setProperty('--root-shadow',String(.12+.88*p));
      const margin=stage.clientWidth<721?10:32;
      this.notes.forEach((note,i)=>{
        const anchor=bones[anchors[i]], isLeft=i!==1;
        const x=box.left-bounds.left+anchor.tipX/W*box.width;
        const y=box.top-bounds.top+anchor.tipY/H*box.height;
        const span=Math.max(0,Math.min(stage.clientWidth*.045,isLeft?x-margin-note.offsetWidth:stage.clientWidth-x-margin-note.offsetWidth));
        const left=isLeft?Math.max(note.offsetWidth+margin,x-span):Math.min(stage.clientWidth-note.offsetWidth-margin,x+span);
        const opacity=clamp((p-[.21,.48,.74][i])/.085);
        note.style.setProperty('--wire',span+'px');
        note.style.left=left+'px';note.style.top=y+'px';note.style.opacity=opacity;
        note.style.visibility=opacity>.02?'visible':'hidden';
        note.inert=opacity<.62;
      });
    }
  }
  customElements.define('pine-grove',PineGrove);
})();
