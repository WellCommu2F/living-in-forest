/* 《生活在林间》· 交互脚本 */
(function () {
  'use strict';

  var THEME_KEY = 'forest-theme';
  var ACCESS_KEY = 'forest-access';
  // ★ 内测访问口令：修改这一行的字符串即可更换口令。
  // 注意：这是纯前端的轻量访问控制，用于挡住无意访问者与搜索引擎；
  // 它不能抵御有意破解（源码可读）。真正的保密请依赖服务器端鉴权。
  var ACCESS_PASSWORD = 'linjian2026';

  /* ---------- 主题切换 ---------- */
  function currentIsDark() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    syncToggleLabel(dark);
  }

  function syncToggleLabel(dark) {
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = dark ? '☀ 日间' : '☾ 夜间';
    }
  }

  function initTheme() {
    applyTheme(currentIsDark());
  }

  function toggleTheme() {
    var dark = !currentIsDark();
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    applyTheme(dark);
  }

  function bindThemeButtons() {
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', toggleTheme);
    }
  }

  /* ---------- 移动端侧边栏 ---------- */
  function initMobileNav() {
    var sidebar = document.querySelector('.sidebar');
    var menuBtn = document.querySelector('.menu-btn');
    var overlay = document.querySelector('.overlay');

    if (!sidebar) return;

    function open() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('show');
    }
    function close() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
    }

    if (menuBtn) menuBtn.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) close(); else open();
    });
    if (overlay) overlay.addEventListener('click', close);

    // 点击侧边栏内链接后自动收起
    var links = sidebar.querySelectorAll('nav a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        if (window.innerWidth <= 900) close();
      });
    }
  }

  /* ---------- 目录章节滚动高亮（简单版） ---------- */
  function initScrollSpy() {
    var nav = document.querySelector('.sidebar nav');
    if (!nav) return;
    var links = nav.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    var sections = [];
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, top: el.offsetTop, link: links[i] });
    }

    function onScroll() {
      var y = window.scrollY + 80;
      var current = null;
      for (var j = 0; j < sections.length; j++) {
        if (sections[j].top <= y) current = sections[j];
      }
      if (!current) return;
      for (var k = 0; k < sections.length; k++) {
        sections[k].link.style.fontWeight = (sections[k] === current) ? '700' : '';
        sections[k].link.style.color = (sections[k] === current) ? '#fff' : '';
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 访问控制（内测密码门） ---------- */
  function initAccessGate() {
    var gate = document.getElementById('access-gate');
    if (!gate) return;

    // 已通过验证则不显示遮罩
    if (sessionStorage.getItem(ACCESS_KEY) === 'ok') {
      gate.style.display = 'none';
      return;
    }

    var input = document.getElementById('access-input');
    var submit = document.getElementById('access-submit');
    var msg = document.getElementById('access-msg');

    function tryEnter() {
      var v = (input.value || '').trim();
      if (v === ACCESS_PASSWORD) {
        sessionStorage.setItem(ACCESS_KEY, 'ok');
        gate.style.display = 'none';
      } else {
        msg.textContent = '口令不正确，请重试。';
        input.value = '';
        input.focus();
      }
    }

    if (submit) submit.addEventListener('click', tryEnter);
    if (input) input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryEnter();
    });
    if (input) input.focus();
  }

  /* ---------- 阅读进度标记（本地保存） ---------- */
  var READ_KEY = 'forest-read';

  function initProgress() {
    var read = {};
    try { read = JSON.parse(localStorage.getItem(READ_KEY) || '{}'); } catch (e) { read = {}; }

    var sections = document.querySelectorAll('section[id^="ch"]');
    for (var i = 0; i < sections.length; i++) {
      var sec = sections[i];
      var id = sec.id;
      var h1 = sec.querySelector('h1');
      if (!h1) continue;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'read-toggle' + (read[id] ? ' read' : '');
      btn.textContent = read[id] ? '✓ 已读' : '标记已读';
      btn.setAttribute('aria-label', '标记本章已读');

      btn.addEventListener('click', function (sid, el) {
        return function () {
          var r = {};
          try { r = JSON.parse(localStorage.getItem(READ_KEY) || '{}'); } catch (e) { r = {}; }
          var now = !r[sid];
          r[sid] = now;
          localStorage.setItem(READ_KEY, JSON.stringify(r));
          el.className = 'read-toggle' + (now ? ' read' : '');
          el.textContent = now ? '✓ 已读' : '标记已读';
        };
      }(id, btn));

      h1.appendChild(btn);
    }
  }

  /* ---------- 导出 / 打印 ---------- */
  function initExport() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'export-btn';
    btn.textContent = '⎙ 导出 / 打印（另存 PDF）';
    btn.addEventListener('click', function () { window.print(); });

    var sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      var themeBtn = sidebar.querySelector('.theme-toggle');
      if (themeBtn) themeBtn.insertAdjacentElement('afterend', btn);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initAccessGate();
    initTheme();
    bindThemeButtons();
    initMobileNav();
    initScrollSpy();
    initProgress();
    initExport();
  });
})();
