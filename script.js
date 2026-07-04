function showTab(tabId, saveToStorage = true) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  document.getElementById(tabId).style.display = 'block';

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Highlight the right button
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('onclick') === `showTab('${tabId}')`) {
      btn.classList.add('active');
    }
  });

  if (saveToStorage) {
    localStorage.setItem('activeTab', tabId);
  }
}

// On page load, restore last active tab
const savedTab = localStorage.getItem('activeTab');
if (savedTab) {
  showTab(savedTab, false);
}

// ---- CROPS ----
fetch('crops_data.json')
  .then(response => response.json())
  .then(crops => {

    // ---- Season count cards ----
    document.getElementById('springCount').textContent = crops.filter(c => c['Season Simple'] === 'Spring').length;
    document.getElementById('summerCount').textContent = crops.filter(c => c['Season Simple'] === 'Summer').length;
    document.getElementById('fallCount').textContent = crops.filter(c => c['Season Simple'] === 'Fall').length;
    document.getElementById('winterCount').textContent = crops.filter(c => c['Season Simple'] === 'Winter').length;

    // ---- Overview scatter plot: Growth Time vs Sell Price ----
    const seasonColors = {
      'Spring': '#93C47D',
      'Summer': '#FFB3C6',
      'Fall':   '#C4884F',
      'Winter': '#9DDCFF',
      'All':    '#A67C52'
    };

    function buildScatterDatasets(seasonFilter) {
      const seasons = seasonFilter === 'All'
        ? ['Spring', 'Summer', 'Fall', 'Winter', 'All']
        : [seasonFilter];

      return seasons.map(season => ({
        label: season,
        data: crops
          .filter(c => {
            const price = parseFloat(c['Price (Regular)']);
            const growth = parseFloat(c['Growth Time (In Days)']);
            return !isNaN(price) && !isNaN(growth) && c['Season Simple'] === season;
          })
          .map(c => ({
            x: parseFloat(c['Growth Time (In Days)']),
            y: parseFloat(c['Price (Regular)']),
            name: c.Name
          })),
        backgroundColor: seasonColors[season],
        pointRadius: 7,
        pointHoverRadius: 9
      }));
    }

    const overviewScatterCtx = document.getElementById('overviewScatter');
    const overviewScatterChart = new Chart(overviewScatterCtx, {
      type: 'scatter',
      data: {
        datasets: buildScatterDatasets('All')
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.raw.name} — ${ctx.raw.x} days, ${ctx.raw.y}g`
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'Growth Time (days)' } },
          y: { title: { display: true, text: 'Sell Price (Regular)' } }
        }
      }
    });

    window.updateOverviewScatter = function() {
      const selected = document.getElementById('overviewSeasonFilter').value;
      overviewScatterChart.data.datasets = buildScatterDatasets(selected);
      overviewScatterChart.update();
    };

    // ---- Top 10 most valuable crops chart ----
    const sortedCrops = crops
      .filter(c => c['Price (Iridium)'] !== null)
      .sort((a, b) => b['Price (Iridium)'] - a['Price (Iridium)'])
      .slice(0, 10);

    const cropLabels = sortedCrops.map(c => c.Name);
    const cropValues = sortedCrops.map(c => c['Price (Iridium)']);

    new Chart(document.getElementById('cropValueChart'), {
      type: 'bar',
      data: {
        labels: cropLabels,
        datasets: [{
          label: 'Max Price (Iridium quality)',
          data: cropValues,
          backgroundColor: '#E8A87C'
        }]
      }
    });

    // ---- Average value by season chart ----
    const seasonsList = ['Spring', 'Summer', 'Fall', 'Winter', 'All'];
    const seasonAvgs = seasonsList.map(season => {
      const inSeason = crops.filter(c => c['Season Simple'] === season && c['Price (Iridium)'] !== null);
      if (inSeason.length === 0) return { season, avg: 0 };
      const total = inSeason.reduce((sum, c) => sum + c['Price (Iridium)'], 0);
      return { season, avg: total / inSeason.length };
    });

    const seasonAverages = seasonAvgs.map(s => Math.round(s.avg));

    new Chart(document.getElementById('cropSeasonChart'), {
      type: 'bar',
      data: {
        labels: seasonsList,
        datasets: [{
          label: 'Average Max Price',
          data: seasonAverages,
          backgroundColor: '#85C1A3'
        }]
      }
    });

  })
  .catch(err => console.error('Error loading crops_data.json:', err));

// ---- CHARACTERS ----
let allCharacters = [];

fetch('characters_data.json')
  .then(response => response.json())
  .then(characters => {
    allCharacters = characters;

    const select = document.getElementById('villagerSelect');
    characters.forEach(c => {
      const option = document.createElement('option');
      option.value = c.Name;
      option.textContent = c.Name;
      select.appendChild(option);
    });
  })
  .catch(err => console.error('Error loading characters_data.json:', err));

window.showVillager = function() {
  const name = document.getElementById('villagerSelect').value;
  const infoDiv = document.getElementById('villagerInfo');

  if (!name) {
    infoDiv.innerHTML = '';
    return;
  }

  const villager = allCharacters.find(c => c.Name === name);

  function parseGiftList(val) {
    if (!val) return [];
    try {
      return JSON.parse(val.replace(/'/g, '"'));
    } catch (e) {
      return [val];
    }
  }

  const loved = parseGiftList(villager['Loved Gifts']);
  const liked = parseGiftList(villager['Liked Gifts']);
  const disliked = parseGiftList(villager['Disliked Gifts']);
  const hated = parseGiftList(villager['Hated Gifts']);

  function giftTags(gifts, color) {
    return gifts.map(g => `
      <span style="
        display: inline-block;
        background: ${color};
        border-radius: 20px;
        padding: 4px 12px;
        margin: 3px;
        font-size: 13px;
        color: #4A2E10;
        font-weight: 600;
      ">${g}</span>
    `).join('');
  }

  infoDiv.innerHTML = `
    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
      <div style="background: #E8D9C0; border-radius: 10px; padding: 10px 18px;">
        <strong>🎂 Birthday</strong><br>${villager['Birthday Season']} ${villager['Birthday Day']}
      </div>
      <div style="background: #E8D9C0; border-radius: 10px; padding: 10px 18px;">
        <strong>🏠 Lives In</strong><br>${villager['Lives In']}
      </div>
      <div style="background: #E8D9C0; border-radius: 10px; padding: 10px 18px;">
        <strong>💍 Marriage</strong><br>${villager['Marriage'] ? '✅ Yes' : '❌ No'}
      </div>
    </div>

    <div style="margin-bottom: 12px;">
      <p style="margin: 0 0 6px; font-weight: 700; color: #6B4C2A;">💝 Loved Gifts</p>
      <div>${giftTags(loved, '#FFD9A0')}</div>
    </div>

    <div style="margin-bottom: 12px;">
      <p style="margin: 0 0 6px; font-weight: 700; color: #6B4C2A;">💛 Liked Gifts</p>
      <div>${giftTags(liked, '#D4EAC8')}</div>
    </div>

    <div style="margin-bottom: 12px;">
      <p style="margin: 0 0 6px; font-weight: 700; color: #6B4C2A;">👎 Disliked Gifts</p>
      <div>${giftTags(disliked, '#E8D9C0')}</div>
    </div>

    <div>
      <p style="margin: 0 0 6px; font-weight: 700; color: #6B4C2A;">🚫 Hated Gifts</p>
      <div>${giftTags(hated, '#F2C4C4')}</div>
    </div>
  `;
};