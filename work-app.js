(function () {
  'use strict';
  var work = window.CSWorkCatalog;
  var services = window.CSServiceCatalog;
  if (!work || !services) return;

  var filters = document.getElementById('filters');
  var grid = document.getElementById('work-grid');
  var count = document.getElementById('result-count');
  var empty = document.getElementById('empty-state');
  var state = { world: 'all', industry: 'all' };

  function el(tag, className, text) {
    var item = document.createElement(tag);
    if (className) item.className = className;
    if (text != null) item.textContent = text;
    return item;
  }
  function worldName(id) {
    var world = services.worlds.find(function (item) { return item.id === id; });
    return world ? world.name : id;
  }
  function unique(values) { return values.filter(function (value, index) { return values.indexOf(value) === index; }); }

  function filterButton(group, value, label) {
    var button = el('button', 'filter', label);
    button.type = 'button';
    button.dataset.group = group;
    button.dataset.value = value;
    button.setAttribute('aria-pressed', String(state[group] === value));
    return button;
  }

  function renderFilters() {
    filters.textContent = '';
    var worldGroup = el('div', 'filter-group');
    worldGroup.appendChild(el('span', 'filter-label', 'Service world'));
    var worldOptions = el('div', 'filter-options');
    worldOptions.appendChild(filterButton('world', 'all', 'All worlds'));
    services.worlds.forEach(function (world) { worldOptions.appendChild(filterButton('world', world.id, world.name)); });
    worldGroup.appendChild(worldOptions);
    filters.appendChild(worldGroup);

    var industryGroup = el('div', 'filter-group');
    industryGroup.appendChild(el('span', 'filter-label', 'Industry'));
    var industryOptions = el('div', 'filter-options');
    industryOptions.appendChild(filterButton('industry', 'all', 'All industries'));
    unique(work.cases.map(function (item) { return item.industry; })).sort().forEach(function (industry) {
      industryOptions.appendChild(filterButton('industry', industry, industry));
    });
    industryGroup.appendChild(industryOptions);
    filters.appendChild(industryGroup);
  }

  function renderCard(item, index) {
    var card = el('article', 'work-card');
    card.dataset.worlds = item.worlds.join(' ');
    card.dataset.industry = item.industry;
    var poster = el('div', 'work-poster');
    poster.dataset.world = item.worlds[0];
    if (item.poster) {
      var image = el('img', 'work-poster-image');
      image.src = item.poster.src;
      image.alt = item.poster.alt;
      image.width = item.poster.width;
      image.height = item.poster.height;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', function () {
        poster.classList.remove('has-image');
        image.remove();
      }, { once: true });
      poster.classList.add('has-image');
      poster.style.setProperty('--work-position', item.poster.position || '50% 50%');
      poster.appendChild(image);
    }
    poster.appendChild(el('span', 'work-number', String(index + 1).padStart(2, '0')));
    var identity = el('div', 'work-identity');
    identity.appendChild(el('span', 'work-industry', item.industry));
    identity.appendChild(el('strong', 'work-client', item.client));
    poster.appendChild(identity);
    card.appendChild(poster);
    var body = el('div', 'work-body');
    body.appendChild(el('p', '', item.summary));
    body.appendChild(el('div', 'work-outcome', item.outcome));
    if (item.deliverables && item.deliverables.length) {
      var details = el('details', 'work-details');
      details.appendChild(el('summary', '', 'Selected scope'));
      var deliverables = el('ul', 'work-deliverables');
      item.deliverables.forEach(function (deliverable) {
        deliverables.appendChild(el('li', '', deliverable));
      });
      details.appendChild(deliverables);
      body.appendChild(details);
    }
    var worlds = el('div', 'work-worlds');
    item.worlds.forEach(function (id) { worlds.appendChild(el('span', '', worldName(id))); });
    body.appendChild(worlds);
    var tags = el('div', 'work-tags');
    item.tags.forEach(function (tag) { tags.appendChild(el('span', '', tag)); });
    body.appendChild(tags);
    card.appendChild(body);
    return card;
  }

  function renderCases() {
    grid.textContent = '';
    var visible = work.cases.filter(function (item) {
      var worldMatch = state.world === 'all' || item.worlds.indexOf(state.world) !== -1;
      var industryMatch = state.industry === 'all' || item.industry === state.industry;
      return worldMatch && industryMatch;
    });
    visible.forEach(function (item) { grid.appendChild(renderCard(item, work.cases.indexOf(item))); });
    empty.hidden = visible.length !== 0;
    count.textContent = visible.length + ' of ' + work.cases.length + ' cases shown.';
  }

  function syncUrl() {
    var params = new URLSearchParams();
    if (state.world !== 'all') params.set('world', state.world);
    if (state.industry !== 'all') params.set('industry', state.industry);
    history.replaceState(null, '', location.pathname + (params.toString() ? '?' + params.toString() : ''));
  }

  function readUrl() {
    var params = new URLSearchParams(location.search);
    var world = params.get('world');
    var industry = params.get('industry');
    if (world && services.worlds.some(function (item) { return item.id === world; })) state.world = world;
    if (industry && work.cases.some(function (item) { return item.industry === industry; })) state.industry = industry;
  }

  filters.addEventListener('click', function (event) {
    var button = event.target.closest('[data-group]');
    if (!button) return;
    var focusGroup = button.dataset.group;
    var focusValue = button.dataset.value;
    state[focusGroup] = focusValue;
    renderFilters();
    renderCases();
    syncUrl();
    requestAnimationFrame(function () {
      var replacement = Array.prototype.find.call(filters.querySelectorAll('[data-group]'), function (candidate) {
        return candidate.dataset.group === focusGroup && candidate.dataset.value === focusValue;
      });
      if (replacement) replacement.focus();
    });
  });

  readUrl();
  renderFilters();
  renderCases();
}());
