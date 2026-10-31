(function(){
  'use strict';
  var progress=document.getElementById('serviceProgress');
  var header=document.querySelector('.service-header');
  var dot=document.getElementById('cursorDot');
  var ring=document.getElementById('cursorRing');
  var burger=document.getElementById('serviceBurger');
  var overlay=document.getElementById('serviceOverlay');
  var mobileMenu=document.getElementById('serviceMobile');
  var fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  function closeMenu(){
    document.body.classList.remove('menu-open');
    if(burger)burger.setAttribute('aria-expanded','false');
    if(burger)burger.setAttribute('aria-label','Open menu');
  }
  if(burger){burger.addEventListener('click',function(){
    var open=document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded',String(open));
    burger.setAttribute('aria-label',open?'Close menu':'Open menu');
  });}
  if(overlay)overlay.addEventListener('click',closeMenu);
  if(mobileMenu)mobileMenu.querySelectorAll('a').forEach(function(link){link.addEventListener('click',closeMenu);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});

  var modal=document.getElementById('consultModal');
  var form=document.getElementById('consultForm');
  var success=modal&&modal.querySelector('.consult-success');
  var closeButton=modal&&modal.querySelector('.consult-close');
  var previousFocus=null;
  function openConsultation(e){
    if(e)e.preventDefault();
    closeMenu();
    previousFocus=document.activeElement;
    modal.classList.add('show');modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    var nameField=form.querySelector('[name="name"]');
    if(nameField)nameField.focus();
  }
  function closeConsultation(){
    if(!modal)return;
    modal.classList.remove('show');modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    if(form){form.reset();form.hidden=false;form.querySelector('.consult-error').textContent='';}
    if(success)success.hidden=true;
    if(previousFocus&&previousFocus.focus)previousFocus.focus();
  }
  document.querySelectorAll('[data-open-consultation]').forEach(function(trigger){trigger.addEventListener('click',openConsultation);});
  if(closeButton)closeButton.addEventListener('click',closeConsultation);
  if(modal)modal.addEventListener('click',function(e){if(e.target===modal)closeConsultation();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal&&modal.classList.contains('show'))closeConsultation();});
  if(form)form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=form.querySelector('[name="name"]').value.trim();
    var mobile=form.querySelector('[name="mobile"]').value.trim();
    var email=form.querySelector('[name="email"]').value.trim();
    var error=form.querySelector('.consult-error');
    if(!name||!mobile||!email){error.textContent='Please fill in all fields.';return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){error.textContent='Please enter a valid email address.';form.querySelector('[name="email"]').focus();return;}
    if(!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g,''))){error.textContent='Please enter a valid 10-digit Indian mobile number.';form.querySelector('[name="mobile"]').focus();return;}
    error.textContent='';form.hidden=true;if(success)success.hidden=false;
  });

  function updateScroll(){
    var doc=document.documentElement;
    var distance=doc.scrollHeight-window.innerHeight;
    if(progress) progress.style.width=(distance>0?window.scrollY/distance*100:0)+'%';
    if(header) header.classList.toggle('scrolled',window.scrollY>32);
  }
  window.addEventListener('scroll',updateScroll,{passive:true});
  updateScroll();

  var reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){
      if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target);}
    });},{threshold:.12,rootMargin:'0px 0px -35px 0px'});
    reveals.forEach(function(el){observer.observe(el);});
  }else{reveals.forEach(function(el){el.classList.add('in');});}

  if(fine&&dot&&ring){
    window.addEventListener('mousemove',function(e){
      dot.style.opacity='1';ring.style.opacity='1';
      dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';
      ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';
      ring.classList.toggle('hover',!!e.target.closest('a,.photo,.hero-image'));
    });
    document.documentElement.addEventListener('mouseleave',function(){dot.style.opacity='0';ring.style.opacity='0';});
  }
})();
