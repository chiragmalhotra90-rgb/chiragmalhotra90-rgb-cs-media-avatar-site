/* UI controller for creative-resources.html. Data lives in knowledge-resources.js. */
(function () {
  'use strict';

  var manifest = window.CSKnowledgeResources;
  if (!manifest || !Array.isArray(manifest.categories)) return;

  var STORAGE_FAVORITES = 'cs_knowledge_favorites_v1';
  var STORAGE_RECENTS = 'cs_knowledge_recents_v1';
  var flow = document.getElementById('resource-flow');
  var filters = document.getElementById('filters');
  var search = document.getElementById('resource-search');
  var clearSearch = document.getElementById('clear-search');
  var resultNote = document.getElementById('result-note');
  var empty = document.getElementById('empty');
  var recentWrap = document.getElementById('recent-wrap');
  var recentList = document.getElementById('recent-list');
  var totalNode = document.getElementById('resource-total');
  var selected = 'all';
  var favorites = readArray(STORAGE_FAVORITES);
  var recents = readArray(STORAGE_RECENTS);
  var total = manifest.categories.reduce(function (sum, category) {
    return sum + category.resources.length;
  }, 0);

  totalNode.textContent = String(total);

  function readArray(key) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function saveArray(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) {}
  }

  function node(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }

  function keyFor(categoryId, resourceId) {
    return categoryId + '/' + resourceId;
  }

  function isFavorite(key) {
    return favorites.indexOf(key) !== -1;
  }

  function externalLink(className, label, url) {
    var link = node('a', className, label);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  function makeFilter(id, label) {
    var button = node('button', 'filter', label);
    button.type = 'button';
    button.dataset.filter = id;
    button.setAttribute('aria-pressed', String(selected === id));
    return button;
  }

  function renderFilters() {
    filters.textContent = '';
    filters.appendChild(makeFilter('all', 'All resources'));
    filters.appendChild(makeFilter('favorites', '★ Favorites (' + favorites.length + ')'));
    manifest.categories.forEach(function (category) {
      filters.appendChild(makeFilter(category.id, category.name));
    });
  }

  function matches(resource, category, query, resourceKey) {
    if (selected === 'favorites' && !isFavorite(resourceKey)) return false;
    if (selected !== 'all' && selected !== 'favorites' && selected !== category.id) return false;
    if (!query) return true;
    var actionNames = (resource.actions || []).map(function (action) { return action.name; }).join(' ');
    var haystack = [resource.name, category.name, category.description, resource.note || '', actionNames].join(' ').toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function remember(name, url) {
    if (!url) return;
    recents = recents.filter(function (item) { return item && item.url !== url; });
    recents.unshift({ name: name, url: url });
    recents = recents.slice(0, 8);
    saveArray(STORAGE_RECENTS, recents);
    renderRecents();
  }

  function trackLink(link, name, url) {
    link.addEventListener('click', function () { remember(name, url); });
    link.addEventListener('auxclick', function (event) {
      if (event.button === 1) remember(name, url);
    });
  }

  function renderActions(resource) {
    var details = node('details', 'actions');
    details.id = 'actions-' + resource.id;
    if (resource.featured) details.open = true;
    var summary = node('summary', '', (resource.actions.length === 1 ? 'Quick action' : resource.actions.length + ' quick actions'));
    details.appendChild(summary);
    var list = node('div', 'action-list');
    resource.actions.forEach(function (action) {
      var link = externalLink('action-link', action.name, action.url);
      link.setAttribute('aria-label', resource.name + ': ' + action.name + ' (opens in a new tab)');
      trackLink(link, resource.name + ' · ' + action.name, action.url);
      list.appendChild(link);
    });
    details.appendChild(list);
    return details;
  }

  function renderResource(resource, category, index) {
    var resourceKey = keyFor(category.id, resource.id);
    var card = node('article', 'resource' + (resource.featured ? ' featured' : '') + (resource.status === 'unavailable' ? ' unavailable' : ''));
    card.dataset.key = resourceKey;
    var top = node('div', 'resource-top');
    top.appendChild(node('span', 'resource-num', String(index + 1).padStart(2, '0')));

    var main;
    if (resource.status === 'unavailable') {
      main = node('div', 'unavailable-label');
      var unavailableName = node('span', 'resource-name', resource.name);
      unavailableName.appendChild(node('span', 'badge', 'Unavailable'));
      main.appendChild(unavailableName);
      main.appendChild(node('span', 'resource-note', resource.note));
    } else {
      main = externalLink('resource-main', '', resource.url);
      main.setAttribute('aria-label', 'Open ' + resource.name + ' in a new tab');
      var name = node('span', 'resource-name', resource.name);
      name.appendChild(node('span', 'arrow', '↗'));
      if (resource.status === 'moved') name.appendChild(node('span', 'badge', 'Moved'));
      if (resource.status === 'archived') name.appendChild(node('span', 'badge', 'Archived'));
      main.appendChild(name);
      if (resource.note) main.appendChild(node('span', 'resource-note', resource.note));
      if (resource.actions && resource.actions.length) {
        main.setAttribute('aria-label', 'Show ' + resource.name + ' quick actions. Use browser link options to open its homepage.');
        main.setAttribute('aria-controls', 'actions-' + resource.id);
        main.setAttribute('aria-expanded', String(Boolean(resource.featured)));
        main.title = 'Click for quick actions · right-click or Ctrl/Cmd-click to open the homepage';
        main.addEventListener('click', function (event) {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            remember(resource.name, resource.url);
            return;
          }
          event.preventDefault();
          var details = card.querySelector('.actions');
          details.open = !details.open;
          main.setAttribute('aria-expanded', String(details.open));
        });
        main.addEventListener('auxclick', function (event) {
          if (event.button === 1) remember(resource.name, resource.url);
        });
      } else {
        trackLink(main, resource.name, resource.url);
      }
    }
    top.appendChild(main);

    var favorite = node('button', 'favorite', isFavorite(resourceKey) ? '★' : '☆');
    favorite.type = 'button';
    favorite.dataset.favorite = resourceKey;
    favorite.setAttribute('aria-label', (isFavorite(resourceKey) ? 'Remove ' : 'Add ') + resource.name + (isFavorite(resourceKey) ? ' from' : ' to') + ' favorites');
    favorite.setAttribute('aria-pressed', String(isFavorite(resourceKey)));
    if (resource.status === 'unavailable') {
      favorite.disabled = true;
      favorite.setAttribute('aria-label', resource.name + ' is unavailable and cannot be favorited');
    }
    top.appendChild(favorite);
    card.appendChild(top);
    if (resource.actions && resource.actions.length) card.appendChild(renderActions(resource));
    return card;
  }

  function render() {
    var query = search.value.trim().toLowerCase();
    var visibleCount = 0;
    flow.textContent = '';

    manifest.categories.forEach(function (category, categoryIndex) {
      var visible = [];
      category.resources.forEach(function (resource, index) {
        if (matches(resource, category, query, keyFor(category.id, resource.id))) {
          visible.push({ resource: resource, index: index });
        }
      });
      if (!visible.length) return;

      visibleCount += visible.length;
      var section = node('section', 'category');
      section.id = category.id;
      var head = node('div', 'category-head');
      var copy = node('div');
      copy.appendChild(node('span', 'category-index', 'BRANCH ' + String(categoryIndex + 1).padStart(2, '0')));
      copy.appendChild(node('h2', '', category.name));
      copy.appendChild(node('p', 'category-desc', category.description));
      head.appendChild(copy);
      head.appendChild(node('span', 'category-count', String(visible.length)));
      section.appendChild(head);
      var grid = node('div', 'resource-grid');
      visible.forEach(function (entry) {
        grid.appendChild(renderResource(entry.resource, category, entry.index));
      });
      section.appendChild(grid);
      flow.appendChild(section);
    });

    empty.hidden = visibleCount !== 0;
    var scope = selected === 'all' ? 'all branches' : selected === 'favorites' ? 'favorites' : 'this branch';
    resultNote.textContent = visibleCount + ' of ' + total + ' resources shown in ' + scope + (query ? ' for “' + search.value.trim() + '”' : '') + '.';
    clearSearch.hidden = !search.value;
  }

  function renderRecents() {
    recentList.textContent = '';
    var valid = recents.filter(function (item) { return item && item.name && item.url; });
    recentWrap.hidden = valid.length === 0;
    valid.forEach(function (item) {
      var link = externalLink('recent-link', item.name, item.url);
      link.setAttribute('aria-label', 'Reopen ' + item.name + ' in a new tab');
      trackLink(link, item.name, item.url);
      recentList.appendChild(link);
    });
  }

  filters.addEventListener('click', function (event) {
    var button = event.target.closest('[data-filter]');
    if (!button) return;
    selected = button.dataset.filter;
    Array.prototype.forEach.call(filters.querySelectorAll('[data-filter]'), function (filter) {
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    render();
  });

  flow.addEventListener('click', function (event) {
    var button = event.target.closest('[data-favorite]');
    if (!button || button.disabled) return;
    var resourceKey = button.dataset.favorite;
    if (isFavorite(resourceKey)) favorites = favorites.filter(function (item) { return item !== resourceKey; });
    else favorites.push(resourceKey);
    saveArray(STORAGE_FAVORITES, favorites);
    renderFilters();
    render();
    var replacement = Array.prototype.find.call(flow.querySelectorAll('[data-favorite]'), function (candidate) {
      return candidate.dataset.favorite === resourceKey;
    });
    if (replacement) replacement.focus();
    else {
      var favoritesFilter = filters.querySelector('[data-filter="favorites"]');
      if (favoritesFilter) favoritesFilter.focus();
    }
  });

  search.addEventListener('input', render);
  search.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && search.value) {
      search.value = '';
      render();
    }
  });
  clearSearch.addEventListener('click', function () {
    search.value = '';
    search.focus();
    render();
  });

  renderFilters();
  renderRecents();
  render();
}());
