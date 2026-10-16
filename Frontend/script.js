(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s);};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

try{$('#year').textContent=new Date().getFullYear();}catch(e){}

/* preloader — hide as soon as page is ready (CSS also auto-hides as backup) */
try{
  var hidePre=function(){var p=$('#preloader');if(p)p.classList.add('hide');};
  window.addEventListener('load',function(){setTimeout(hidePre,300);});
  setTimeout(hidePre,1200);
}catch(e){}

/* toast */
var toastTimer;
function toast(msg,err){
  try{
    var t=$('#toast');
    t.querySelector('span').textContent=msg;
    t.classList.toggle('err',!!err);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){t.classList.remove('show');},3200);
  }catch(e){}
}
 $$('a[href="#"]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();toast('Demo link — this page is coming soon!');});});

/* custom cursor */
if(fine){
  var dot=$('#cDot'),ring=$('#cRing'),txt=$('#cRing span');
  var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    dot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)';
    dot.style.opacity=1;ring.style.opacity=1;
  });
  (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;
    ring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';
    requestAnimationFrame(loop);})();
  document.addEventListener('mouseover',function(e){
    var special=e.target.closest('[data-cursor]');
    var t=e.target.closest('a,button,input,textarea,select,.wcard,.p-item,.tile,.feature,.step,.mc-btn,.t-btn');
    ring.classList.toggle('texted',!!special);
    if(special)txt.textContent=special.getAttribute('data-cursor');
    ring.classList.toggle('hovered',!!t&&!special);
  });
  document.addEventListener('mousedown',function(){ring.classList.add('pressed');});
  document.addEventListener('mouseup',function(){ring.classList.remove('pressed');});
  document.documentElement.addEventListener('mouseleave',function(){dot.style.opacity=0;ring.style.opacity=0;});
  document.documentElement.addEventListener('mouseenter',function(){dot.style.opacity=1;ring.style.opacity=1;});
}

/* scroll effects */
var header=$('.site-header'),prog=$('#progress'),howBg=$('.how-bg'),
    heroArt=$('.hero-art'),heroCopy=$('.hero-copy'),
    toTop=$('#toTop'),ringFg=$('#ringFg');
var ticking=false;
function onScroll(){
  try{
    header.classList.toggle('scrolled',scrollY>40);
    var h=document.documentElement;
    prog.style.width=(scrollY/(h.scrollHeight-innerHeight)*100)+'%';
    if(scrollY<innerHeight){
      if(heroArt)heroArt.style.transform='translateY('+(scrollY*.12).toFixed(1)+'px)';
      if(heroCopy)heroCopy.style.transform='translateY('+(scrollY*.05).toFixed(1)+'px)';
    }
    if(toTop){
      toTop.classList.toggle('show',scrollY>560);
      var p=scrollY/((h.scrollHeight-innerHeight)||1);
      ringFg.style.strokeDashoffset=(157*(1-p)).toFixed(1);
    }
    if(howBg){
      var r=howBg.parentElement.getBoundingClientRect();
      if(r.top<innerHeight&&r.bottom>0)
        howBg.style.transform='translateY('+Math.max(-90,Math.min(90,(r.top-innerHeight/2)*-.09))+'px)';
    }
  }catch(e){}
  ticking=false;
}
addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(onScroll);ticking=true;}},{passive:true});
toTop.addEventListener('click',function(){scrollTo({top:0,behavior:'smooth'});});

/* mobile menu */
var burger=$('#burger');
function closeMenu(){document.body.classList.remove('menu-open');}
burger.addEventListener('click',function(){document.body.classList.toggle('menu-open');});
 $('#mOverlay').addEventListener('click',closeMenu);
 $$('#mMenu a').forEach(function(a){a.addEventListener('click',closeMenu);});

