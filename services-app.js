(function () {
  'use strict';
  var catalog = window.CSServiceCatalog;
  if (!catalog || !Array.isArray(catalog.worlds)) return;

  var tabs = document.getElementById('world-tabs');
  var panel = document.getElementById('world-panel');
  var tabFocusPending = false;

  function el(tag, className, text) {
    var item = document.createElement(tag);
    if (className) item.className = className;
    if (text != null) item.textContent = text;
    return item;
  }

  function worldById(id) {
    return catalog.worlds.find(function (world) { return world.id === id; }) || catalog.worlds[0];
  }

  function priceKind(price) {
    if (price.kind === 'exact' && price.cadence === 'one-time') return 'Current one-time website price';
    if (price.kind === 'quote-baseline') return 'Scope quote · current website amount retained as an unconfirmed baseline';
    if (price.kind === 'from') return 'From-price · final scope and billing confirmed before work';
    return 'Quote-only · scoped to the brief';
  }

  function list(items, className) {
    var ul = el('ul', className || 'package-list');
    items.forEach(function (item) { ul.appendChild(el('li', '', item)); });
    return ul;
  }

  function chips(items) {
    var wrap = el('div', 'chip-list');
    items.forEach(function (item) { wrap.appendChild(el('span', 'chip', item)); });
    return wrap;
  }

  function renderTabs(activeId) {
    tabs.textContent = '';
    catalog.worlds.forEach(function (world, index) {
      var link = el('a', 'world-tab');
      link.href = '#' + world.id;
      link.id = 'tab-' + world.id;
      link.setAttribute('role', 'tab');
      link.setAttribute('aria-controls', 'panel-' + world.id);
      link.setAttribute('aria-selected', String(world.id === activeId));
      link.tabIndex = world.id === activeId ? 0 : -1;
      link.appendChild(el('span', 'world-index', String(index + 1).padStart(2, '0')));
      link.appendChild(el('span', 'world-name', world.name));
      link.appendChild(el('span', 'world-short', world.short));
      tabs.appendChild(link);
    });
  }

  function renderServices(world, target) {
    var section = el('section', 'subsection');
    section.appendChild(el('h3', 'subsection-title', 'Owned services'));
    var grid = el('div', 'service-grid');
    world.services.forEach(function (service) {
      var card = el('article', 'service-card');
      card.appendChild(el('h3', '', service.name));
      card.appendChild(el('p', '', service.summary));
      var deliverables = el('div', 'deliverables');
      service.deliverables.forEach(function (item) { deliverables.appendChild(el('span', '', item)); });
      card.appendChild(deliverables);
      grid.appendChild(card);
    });
    section.appendChild(grid);
    target.appendChild(section);
  }

  function renderBoundaries(world, target) {
    var section = el('section', 'subsection');
    section.appendChild(el('h3', 'subsection-title', 'Clear boundaries'));
    var grid = el('div', 'boundary');
    var owns = el('div', 'boundary-box');
    owns.appendChild(el('h4', 'mini-title', 'This world owns'));
    owns.appendChild(list(world.services.map(function (service) { return service.name; })));
    grid.appendChild(owns);
    var excludes = el('div', 'boundary-box excludes');
    excludes.appendChild(el('h4', 'mini-title', 'Routed to a paired world'));
    excludes.appendChild(list(world.boundaries));
    grid.appendChild(excludes);
    section.appendChild(grid);
    target.appendChild(section);
  }

  function renderPackages(world, target) {
    var section = el('section', 'subsection');
    section.appendChild(el('h3', 'subsection-title', 'Three ways to start'));
    var grid = el('div', 'package-grid');
    world.packages.forEach(function (pkg) {
      var card = el('article', 'package-card' + (pkg.featured ? ' featured' : ''));
      card.appendChild(el('h3', '', pkg.name));
      card.appendChild(el('div', 'package-price', pkg.price.display));
      card.appendChild(el('span', 'price-kind', priceKind(pkg.price)));
      card.appendChild(el('p', 'package-best', pkg.bestFor));
      var includeGroup = el('div', 'package-group');
      includeGroup.appendChild(el('h4', 'mini-title', 'Included'));
      includeGroup.appendChild(list(pkg.includes));
      card.appendChild(includeGroup);
      var excludeGroup = el('div', 'package-group');
      excludeGroup.appendChild(el('h4', 'mini-title', 'Not included'));
      excludeGroup.appendChild(list(pkg.excludes, 'package-list excludes'));
      card.appendChild(excludeGroup);
      card.appendChild(el('div', 'package-version', 'Package v' + pkg.version + ' · verified ' + catalog.lastVerified));
      grid.appendChild(card);
    });
    section.appendChild(grid);

    target.appendChild(section);
  }

  function renderPaired(world, target) {
    var section = el('section', 'subsection');
    section.appendChild(el('h3', 'subsection-title', 'Often paired with'));
    var wrap = el('div', 'paired');
    world.pairedWorlds.forEach(function (id) {
      var paired = worldById(id);
      var link = el('a', 'paired-link', paired.name + ' · ' + paired.short + ' →');
      link.href = '#' + paired.id;
      wrap.appendChild(link);
    });
    section.appendChild(wrap);
    target.appendChild(section);
  }

  function renderWorld(id, focus) {
    var world = worldById(id);
    renderTabs(world.id);
    panel.textContent = '';
    var article = el('article', 'world-panel');
    article.id = 'panel-' + world.id;
    article.setAttribute('role', 'tabpanel');
    article.setAttribute('aria-labelledby', 'tab-' + world.id);
    var top = el('div', 'world-panel-top');
    var copy = el('div');
    copy.appendChild(el('span', 'world-label', world.short));
    var title = el('h2', '', world.name);
    title.tabIndex = -1;
    copy.appendChild(title);
    copy.appendChild(el('p', 'world-promise', world.promise));
    copy.appendChild(el('p', 'world-description', world.description));
    top.appendChild(copy);
    var best = el('aside', 'best-fit');
    best.appendChild(el('h3', 'mini-title', 'Best fit'));
    best.appendChild(chips(world.bestFit));
    top.appendChild(best);
    article.appendChild(top);
    renderServices(world, article);
    renderBoundaries(world, article);
    renderPackages(world, article);
    renderPaired(world, article);
    var cta = el('div', 'world-cta');
    cta.appendChild(el('p', '', 'Have a brief that fits ' + world.name + '? We will confirm scope, ownership and the right starting package before production.'));
    var articleWord = /^[aeiou]/i.test(world.name) ? 'an ' : 'a ';
    var ctaLink = el('a', 'primary-cta', 'Start ' + articleWord + world.name + ' project →');
    ctaLink.href = 'mailto:' + catalog.contactEmail + '?subject=' + encodeURIComponent(world.name + ' project enquiry');
    cta.appendChild(ctaLink);
    article.appendChild(cta);
    panel.appendChild(article);
    document.title = world.name + ' Services & Packages — CS Media & Production';
    if (focus) requestAnimationFrame(function () { title.focus({ preventScroll: true }); });
  }

  function activeId() {
    var requested = location.hash.replace(/^#/, '');
    return catalog.worlds.some(function (world) { return world.id === requested; }) ? requested : catalog.worlds[0].id;
  }

  tabs.addEventListener('keydown', function (event) {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(event.key) === -1) return;
    var current = catalog.worlds.findIndex(function (world) { return world.id === activeId(); });
    var next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = catalog.worlds.length - 1;
    else {
      var direction = event.key === 'ArrowRight' ? 1 : -1;
      next = (current + direction + catalog.worlds.length) % catalog.worlds.length;
    }
    event.preventDefault();
    var nextId = catalog.worlds[next].id;
    tabFocusPending = true;
    if (location.hash === '#' + nextId) {
      tabFocusPending = false;
      renderWorld(nextId, false);
      requestAnimationFrame(function () {
        var sameTab = document.getElementById('tab-' + nextId);
        if (sameTab) sameTab.focus();
      });
    } else location.hash = nextId;
  });
  window.addEventListener('hashchange', function () {
    var keepTabFocus = tabFocusPending;
    tabFocusPending = false;
    renderWorld(activeId(), !keepTabFocus);
    if (keepTabFocus) requestAnimationFrame(function () {
      var activeTab = document.getElementById('tab-' + activeId());
      if (activeTab) activeTab.focus();
    });
  });
  renderWorld(activeId(), false);
}());
