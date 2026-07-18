(function(){
  "use strict";

  /* ---- 手機導覽開合 ---- */
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? '關閉 ×' : '選單 ＋';
  });
  /* 點連結後收起手機選單 */
  links.addEventListener('click', function(e){
    if(e.target.closest('.navlink') && links.classList.contains('open')){
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.textContent = '選單 ＋';
    }
  });

  /* ---- 履歷 placeholder：明確告知尚未提供 ---- */
  function resumeNotice(e){
    e.preventDefault();
    alert('履歷 PDF 尚未提供。正式部署時將替換為實際檔案路徑（例如 /assets/陳家輝_履歷.pdf）。');
  }
  ['resumeBtn','resumeBtn2'].forEach(function(id){
    var el = document.getElementById(id);
    if(el){ el.addEventListener('click', resumeNotice); }
  });

  /* ---- Scrollspy：導覽 active 狀態 ---- */
  var sections = ['about','capabilities','projects','experience','skills','contact'];
  var navMap = {};
  document.querySelectorAll('.navlink').forEach(function(a){
    var id = a.getAttribute('href').slice(1);
    navMap[id] = a;
  });
  function setCurrent(id){
    Object.keys(navMap).forEach(function(k){
      navMap[k].setAttribute('aria-current', k===id ? 'true' : 'false');
    });
  }
  if('IntersectionObserver' in window){
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var id = en.target.id;
          /* more / education 併入鄰近項目 */
          if(id==='more') id='projects';
          if(id==='education') id='skills';
          if(navMap[id]) setCurrent(id);
        }
      });
    }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });
    ['about','capabilities','projects','more','experience','skills','education','contact'].forEach(function(id){
      var el=document.getElementById(id); if(el) spy.observe(el);
    });
  }

  /* ---- Reveal on scroll（尊重 reduced-motion） ---- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if(reduce || !('IntersectionObserver' in window)){
    revealEls.forEach(function(el){ el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { threshold:0.12 });
    revealEls.forEach(function(el){ ro.observe(el); });
  }
})();
