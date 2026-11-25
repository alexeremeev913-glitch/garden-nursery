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
  function createSurface(canvas,atlas){
    const ctx=canvas.getContext('2d');
    if(!ctx)return null;
    // Prepare the first trunk patch once. At the soil line, clods occlude the
    // sides of the flare at different heights and the near lip stays visible.
    const [sx,sy,sw,sh,x]=patches[0],collarPad=16;
    const collar=document.createElement('canvas');
    collar.width=sw+2*collarPad;collar.height=sh;
    const wood=collar.getContext('2d');
    const axis=collarPad+168*525/W-x;
    for(let row=0;row<sh;row++){
      const flare=1+.58*smoothStep(sh-33,sh,row)**2;
      wood.drawImage(atlas,sx,sy+row,sw,1,axis+(collarPad-axis)*flare,row,sw*flare,1);
    }
    wood.globalCompositeOperation='destination-out';
    for(let col=0;col<collar.width;col++){
      const distance=Math.min(1,Math.abs(col-axis)/(sw*.63));
      const soilLine=sh-2-6*distance**1.3+1.4*Math.sin(col*.71)+.8*Math.cos(col*2.1);
      for(let row=sh-16;row<sh;row++){
        wood.globalAlpha=smoothStep(soilLine-3,soilLine+1,row);
        wood.fillRect(col,row,1,1);
      }
    }
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
          // Secondary thickening follows the leader, tapering from the collar to its tip.
          const girth=i<9 ? 1+1.28*bone.age*(1-i/9)**1.35 : 1;
          const nx=-(bone.sin*ux+bone.cos*uy)*bone.width*girth;
          const ny=(bone.cos*ux-bone.sin*uy)*bone.width*girth;
          const a=vx*ux-nx*uy, c=vx*uy+nx*ux, b=vy*ux-ny*uy, d=vy*uy+ny*ux;
          ctx.setTransform(w/W*a,h/H*b,w/W*c,h/H*d,
            w/W*(bone.ox-a*bone.ax-c*bone.ay),h/H*(bone.oy-b*bone.ax-d*bone.ay));
          if(i===0){
            ctx.drawImage(collar,(x-collarPad)*W/525,y*H/913,collar.width*W/525,sh*H/913);
          }else{
            ctx.drawImage(atlas,sx,sy,sw,sh,x*W/525,y*H/913,sw*W/525,sh*H/913);
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

      }
    };
  }

  // The root tips live under the soil. Each ridge uses the same path and growth
  // front for its displaced soil, settling clods and intermittently exposed bark.
  const rootBed={left:-105,top:-31,width:207,height:76};
  const rootPaths=[
    {points:[[-5,-3],[-23,1],[-48,13],[-91,9]],start:.11,end:.88,radius:7.2},
    {points:[[5,-4],[24,-3],[40,10],[79,15]],start:.19,end:.96,radius:6.4},
    {points:[[0,-3],[4,6],[-13,21],[-29,35]],start:.29,end:1,radius:5.2},
    {points:[[5,-3],[19,-9],[36,-13],[59,-20]],start:.4,end:.94,radius:4.3}
  ];
  const smoothStep=(lo,hi,x)=>{
    const t=clamp((x-lo)/(hi-lo));
    return t*t*(3-2*t);
  };
  function rootSamples(root,index){
    const [a,b,c,d]=root.points;
    const samples=[];
    for(let n=0;n<=48;n++){
      const t=n/48,s=1-t;
      const coord=k=>s*s*s*a[k]+3*s*s*t*b[k]+3*s*t*t*c[k]+t*t*t*d[k];
      samples.push({
        x:coord(0), y:coord(1)+Math.sin(t*13+index)*Math.sin(t*Math.PI)*1.6,
        t,r:root.radius*(1-t*.87)
      });
    }
    return samples;
  }
  function rootField(w,h){
    const fields=[];
    rootPaths.forEach((path,index)=>{
      const samples=rootSamples(path,index);
      const dist=new Float32Array(w*h).fill(Infinity);
      const time=new Float32Array(w*h), side=new Float32Array(w*h);
      for(let n=1;n<samples.length;n++){
        const a=samples[n-1],b=samples[n];
        const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);
        const edge=a.r*3.2;
        const left=Math.max(0,Math.floor((Math.min(a.x,b.x)-edge-rootBed.left)*w/rootBed.width));
        const right=Math.min(w,Math.ceil((Math.max(a.x,b.x)+edge-rootBed.left)*w/rootBed.width));
        const top=Math.max(0,Math.floor((Math.min(a.y,b.y)-edge-rootBed.top)*h/rootBed.height));
        const bottom=Math.min(h,Math.ceil((Math.max(a.y,b.y)+edge-rootBed.top)*h/rootBed.height));
        for(let y=top;y<bottom;y++)for(let x=left;x<right;x++){
          const vx=rootBed.left+(x+.5)*rootBed.width/w-a.x;
          const vy=rootBed.top+(y+.5)*rootBed.height/h-a.y;
          const u=clamp((vx*dx+vy*dy)/(length*length));
          const r=a.r+u*(b.r-a.r);
          const distance=Math.hypot(vx-u*dx,vy-u*dy)/r,i=y*w+x;
          if(distance>=dist[i])continue;
          time[i]=a.t+u*(b.t-a.t);
          dist[i]=distance;
          side[i]=(vy*dx-vx*dy)/(length*r);
        }
      }
      fields.push({path,dist,time,side});
    });
    return fields;
  }
  function rootGround(canvas,photo){
    const ctx=canvas.getContext('2d');
    if(!ctx)return null;
    let key='', fields,earth,bark,frame,grain,gain,lastGrowth;
    const source=document.createElement('canvas');
    const sampler=source.getContext('2d',{willReadFrequently:true});
    function prepare(w,h,tree,bounds,plate){
      const unit=tree.height/H;
      const left=tree.left-bounds.left+tree.width*168/W+rootBed.left*unit;
      const top=tree.top-bounds.top+tree.height*.994+rootBed.top*unit;
      const width=rootBed.width*unit,height=rootBed.height*unit;
      const layout=[w,h,left.toFixed(2),top.toFixed(2),bounds.width,bounds.height,plate.src].join('/');
      if(key===layout)return;
      key=layout;lastGrowth=-1;
      Object.assign(canvas.style,{left:left+'px',top:top+'px',width:width+'px',height:height+'px'});
      canvas.width=source.width=w;canvas.height=source.height=h;
      const cover=Math.max(bounds.width/plate.width,bounds.height/plate.height);
      const pw=plate.width*cover,ph=plate.height*cover;
      sampler.setTransform(w/width,0,0,h/height,-left*w/width,-top*h/height);
      sampler.drawImage(plate,(bounds.width-pw)/2,bounds.height-ph,pw,ph);
      // Match the lighting overlay on the underlying CSS background.
      const light=sampler.createLinearGradient(0,0,0,bounds.height);
      light.addColorStop(0,'#101d1a44');light.addColorStop(.32,'transparent');
      light.addColorStop(.83,'transparent');light.addColorStop(1,'#101b1240');
      sampler.fillStyle=light;sampler.fillRect(left,top,width,height);
      try{
        earth=sampler.getImageData(0,0,w,h).data;
        if(!bark){
          const strip=document.createElement('canvas');strip.width=18;strip.height=110;
          const ink=strip.getContext('2d');ink.drawImage(photo,245,775,18,110,0,0,18,110);
          bark=ink.getImageData(0,0,18,110).data;
        }
      }catch{earth=null;return;}
      fields=rootField(w,h);frame=ctx.createImageData(w,h);
      grain=new Float32Array(w*h);gain=new Float32Array(w*h);
      for(let i=0;i<w*h;i++){
        const k=i*4,near=Math.max(0,i-w)*4;
        grain[i]=Math.min(1,Math.max(-1,(earth[k]-earth[near])/48));
        gain[i]=.84+.22*Math.min(1,earth[k]/130);
      }
    }
    return function draw(tree,bounds,plate,growth){
      if(!plate?.naturalWidth||!photo.naturalWidth)return;
      const density=Math.min(1.6,(devicePixelRatio||1)*tree.height/H);
      const w=Math.max(2,Math.round(rootBed.width*density)),h=Math.max(2,Math.round(rootBed.height*density));
      prepare(w,h,tree,bounds,plate);
      if(!earth||lastGrowth===growth)return;
      lastGrowth=growth;
      const pixels=frame.data;
      pixels.fill(0);
      const fronts=fields.map(({path})=>smoothStep(path.start,path.end,growth));
      for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
        const i=y*w+x,j=i*4;
        let lift=0,exposed=0,along=0,across=0,bank=0;
        fields.forEach((field,r)=>{
          const d=field.dist[i];if(d>3||!fronts[r])return;
          const t=field.time[i],wide=fronts[r]*1.16-t;
          const onset=smoothStep(-.085,.13,wide);
          if(!onset)return;
          const settle=smoothStep(.045,.28,wide);
          const radial=Math.max(0,1-d/3);
          const pressure=onset*(1-.42*settle)*(1-.67*t)*radial*radial;
          const reveal=onset*settle*(1-smoothStep(.62,.98,t));
          const edge=d/(.3+.68*reveal)+.23*grain[i];
          const skin=reveal*(1-smoothStep(.55,1.08,edge))*
            (.75+.25*Math.cos(t*15+r))*(1-.72*t);
          if(pressure>lift){lift=pressure;bank=field.side[i];}
          if(skin>exposed){exposed=skin;along=t;across=field.side[i];}
        });
        if(lift<.004)continue;
        // Read farther down the plate to lift its original specks and needles.
        const ox=Math.max(0,Math.min(w-2,x-lift*bank*density*1.8));
        const oy=Math.max(0,Math.min(h-2,y+lift*density*(5.8+grain[i])));
        const ix=Math.floor(ox),iy=Math.floor(oy),a=ox-ix,b=oy-iy,n=(iy*w+ix)*4;
        const relief=1+lift*(.13-.25*Math.min(1,Math.max(-1,bank)));
        const bx=Math.min(17,Math.max(0,Math.round(9+7*across)));
        const by=(Math.floor(along*280)+Math.round(2*grain[i])+110)%110;
        for(let c=0;c<3;c++){
          const soil=(earth[n+c]*(1-a)+earth[n+4+c]*a)*(1-b)+
            (earth[n+4*w+c]*(1-a)+earth[n+4*w+4+c]*a)*b;
          const wood=bark[(by*18+bx)*4+c]*gain[i];
          pixels[j+c]=soil*relief*(1-exposed)+wood*exposed;
        }
        pixels[j+3]=Math.round(255*smoothStep(.004,.13,lift));
      }
      ctx.putImageData(frame,0,0);
    };
  }

  // Work in the ground plane. A wide, shallow buffer keeps the soil pass independent
  // of display pixel ratio, including on high-density phones.
  function groundLighting(stage,canvas,refresh,drawRoots){
    const out=canvas.getContext('2d');
    if(!out)return null;
    const layer=()=>document.createElement('canvas');
    const cast=layer(), penumbra=layer(), relief=layer();
    const ink=cast.getContext('2d',{willReadFrequently:true});
    const soft=penumbra.getContext('2d',{willReadFrequently:true});
    const soil=relief.getContext('2d',{willReadFrequently:true});
    const portrait=matchMedia('(orientation:portrait)');
    let plate=null, plateKey='', key='', heights=null, result=null, disposed=false;
    const invalidate=()=>{key='';if(!disposed)refresh();};

    function prepare(w,h,bounds,top,scale){
      const file=portrait.matches?'assets/grove-afternoon-portrait.webp':'assets/grove-afternoon.webp';
      if(file!==plateKey){
        plateKey=file;plate=new Image();plate.onload=invalidate;plate.src=file;
      }
      const layout=[file,bounds.width,bounds.height,top,w,h].join('/');
      if(layout===key)return;
      key=layout;
      for(const surface of [canvas,cast,penumbra,relief]){
        surface.width=w;surface.height=h;
      }
      result=out.createImageData(w,h);
      heights=new Float32Array(w*h);
      if(!plate.naturalWidth)return;
      const cover=Math.max(bounds.width/plate.width,bounds.height/plate.height);
      const pw=plate.width*cover, ph=plate.height*cover;
      soil.drawImage(plate,(bounds.width-pw)*.5*scale,(bounds.height-ph-top)*scale,pw*scale,ph*scale);
      try{
        const data=soil.getImageData(0,0,w,h).data;
        const luma=i=>.26*data[4*i]+.6*data[4*i+1]+.14*data[4*i+2];
        for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){
          const i=y*w+x;
          // Relief is registered to the plate's actual twigs, stones and clods.
          const local=(luma(i-2)+luma(i+2)+luma(i-2*w)+luma(i+2*w))*.25;
          heights[i]=Math.max(-1,Math.min(1,(luma(i)-local)/52));
        }
      }catch{/* Local-file viewers may restrict pixel reads from the background. */}
    }

    return {
      dispose(){disposed=true;if(plate)plate.onload=null;},
      draw(specimen,tree,bounds,growth){
        if(!specimen.width || (specimen.tagName==='IMG' && !specimen.naturalWidth))return;
        const band=canvas.getBoundingClientRect(),top=band.top-bounds.top;
        const scale=Math.min(1,800/bounds.width);
        const w=Math.max(1,Math.round(bounds.width*scale)),h=Math.max(1,Math.round(band.height*scale));
        prepare(w,h,bounds,top,scale);
        drawRoots?.(tree,bounds,plate,growth);
        const tw=tree.width*scale, th=tree.height*scale;
        const rootX=(tree.left-bounds.left)*scale+tw*168/345;
        const rootY=(tree.top-bounds.top-top)*scale+th*.994;
        ink.setTransform(1,0,0,1,0,0);ink.clearRect(0,0,w,h);
        ink.translate(rootX,rootY);
        // Crown width has a depth component in this oblique view of the ground.
        const reach=portrait.matches ? .56 : .74;
        ink.transform(.72,.21,reach,-.19,0,0);
        ink.drawImage(specimen,-tw*168/345,-th*.994,tw,th);
        soft.clearRect(0,0,w,h);
        soft.filter='blur('+Math.max(1.15,th*.012)+'px)';
        soft.drawImage(cast,0,0);
        let crisp,blurred;
        try{
          crisp=ink.getImageData(0,0,w,h).data;
          blurred=soft.getImageData(0,0,w,h).data;
        }catch{
          // Still project a soft silhouette when file-origin canvas readback is blocked.
          out.clearRect(0,0,w,h);out.globalAlpha=.54;out.filter='brightness(.2) blur(1px)';
          out.drawImage(cast,0,0);out.globalAlpha=1;out.filter='none';return;
        }
        const pixels=result.data;
        const radiusX=tw*(.013+.041*growth),radiusY=th*(.0018+.0068*growth);
        for(let y=0;y<h;y++){
          const dy=y-rootY;
          const dist=clamp(dy/(th*.205));
          const softness=.08+.89*dist;
          for(let x=0;x<w;x++){
            const i=y*w+x, j=i*4;
            const bump=heights[i];
            const sx=Math.min(w-1,Math.max(0,x+Math.round(bump*1.8*scale)));
            const sy=Math.min(h-1,Math.max(0,y+Math.round(bump*2.7*scale)));
            const k=(sy*w+sx)*4+3;
            const shade=(crisp[k]*(1-softness)+blurred[k]*softness)/255;
            const dx=(x-rootX)/radiusX,ey=(dy+th*.001)/radiusY;
            const contact=dx*dx+ey*ey;
            const occlusion=contact<9?Math.exp(-contact)*.78:0;
            // Indirect skylight remains visible through the canopy's penumbra.
            const alpha=1-(1-occlusion)*(1-shade*(.85-.22*dist));
            pixels[j]=47;pixels[j+1]=62;pixels[j+2]=83;pixels[j+3]=255*alpha;
          }
        }
        out.putImageData(result,0,0);
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
      this.specimen=this.tree.querySelector('.grove-specimen');
      this.photo=this.tree.querySelector('img');
      const drawRoots=rootGround(this.querySelector('.grove-root-bed'),this.photo);
      this.light=groundLighting(this.stage,this.querySelector('.grove-ground-shadow'),queue,drawRoots);
      this.photo.addEventListener('load',queue,opts);
      const atlas=new Image();
      const init=()=>{
        if(!this.visible || this.tried)return;
        if(!atlas.src){atlas.src='assets/branches-afternoon.webp';return;}
        if(!atlas.naturalWidth)return;
        this.tried=true;
        this.surface=createSurface(this.specimen,atlas);
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
      cancelAnimationFrame(this.frame);this.frame=0;this.surface=null;this.light?.dispose();
    }
    paint(){
      const stage=this.stage, box=this.tree.getBoundingClientRect(), bounds=stage.getBoundingClientRect();
      const staticView=this.motion.matches || !this.surface;
      const p=staticView?1:clamp(-this.getBoundingClientRect().top/Math.max(1,this.offsetHeight-stage.offsetHeight));
      const time=.06+.94*p;
      const {bones,anchors}=this.rig;
      pose(bones,time);
      this.surface?.draw(bones);
      if(this.visible)this.light?.draw(this.surface ? this.specimen : this.photo,box,bounds,p);
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