/* scroll reveal */
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
  });},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  $$('.reveal,.reveal-left,.reveal-right,.reveal-zoom,.reveal-blur').forEach(function(el){io.observe(el);});

  /* title word stagger */
  function splitWords(el){
    var idx=0;
    (function walk(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(ch){
        if(ch.nodeType===3){
          var frag=document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(function(part){
            if(!part.trim()){frag.appendChild(document.createTextNode(' '));return;}
            var w=document.createElement('span');w.className='w';
            var wi=document.createElement('span');wi.className='wi';
            wi.textContent=part;
            wi.style.transitionDelay=(idx++*0.06)+'s';
            w.appendChild(wi);frag.appendChild(w);
          });
          node.replaceChild(frag,ch);
        }else if(ch.nodeType===1&&!ch.classList.contains('w')&&!ch.classList.contains('wi')){
          var w2=document.createElement('span');w2.className='w';
          ch.classList.add('wi');
          ch.style.transitionDelay=(idx++*0.06)+'s';
          node.insertBefore(w2,ch);
          w2.appendChild(ch);
        }
      });
    })(el);
  }
  $$('.sec-title').forEach(splitWords);
  var tio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){e.target.classList.add('t-in');tio.unobserve(e.target);}
  });},{threshold:.4});
  $$('.sec-title').forEach(function(t){tio.observe(t);});

  /* scroll spy */
  var spy=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting)$$('.nav-links a').forEach(function(a){
      a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id);
    });
  });},{rootMargin:'-40% 0px -55% 0px'});
  $$('section[id]').forEach(function(s){spy.observe(s);});
}

/* hero rotating word */
var rot=$('#rotWord');
if(rot){
  var words=['Modular Kitchens','Home Interiors','Wardrobes','Renovations'];
  var rw=0;
  setInterval(function(){
    rot.classList.remove('in');rot.classList.add('out');
    setTimeout(function(){
      rw=(rw+1)%words.length;rot.textContent=words[rw];
      rot.classList.remove('out');rot.classList.add('in');
      setTimeout(function(){rot.classList.remove('in');},420);
    },370);
  },2800);
}

/* magnetic buttons + ripple */
 $$('.btn').forEach(function(b){
  if(fine){
    b.addEventListener('mousemove',function(e){
      var r=b.getBoundingClientRect();
      var dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
      b.style.transform='translate('+(dx*.22).toFixed(1)+'px,'+(dy*.28).toFixed(1)+'px)';
    });
    b.addEventListener('mouseleave',function(){b.style.transform='';});
  }
  b.addEventListener('click',function(e){
    var r=this.getBoundingClientRect(),s=Math.max(r.width,r.height);
    var sp=document.createElement('span');sp.className='ripple';
    sp.style.width=sp.style.height=s+'px';
    sp.style.left=((e.clientX||r.left+r.width/2)-r.left-s/2)+'px';
    sp.style.top=((e.clientY||r.top+r.height/2)-r.top-s/2)+'px';
    this.appendChild(sp);setTimeout(function(){sp.remove();},650);
  });
});

/* spotlight glow */
 $$('.wcard,.feature,.t-slide').forEach(function(card){
  var sp=document.createElement('span');sp.className='spot';card.appendChild(sp);
  card.addEventListener('mousemove',function(e){
    var r=card.getBoundingClientRect();
    card.style.setProperty('--mx',(e.clientX-r.left)+'px');
    card.style.setProperty('--my',(e.clientY-r.top)+'px');
  });
  card.addEventListener('mouseenter',function(){sp.style.opacity=1;});
  card.addEventListener('mouseleave',function(){sp.style.opacity=0;});
});

/* about mini-carousel */
var mcTrack=$('#mcTrack'),mi=0,mcAuto;
function mcVis(){return innerWidth>760?3:2;}
function mcGo(d){
  var max=mcTrack.children.length-mcVis();
  mi=(mi+d+max+1)%(max+1);mcApply();
}
function mcApply(){
  var it=mcTrack.children[0];if(!it)return;
  var w=it.getBoundingClientRect().width+16;
  mcTrack.style.transform='translateX('+(-mi*w)+'px)';
}
 $('#mcPrev').addEventListener('click',function(){mcGo(-1);});
 $('#mcNext').addEventListener('click',function(){mcGo(1);});
addEventListener('resize',mcApply);
function startMc(){clearInterval(mcAuto);mcAuto=setInterval(function(){mcGo(1);},3800);}
startMc();
 $('.mini-carousel').addEventListener('mouseenter',function(){clearInterval(mcAuto);});
 $('.mini-carousel').addEventListener('mouseleave',startMc);

