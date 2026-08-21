/* Hash-driven controller for creative-resources.html. URLs stay in knowledge-resources.js. */
(function () {
  'use strict';

  var manifest = window.CSKnowledgeResources;
  if (!manifest || !Array.isArray(manifest.categories)) return;

  var STORAGE_FAVORITES = 'cs_knowledge_favorites_v1';
  var STORAGE_RECENTS = 'cs_knowledge_recents_v1';
  var scene = document.getElementById('app-scene');
  var panel = document.getElementById('utility-panel');
  var panelShade = document.getElementById('panel-shade');
  var panelTitle = document.getElementById('panel-title');
  var panelBody = document.getElementById('panel-body');
  var panelClose = document.getElementById('panel-close');
  var favoriteCount = document.getElementById('favorite-count');
  var favorites = readArray(STORAGE_FAVORITES);
  var recents = readArray(STORAGE_RECENTS);
  var currentPanel = '';
  var panelTrigger = null;
  var flatResources = [];

  manifest.categories.forEach(function (category) {
    category.resources.forEach(function (resource, index) {
      flatResources.push({ category: category, resource: resource, index: index });
    });
  });

  function readArray(key) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) { return []; }
  }

  function saveArray(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) {}
  }

  function el(tag, className, text) {
    var item = document.createElement(tag);
    if (className) item.className = className;
    if (text != null) item.textContent = text;
    return item;
  }

  function pad(number) { return String(number).padStart(2, '0'); }
  function resourceKey(categoryId, resourceId) { return categoryId + '/' + resourceId; }
  function isFavorite(key) { return favorites.indexOf(key) !== -1; }
  function categoryById(id) {
    return manifest.categories.find(function (category) { return category.id === id; });
  }
  function resourceById(category, id) {
    return category && category.resources.find(function (resource) { return resource.id === id; });
  }
  function hostname(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (error) { return url; }
  }
  function statusLabel(resource) {
    if (resource.status === 'unavailable') return 'Unavailable';
    if (resource.status === 'archived') return 'Archived';
    if (resource.status === 'moved') return 'Moved';
    return '';
  }

  function internalLink(className, label, hash) {
    var link = el('a', className, label);
    link.href = hash;
    link.setAttribute('data-nav', '');
    return link;
  }

  function externalLink(className, label, url, trackingName) {
    var link = el('a', className, label);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.dataset.trackName = trackingName || label;
    link.dataset.trackUrl = url;
    return link;
  }

  function parseState() {
    var raw = location.hash.replace(/^#/, '') || 'hub';
    var parts = raw.split('/').map(function (part) {
      try { return decodeURIComponent(part); } catch (error) { return part; }
    });
    if (parts[0] === 'branch' && categoryById(parts[1])) {
      return { view: 'branch', category: categoryById(parts[1]), resource: null };
    }
    if (parts[0] === 'resource') {
      var category = categoryById(parts[1]);
      var resource = resourceById(category, parts[2]);
      if (category && resource) return { view: 'resource', category: category, resource: resource };
    }
    return { view: 'hub', category: null, resource: null };
  }

  function hashForResource(category, resource) {
    return '#resource/' + encodeURIComponent(category.id) + '/' + encodeURIComponent(resource.id);
  }

  function updateFavoriteCount() {
    favoriteCount.textContent = String(favorites.length);
  }

  function remember(name, url) {
    if (!url) return;
    recents = recents.filter(function (item) { return item && item.url !== url; });
    recents.unshift({ name: name, url: url });
    recents = recents.slice(0, 8);
    saveArray(STORAGE_RECENTS, recents);
    if (currentPanel === 'recents') renderPanel('recents');
  }

  function renderHub() {
    var view = el('section', 'view hub');
    view.setAttribute('aria-labelledby', 'view-title');

    var top = el('div', 'view-top');
    top.appendChild(el('span', 'view-kicker mono', 'Creative systems map'));
    top.appendChild(el('span', 'crumb mono', '51 resources · 5 branches'));
    view.appendChild(top);

    var map = el('div', 'hub-map');
    var core = el('div', 'core');
    core.appendChild(el('span', 'core-kicker mono', 'Complete creative roadmap'));
    var title = el('h1', '', 'Creative Knowledge');
    title.id = 'view-title';
    title.tabIndex = -1;
    core.appendChild(title);
    core.appendChild(el('p', '', 'One connected shortcut system for daily creative work.'));
    map.appendChild(core);

    var list = el('nav', 'branch-list');
    list.setAttribute('aria-label', 'Creative knowledge branches');
    manifest.categories.forEach(function (category, index) {
      var link = internalLink('branch', '', '#branch/' + encodeURIComponent(category.id));
      link.setAttribute('aria-label', 'Open ' + category.name + ', ' + category.resources.length + ' resources');
      link.appendChild(el('span', 'branch-num mono', pad(index + 1)));
      var copy = el('span', 'branch-copy');
      copy.appendChild(el('span', 'branch-name', category.name));
      copy.appendChild(el('span', 'branch-desc', category.description));
      link.appendChild(copy);
      link.appendChild(el('span', 'branch-arrow', '→'));
      list.appendChild(link);
    });
    map.appendChild(list);
    view.appendChild(map);
    view.appendChild(el('p', 'hint mono', 'Select a branch to begin · Search, favorites and recent links stay one click away'));
    return view;
  }

  function renderRail(category, activeResource) {
    var rail = el('nav', 'resource-rail');
    rail.setAttribute('aria-label', category.name + ' resources');
    rail.appendChild(el('h2', 'rail-title', category.name));
    var list = el('div', 'rail-list');
    list.style.setProperty('--resource-count', String(category.resources.length));
    var activeIndex = category.resources.indexOf(activeResource);
    var progress = el('span', 'rail-progress');
    progress.setAttribute('aria-hidden', 'true');
    progress.style.setProperty('--progress', (category.resources.length > 1 ? (activeIndex / (category.resources.length - 1)) * 90 : 0) + '%');
    list.appendChild(progress);
    category.resources.forEach(function (resource, index) {
      var link = internalLink('rail-item', '', hashForResource(category, resource));
      if (resource === activeResource) link.setAttribute('aria-current', 'step');
      link.setAttribute('aria-label', pad(index + 1) + ', ' + resource.name);
      link.appendChild(el('span', 'rail-index mono', pad(index + 1)));
      link.appendChild(el('span', 'rail-name', resource.name));
      list.appendChild(link);
    });
    rail.appendChild(list);
    return rail;
  }

  function renderDetail(category, resource) {
    var index = category.resources.indexOf(resource);
    var key = resourceKey(category.id, resource.id);
    var card = el('article', 'detail-card');
    card.setAttribute('aria-labelledby', 'view-title');
    var scroll = el('div', 'detail-scroll');
    var position = el('div', 'resource-position');
    position.appendChild(el('span', 'big-number', pad(index + 1)));
    position.appendChild(el('span', 'position-total mono', '/ ' + pad(category.resources.length)));
    scroll.appendChild(position);

    var statusRow = el('div', 'status-row');
    var status = statusLabel(resource);
    if (status) statusRow.appendChild(el('span', 'status mono', status));
    else statusRow.appendChild(el('span', 'official mono', 'Direct resource'));
    scroll.appendChild(statusRow);

    var title = el('h1', 'resource-title', resource.name);
    title.id = 'view-title';
    title.tabIndex = -1;
    scroll.appendChild(title);
    scroll.appendChild(el('p', 'resource-note', resource.note || ('Direct access to ' + resource.name + ' from the Creative Knowledge Library.')));
    scroll.appendChild(el('span', 'destination mono', resource.status === 'unavailable' ? 'Original destination currently unavailable' : hostname(resource.url)));

    var actions = el('div', 'resource-actions');
    if (resource.status === 'unavailable') {
      var unavailable = el('span', 'external disabled', 'Homepage unavailable');
      unavailable.setAttribute('aria-disabled', 'true');
      actions.appendChild(unavailable);
    } else {
      var homepage = externalLink('external', 'Open homepage ↗', resource.url, resource.name);
      homepage.setAttribute('aria-label', 'Open ' + resource.name + ' homepage in a new tab');
      actions.appendChild(homepage);
    }
    var favorite = el('button', 'favorite', isFavorite(key) ? '★' : '☆');
    favorite.type = 'button';
    favorite.dataset.favorite = key;
    favorite.setAttribute('aria-pressed', String(isFavorite(key)));
    favorite.setAttribute('aria-label', (isFavorite(key) ? 'Remove ' : 'Add ') + resource.name + (isFavorite(key) ? ' from' : ' to') + ' favorites');
    if (resource.status === 'unavailable') {
      favorite.disabled = true;
      favorite.setAttribute('aria-label', resource.name + ' is unavailable and cannot be favorited');
    }
    actions.appendChild(favorite);
    scroll.appendChild(actions);

    if (resource.actions && resource.actions.length) {
      scroll.appendChild(el('h2', 'shortcut-heading mono', 'Quick actions'));
      var shortcuts = el('div', 'shortcuts');
      resource.actions.forEach(function (action) {
        var shortcut = externalLink('shortcut', action.name + ' ↗', action.url, resource.name + ' · ' + action.name);
        shortcut.setAttribute('aria-label', resource.name + ': ' + action.name + ' (opens in a new tab)');
        shortcuts.appendChild(shortcut);
      });
      scroll.appendChild(shortcuts);
    }
    card.appendChild(scroll);

    var controls = el('nav', 'step-controls');
    controls.setAttribute('aria-label', 'Resource navigation');
    if (index > 0) controls.appendChild(internalLink('step', '‹ Prev', hashForResource(category, category.resources[index - 1])));
    else {
      var previous = el('span', 'step disabled', '‹ Prev');
      previous.setAttribute('aria-disabled', 'true');
      controls.appendChild(previous);
    }
    if (index < category.resources.length - 1) controls.appendChild(internalLink('step', 'Next ›', hashForResource(category, category.resources[index + 1])));
    else {
      var next = el('span', 'step disabled', 'Next ›');
      next.setAttribute('aria-disabled', 'true');
      controls.appendChild(next);
    }
    card.appendChild(controls);
    return card;
  }

  function renderBranch(state) {
    var category = state.category;
    var resource = state.resource || category.resources[0];
    var view = el('section', 'view branch-view');
    var top = el('div', 'view-top');
    top.appendChild(el('span', 'crumb mono', 'Creative Knowledge › ' + category.name));
    top.appendChild(internalLink('all-branches', '‹ All branches', '#hub'));
    view.appendChild(top);
    var layout = el('div', 'branch-layout');
    layout.appendChild(renderRail(category, resource));
    layout.appendChild(renderDetail(category, resource));
    view.appendChild(layout);
    view.appendChild(el('p', 'branch-hint mono', 'Use arrows or select a resource · External links open in a new tab · Esc returns to all branches'));
    return view;
  }

  function render(focusHeading) {
    var state = parseState();
    scene.textContent = '';
    scene.appendChild(state.view === 'hub' ? renderHub() : renderBranch(state));
    document.title = state.view === 'hub' ? 'Creative Knowledge Library — CS Media & Production' : ((state.resource ? state.resource.name : state.category.name) + ' — Creative Knowledge Library');
    updateFavoriteCount();
    if (state.view !== 'hub') {
      requestAnimationFrame(function () {
        var active = scene.querySelector('.rail-item[aria-current="step"]');
        if (active) active.scrollIntoView({ block: 'nearest', inline: 'center' });
      });
    }
    if (focusHeading) requestAnimationFrame(function () {
      var heading = document.getElementById('view-title');
      if (heading) heading.focus({ preventScroll: true });
    });
  }

  function resultRow(entry) {
    var category = entry.category;
    var resource = entry.resource;
    var row = el('div', 'panel-result');
    var mapLink = internalLink('result-map', '', hashForResource(category, resource));
    mapLink.appendChild(el('span', 'result-name', resource.name));
    mapLink.appendChild(el('span', 'result-meta', category.name + (statusLabel(resource) ? ' · ' + statusLabel(resource) : '')));
    row.appendChild(mapLink);
    if (resource.status === 'unavailable') {
      var disabled = el('span', 'result-open disabled', '—');
      disabled.setAttribute('aria-label', resource.name + ' is unavailable');
      row.appendChild(disabled);
    } else {
      var open = externalLink('result-open', '↗', resource.url, resource.name);
      open.setAttribute('aria-label', 'Open ' + resource.name + ' in a new tab');
      row.appendChild(open);
    }
    return row;
  }

  function renderSearchPanel() {
    var input = el('input', 'panel-search');
    input.type = 'search';
    input.autocomplete = 'off';
    input.placeholder = 'Search resources, branches or actions…';
    input.setAttribute('aria-label', 'Search all resources');
    var summary = el('p', 'panel-summary');
    summary.setAttribute('role', 'status');
    summary.setAttribute('aria-live', 'polite');
    var list = el('div', 'panel-list');
    panelBody.appendChild(input);
    panelBody.appendChild(summary);
    panelBody.appendChild(list);

    function update() {
      var query = input.value.trim().toLowerCase();
      var matches = flatResources.filter(function (entry) {
        var actionNames = (entry.resource.actions || []).map(function (action) { return action.name; }).join(' ');
        return !query || [entry.resource.name, entry.category.name, entry.category.description, entry.resource.note || '', actionNames].join(' ').toLowerCase().indexOf(query) !== -1;
      });
      list.textContent = '';
      matches.forEach(function (entry) { list.appendChild(resultRow(entry)); });
      summary.textContent = matches.length + ' of ' + flatResources.length + ' resources';
      if (!matches.length) list.appendChild(el('p', 'panel-empty', 'No matching resources. Try a shorter search.'));
    }
    input.addEventListener('input', update);
    update();
    requestAnimationFrame(function () { input.focus(); });
  }

  function renderFavoritesPanel() {
    var entries = flatResources.filter(function (entry) {
      return isFavorite(resourceKey(entry.category.id, entry.resource.id));
    });
    if (!entries.length) {
      panelBody.appendChild(el('p', 'panel-empty', 'No favorites yet. Open a resource and select the star to keep it here.'));
      return;
    }
    var list = el('div', 'panel-list');
    entries.forEach(function (entry) { list.appendChild(resultRow(entry)); });
    panelBody.appendChild(list);
  }

  function renderRecentsPanel() {
    var valid = recents.filter(function (item) { return item && item.name && item.url; });
    if (!valid.length) {
      panelBody.appendChild(el('p', 'panel-empty', 'Nothing opened yet. Homepage and shortcut links will appear here.'));
      return;
    }
    var list = el('div', 'panel-list');
    valid.forEach(function (item) {
      var link = externalLink('recent-link', '', item.url, item.name);
      link.appendChild(el('span', '', item.name));
      link.setAttribute('aria-label', 'Reopen ' + item.name + ' in a new tab');
      list.appendChild(link);
    });
    panelBody.appendChild(list);
  }

  function renderPanel(type) {
    panelBody.textContent = '';
    panelTitle.textContent = type === 'search' ? 'Search library' : type === 'favorites' ? 'Favorites' : 'Recently opened';
    if (type === 'search') renderSearchPanel();
    else if (type === 'favorites') renderFavoritesPanel();
    else renderRecentsPanel();
  }

  function openPanel(type, trigger) {
    if (currentPanel === type) { closePanel(); return; }
    currentPanel = type;
    panelTrigger = trigger || panelTrigger;
    document.querySelectorAll('[data-panel-trigger]').forEach(function (button) {
      button.setAttribute('aria-expanded', String(button.dataset.panelTrigger === type));
    });
    renderPanel(type);
    panel.classList.add('open');
    panelShade.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    panel.inert = false;
    scene.inert = true;
    panelClose.focus();
  }

  function closePanel(restoreFocus) {
    if (!currentPanel) return;
    currentPanel = '';
    panel.classList.remove('open');
    panelShade.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
    scene.inert = false;
    document.querySelectorAll('[data-panel-trigger]').forEach(function (button) { button.setAttribute('aria-expanded', 'false'); });
    if (restoreFocus !== false && panelTrigger) panelTrigger.focus();
  }

  function moveResource(direction) {
    var state = parseState();
    if (state.view === 'hub') return;
    var active = state.resource || state.category.resources[0];
    var index = state.category.resources.indexOf(active);
    var next = Math.max(0, Math.min(state.category.resources.length - 1, index + direction));
    if (next !== index) location.hash = hashForResource(state.category, state.category.resources[next]);
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-panel-trigger]');
    if (trigger) { openPanel(trigger.dataset.panelTrigger, trigger); return; }
    var favoriteButton = event.target.closest('[data-favorite]');
    if (favoriteButton && !favoriteButton.disabled) {
      var key = favoriteButton.dataset.favorite;
      if (isFavorite(key)) favorites = favorites.filter(function (item) { return item !== key; });
      else favorites.push(key);
      saveArray(STORAGE_FAVORITES, favorites);
      updateFavoriteCount();
      render(false);
      var replacementFavorite = scene.querySelector('[data-favorite="' + key + '"]');
      if (replacementFavorite) replacementFavorite.focus();
      if (currentPanel) renderPanel(currentPanel);
      return;
    }
    var tracked = event.target.closest('[data-track-url]');
    if (tracked) remember(tracked.dataset.trackName, tracked.dataset.trackUrl);
    var navigation = event.target.closest('[data-nav]');
    if (navigation && currentPanel) closePanel(false);
  });

  document.addEventListener('auxclick', function (event) {
    var tracked = event.target.closest('[data-track-url]');
    if (tracked && event.button === 1) remember(tracked.dataset.trackName, tracked.dataset.trackUrl);
  });

  document.addEventListener('keydown', function (event) {
    if (currentPanel) {
      if (event.key === 'Escape') { event.preventDefault(); closePanel(); return; }
      if (event.key === 'Tab') {
        var focusable = panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled])');
        if (!focusable.length) return;
        var first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
      return;
    }
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (document.activeElement && document.activeElement.isContentEditable)) return;
    if (event.key === 'Escape' && parseState().view !== 'hub') {
      event.preventDefault(); location.hash = '#hub';
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      if (parseState().view !== 'hub') { event.preventDefault(); moveResource(-1); }
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      if (parseState().view !== 'hub') { event.preventDefault(); moveResource(1); }
    }
  });

  panelClose.addEventListener('click', function () { closePanel(); });
  panelShade.addEventListener('click', function () { closePanel(); });
  window.addEventListener('hashchange', function () { render(true); });

  if (!location.hash) history.replaceState(null, '', '#hub');
  updateFavoriteCount();
  render(false);
}());