/* service cards */
var cards=$$('.wcard');
cards.forEach(function(c){c.addEventListener('mouseenter',function(){
  cards.forEach(function(x){x.classList.remove('active');});c.classList.add('active');
});});
if(fine)cards.forEach(function(card){
  card.addEventListener('mousemove',function(e){
    var r=card.getBoundingClientRect();
    var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform='translateY(-10px) perspective(900px) rotateX('+(-y*5).toFixed(2)+'deg) rotateY('+(x*5).toFixed(2)+'deg)';
  });
  card.addEventListener('mouseleave',function(){card.style.transform='';});
});

/* testimonial slider */
var tTrack=$('#tTrack'),tSlides=$$('.t-slide'),dotsBox=$('#tDots');
var ti=0,tAuto;
tSlides.forEach(function(_,i){
  var d=document.createElement('button');
  d.className='t-dot'+(i===0?' on':'');
  d.setAttribute('aria-label','Slide '+(i+1));
  d.addEventListener('click',function(){tGo(i);restart();});
  dotsBox.appendChild(d);
});
function tGo(i){
  ti=(i+tSlides.length)%tSlides.length;
  tTrack.style.transform='translateX(-'+(ti*100)+'%)';
  $$('.t-dot',dotsBox).forEach(function(d,k){d.classList.toggle('on',k===ti);});
  var cur=tSlides[ti];
  cur.classList.remove('re-anim');void cur.offsetWidth;cur.classList.add('re-anim');
}
function restart(){clearInterval(tAuto);tAuto=setInterval(function(){tGo(ti+1);},6000);}
 $('#tPrev').addEventListener('click',function(){tGo(ti-1);restart();});
 $('#tNext').addEventListener('click',function(){tGo(ti+1);restart();});
 $('#tSlider').addEventListener('mouseenter',function(){clearInterval(tAuto);});
 $('#tSlider').addEventListener('mouseleave',restart);
restart();

/* confetti */
function confetti(){
  var colors=['#C99A3D','#DDB25C','#1B5248','#0F312B','#F6C21A','#E8632B'];
  for(var i=0;i<70;i++){
    var c=document.createElement('span');c.className='confetti';
    c.style.left=Math.random()*100+'vw';
    c.style.background=colors[i%colors.length];
    c.style.animationDelay=(Math.random()*.4)+'s';
    c.style.animationDuration=(1.8+Math.random()*1.7)+'s';
    document.body.appendChild(c);
    (function(el){setTimeout(function(){el.remove();},4200);})(c);
  }
}

/* consultation modal */
var modal=$('#consultationModal'),openBtn=$('#openConsultationBtn'),closeBtn=$('#closeModal'),form=$('#consultationForm');
function openModal(){modal.classList.add('show');document.body.style.overflow='hidden';}
function closeModal(){modal.classList.remove('show');document.body.style.overflow='';form.classList.remove('submitted');form.reset();}
openBtn.addEventListener('click',openModal);
closeBtn.addEventListener('click',closeModal);
modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('show'))closeModal();});

form.addEventListener('submit',function(e){
  e.preventDefault();
  var name=$('#consultName').value.trim();
  var mobile=$('#consultMobile').value.trim();
  var email=$('#consultEmail').value.trim();
  if(!name||!mobile||!email){
    toast('Please fill in all fields',true);return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){
    toast('Please enter a valid email address',true);return;
  }
  if(!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g,''))){
    toast('Please enter a valid 10-digit Indian mobile number',true);return;
  }
  form.classList.add('submitted');
  confetti();
  toast('🎉 Consultation booked successfully! We\'ll contact you soon.');
  setTimeout(closeModal,3000);
});

/* newsletter */
var nlForm=$('#nlForm'),nlEmail=$('#nlEmail');
nlForm.addEventListener('submit',function(e){
  e.preventDefault();
  var v=nlEmail.value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){
    var f=$('.nl-fields',nlForm);
    f.classList.add('shake');setTimeout(function(){f.classList.remove('shake');},500);
    toast('Please enter a valid email address',true);nlEmail.focus();return;
  }
  nlForm.classList.add('done');
  confetti();
  toast('🎉 Subscribed successfully — welcome to the Phinix family!');
});
})();