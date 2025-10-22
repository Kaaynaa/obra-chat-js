// ============================================================================
// PLANNING APP - JavaScript Logic
// ============================================================================

// Global Variables
let currentFilter = 'all';
let currentView = 'month';
let currentMonth = 9; // Octobre
let currentYear = 2025;
let currentWeekStart = null;
let currentDayDate = null;
let selectedDay = 20;
let currentRdvId = null;
let rdvIdCounter = 16;
let rdvHistory = [];

// ============================================================================
// DATA STRUCTURES
// ============================================================================

const rdvData = {
  devis: {
    client: 'Jean Dupont',
    time: 'Lundi 20 Octobre 2025 • 09:00 - 10:30',
    type: 'Devis cuisine',
    typeClass: 'type-devis',
    address: '42 Rue de la République, 75010 Paris',
    phone: '06 12 34 56 78',
    duration: '1h30',
    description: 'Installation complète d\'une cuisine équipée avec pose de meubles hauts et bas, raccordement électrique et plomberie. Matériel fourni par le client.'
  },
  installation: {
    client: 'Marie Laurent',
    time: 'Lundi 20 Octobre 2025 • 14:00 - 17:00',
    type: 'Installation chauffage',
    typeClass: 'type-installation',
    address: '8 Avenue des Lilas, 92100 Boulogne',
    phone: '06 98 76 54 32',
    duration: '3h00',
    description: 'Installation d\'un système de chauffage central avec chaudière à condensation gaz. Pose de 8 radiateurs dans l\'ensemble du logement.'
  },
  urgence: {
    client: 'Pierre Bernard',
    time: 'Lundi 20 Octobre 2025 • 18:30 - 19:30',
    type: 'Dépannage urgent',
    typeClass: 'type-urgence',
    address: '15 Boulevard Haussmann, 75009 Paris',
    phone: '06 45 23 89 01',
    duration: '1h00',
    description: 'Intervention urgente pour fuite d\'eau importante dans la salle de bain. Le robinet de baignoire ne se ferme plus complètement.'
  }
};

const rdvByDay = {
  1: [
    { id: 'rdv1', time: '10:00 - 11:00', client: 'Sophie Dubois', type: 'Devis', typeClass: 'type-devis' }
  ],
  2: [
    { id: 'rdv2', time: '09:30 - 12:00', client: 'Marc Petit', type: 'Installation', typeClass: 'type-installation' },
    { id: 'rdv3', time: '14:00 - 15:30', client: 'Claire Martin', type: 'Devis', typeClass: 'type-devis' }
  ],
  4: [
    { id: 'rdv4', time: '11:00 - 12:30', client: 'Antoine Roux', type: 'Maintenance', typeClass: 'type-maintenance' }
  ],
  7: [
    { id: 'rdv5', time: '08:00 - 10:00', client: 'Julie Simon', type: 'Installation', typeClass: 'type-installation' }
  ],
  9: [
    { id: 'rdv6', time: '10:00 - 11:00', client: 'Thomas Blanc', type: 'Devis', typeClass: 'type-devis' },
    { id: 'rdv7', time: '16:00 - 17:00', client: 'Emma Rousseau', type: 'Urgence', typeClass: 'type-urgence' }
  ],
  14: [
    { id: 'rdv8', time: '13:00 - 15:00', client: 'Lucas Bernard', type: 'Maintenance', typeClass: 'type-maintenance' }
  ],
  15: [
    { id: 'rdv9', time: '09:00 - 11:30', client: 'Léa Moreau', type: 'Installation', typeClass: 'type-installation' },
    { id: 'rdv10', time: '14:00 - 15:00', client: 'Hugo Lefebvre', type: 'Devis', typeClass: 'type-devis' }
  ],
  20: [
    { id: 'devis', time: '09:00 - 10:30', client: 'Jean Dupont', type: 'Devis cuisine', typeClass: 'type-devis' },
    { id: 'installation', time: '14:00 - 17:00', client: 'Marie Laurent', type: 'Installation chauffage', typeClass: 'type-installation' },
    { id: 'urgence', time: '18:30 - 19:30', client: 'Pierre Bernard', type: 'Dépannage urgent', typeClass: 'type-urgence' }
  ],
  22: [
    { id: 'rdv11', time: '10:00 - 12:00', client: 'Alice Girard', type: 'Maintenance', typeClass: 'type-maintenance' }
  ],
  25: [
    { id: 'rdv12', time: '08:30 - 11:00', client: 'Paul Vincent', type: 'Installation', typeClass: 'type-installation' }
  ],
  28: [
    { id: 'rdv13', time: '15:00 - 16:30', client: 'Camille Durand', type: 'Devis', typeClass: 'type-devis' }
  ],
  30: [
    { id: 'rdv14', time: '09:00 - 10:00', client: 'Maxime Garnier', type: 'Maintenance', typeClass: 'type-maintenance' },
    { id: 'rdv15', time: '11:00 - 12:00', client: 'Sarah Lambert', type: 'Devis', typeClass: 'type-devis' }
  ]
};

const rdvDetails = {
  ...rdvData,
  rdv1: {
    client: 'Sophie Dubois',
    time: 'Mercredi 1 Octobre 2025 • 10:00 - 11:00',
    type: 'Devis',
    typeClass: 'type-devis',
    address: '23 Rue Victor Hugo, 75016 Paris',
    phone: '06 34 56 78 90',
    duration: '1h00',
    description: 'Devis pour rénovation complète d\'un appartement de 45m². Peinture, parquet, électricité et plomberie.'
  },
  rdv2: {
    client: 'Marc Petit',
    time: 'Jeudi 2 Octobre 2025 • 09:30 - 12:00',
    type: 'Installation',
    typeClass: 'type-installation',
    address: '67 Avenue de la Liberté, 94200 Ivry',
    phone: '06 89 12 34 56',
    duration: '2h30',
    description: 'Installation d\'un système de climatisation réversible dans un salon de 30m². Pose de 2 unités intérieures et 1 groupe extérieur.'
  },
  rdv3: {
    client: 'Claire Martin',
    time: 'Jeudi 2 Octobre 2025 • 14:00 - 15:30',
    type: 'Devis',
    typeClass: 'type-devis',
    address: '12 Impasse des Roses, 92130 Issy',
    phone: '07 12 45 67 89',
    duration: '1h30',
    description: 'Étude et chiffrage pour création d\'une terrasse en bois exotique de 20m². Avec garde-corps et éclairage intégré.'
  },
  rdv4: {
    client: 'Antoine Roux',
    time: 'Samedi 4 Octobre 2025 • 11:00 - 12:30',
    type: 'Maintenance',
    typeClass: 'type-maintenance',
    address: '45 Boulevard Voltaire, 75011 Paris',
    phone: '06 78 90 12 34',
    duration: '1h30',
    description: 'Entretien annuel du système de chauffage. Vérification et nettoyage.'
  },
  rdv5: {
    client: 'Julie Simon',
    time: 'Lundi 7 Octobre 2025 • 08:00 - 10:00',
    type: 'Installation',
    typeClass: 'type-installation',
    address: '34 Rue des Lilas, 93100 Montreuil',
    phone: '06 56 78 90 12',
    duration: '2h00',
    description: 'Pose complète d\'une cuisine équipée sur mesure. Installation des meubles, raccordements eau et électricité.'
  },
  rdv6: {
    client: 'Thomas Blanc',
    time: 'Jeudi 9 Octobre 2025 • 10:00 - 11:00',
    type: 'Devis',
    typeClass: 'type-devis',
    address: '56 Avenue Mozart, 75016 Paris',
    phone: '07 89 01 23 45',
    duration: '1h00',
    description: 'Devis pour peinture intérieure complète d\'un 3 pièces. Murs et plafonds.'
  },
  rdv7: {
    client: 'Emma Rousseau',
    time: 'Jeudi 9 Octobre 2025 • 16:00 - 17:00',
    type: 'Urgence',
    typeClass: 'type-urgence',
    address: '78 Rue Gambetta, 94130 Nogent',
    phone: '06 12 90 87 65',
    duration: '1h00',
    description: 'Intervention d\'urgence pour fuite au niveau du chauffe-eau. Situation critique.'
  },
  rdv8: {
    client: 'Lucas Bernard',
    time: 'Lundi 14 Octobre 2025 • 13:00 - 15:00',
    type: 'Maintenance',
    typeClass: 'type-maintenance',
    address: '91 Boulevard Voltaire, 75011 Paris',
    phone: '06 78 45 12 90',
    duration: '2h00',
    description: 'Maintenance et nettoyage du système de ventilation VMC. Contrôle des filtres et moteurs.'
  },
  rdv9: {
    client: 'Léa Moreau',
    time: 'Mardi 15 Octobre 2025 • 09:00 - 11:30',
    type: 'Installation',
    typeClass: 'type-installation',
    address: '45 Rue de Rivoli, 75001 Paris',
    phone: '07 23 45 67 89',
    duration: '2h30',
    description: 'Rénovation complète du tableau électrique et mise aux normes. Installation de prises supplémentaires.'
  },
  rdv10: {
    client: 'Hugo Lefebvre',
    time: 'Mardi 15 Octobre 2025 • 14:00 - 15:00',
    type: 'Devis',
    typeClass: 'type-devis',
    address: '29 Avenue Foch, 92400 Courbevoie',
    phone: '06 90 12 34 56',
    duration: '1h00',
    description: 'Estimation pour pose de parquet massif dans un salon de 25m². Essence chêne.'
  },
  rdv11: {
    client: 'Alice Girard',
    time: 'Mercredi 22 Octobre 2025 • 10:00 - 12:00',
    type: 'Maintenance',
    typeClass: 'type-maintenance',
    address: '17 Rue Saint-Antoine, 75004 Paris',
    phone: '06 45 78 90 12',
    duration: '2h00',
    description: 'Révision annuelle du système de chauffage au sol. Contrôle et réglage de la pompe à chaleur.'
  },
  rdv12: {
    client: 'Paul Vincent',
    time: 'Vendredi 25 Octobre 2025 • 08:30 - 11:00',
    type: 'Installation',
    typeClass: 'type-installation',
    address: '88 Boulevard Beaumarchais, 75011 Paris',
    phone: '07 56 89 01 23',
    duration: '2h30',
    description: 'Installation complète d\'une salle de bain. Pose de douche italienne, meuble vasque et WC suspendu.'
  },
  rdv13: {
    client: 'Camille Durand',
    time: 'Lundi 28 Octobre 2025 • 15:00 - 16:30',
    type: 'Devis',
    typeClass: 'type-devis',
    address: '52 Rue de la Pompe, 75116 Paris',
    phone: '06 23 67 89 01',
    duration: '1h30',
    description: 'Étude et chiffrage pour isolation des combles perdus. Surface 60m².'
  },
  rdv14: {
    client: 'Maxime Garnier',
    time: 'Mercredi 30 Octobre 2025 • 09:00 - 10:00',
    type: 'Maintenance',
    typeClass: 'type-maintenance',
    address: '73 Avenue Kléber, 75116 Paris',
    phone: '07 89 12 34 56',
    duration: '1h00',
    description: 'Maintenance du système d\'alarme. Test des capteurs et mise à jour du système.'
  },
  rdv15: {
    client: 'Sarah Lambert',
    time: 'Mercredi 30 Octobre 2025 • 11:00 - 12:00',
    type: 'Devis',
    typeClass: 'type-devis',
    address: '14 Rue du Commerce, 75015 Paris',
    phone: '06 78 90 12 34',
    duration: '1h00',
    description: 'Devis pour remplacement de 4 fenêtres double vitrage. Format standard.'
  }
};

// ============================================================================
// HISTORY FUNCTIONS
// ============================================================================

function addToHistory(action, rdvId, details) {
  const timestamp = new Date().toLocaleString('fr-FR');
  rdvHistory.unshift({
    action,
    rdvId,
    details,
    timestamp
  });
  if (rdvHistory.length > 50) rdvHistory.pop();
}

function showHistory() {
  if (rdvHistory.length === 0) {
    showToast('Aucun historique disponible', 'error');
    return;
  }

  const historyModal = document.createElement('div');
  historyModal.className = 'rdv-modal active';
  historyModal.innerHTML = `
    <div class="rdv-modal-content" style="max-width: 700px;">
      <button class="rdv-modal-close" onclick="this.closest('.rdv-modal').remove()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="rdv-modal-header">
        <div class="rdv-modal-title">Historique des modifications</div>
        <div class="rdv-modal-subtitle">Dernières actions effectuées</div>
      </div>

      <div style="max-height: 500px; overflow-y: auto;">
        ${rdvHistory.map(entry => `
          <div style="background: #FAFAFA; border: 2px solid #F0F0F0; border-radius: 12px; padding: 14px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
              <span style="font-weight: 700; color: ${
                entry.action === 'create' ? '#34C759' :
                entry.action === 'delete' ? '#FF3B30' :
                entry.action === 'move' ? '#007AFF' : '#FF9500'
              };">
                ${
                  entry.action === 'create' ? '➕ Création' :
                  entry.action === 'delete' ? '🗑️ Suppression' :
                  entry.action === 'move' ? '↔️ Déplacement' : '✏️ Modification'
                }
              </span>
              <span style="font-size: 12px; color: #666;">${entry.timestamp}</span>
            </div>
            <div style="font-size: 14px; color: #333;">${entry.details}</div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 20px;">
        <button class="rdv-modal-btn rdv-modal-btn-secondary" onclick="this.closest('.rdv-modal').remove()">
          Fermer
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(historyModal);
}

// ============================================================================
// MODAL FUNCTIONS
// ============================================================================

function openRdvModal(type) {
  const data = rdvDetails[type] || rdvData[type];
  if (!data) return;

  currentRdvId = type;

  const modal = document.getElementById('rdvModal');

  document.getElementById('modalClient').textContent = data.client;
  document.getElementById('modalTime').textContent = data.time;
  document.getElementById('modalType').textContent = data.type;
  document.getElementById('modalAddress').textContent = data.address;
  document.getElementById('modalPhone').textContent = data.phone;
  document.getElementById('modalDuration').textContent = data.duration;
  document.getElementById('modalDescription').textContent = data.description;

  const badge = document.getElementById('modalBadge');
  badge.className = 'rdv-modal-badge ' + data.typeClass;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeRdvModal() {
  const modal = document.getElementById('rdvModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function openAddRdvModal(date = null) {
  const modal = document.getElementById('addRdvModal');
  const form = document.getElementById('rdvForm');

  form.reset();
  document.getElementById('rdvEditId').value = '';
  document.getElementById('rdvType').value = 'devis';
  document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('selected'));
  document.querySelector('.type-option.type-devis').classList.add('selected');

  document.getElementById('clientInfoSection').style.display = 'block';
  document.getElementById('descriptionSection').style.display = 'block';
  document.getElementById('addressField').style.display = 'block';
  document.getElementById('durationField').style.display = 'block';
  document.getElementById('phoneField').style.display = 'block';
  document.getElementById('rdvClient').required = true;
  document.getElementById('rdvDuration').value = '1.5';

  const motifField = document.getElementById('motifField');
  if (motifField) motifField.remove();

  if (date) {
    document.getElementById('rdvDate').value = date;
  } else {
    const today = new Date(currentYear, currentMonth, selectedDay || 1);
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('rdvDate').value = dateStr;
  }

  document.getElementById('addRdvModalTitle').textContent = 'Nouveau rendez-vous';
  document.getElementById('addRdvModalSubtitle').textContent = 'Remplissez les informations du rendez-vous';
  document.getElementById('submitBtnText').textContent = 'Créer le RDV';

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAddRdvModal() {
  const modal = document.getElementById('addRdvModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function selectType(type, element) {
  document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('selected'));
  element.classList.add('selected');
  document.getElementById('rdvType').value = type;

  const clientInfoSection = document.getElementById('clientInfoSection');
  const descriptionSection = document.getElementById('descriptionSection');
  const addressField = document.getElementById('addressField');
  const durationField = document.getElementById('durationField');
  const clientInput = document.getElementById('rdvClient');
  const phoneField = document.getElementById('phoneField');

  clientInfoSection.style.display = 'block';
  descriptionSection.style.display = 'block';
  addressField.style.display = 'block';
  durationField.style.display = 'block';
  phoneField.style.display = 'block';
  clientInput.required = true;

  const motifField = document.getElementById('motifField');
  if (motifField) {
    motifField.remove();
  }

  if (type === 'conge') {
    clientInfoSection.style.display = 'none';
    descriptionSection.style.display = 'none';
    clientInput.required = false;

    const newMotifField = document.createElement('div');
    newMotifField.id = 'motifField';
    newMotifField.className = 'rdv-modal-section';
    newMotifField.innerHTML = `
      <div class="rdv-modal-section-title">Motif du blocage</div>
      <div class="form-group">
        <label>RAISON *</label>
        <input type="text" id="rdvMotif" placeholder="Ex: Congés annuels, Formation, Rendez-vous personnel..." required>
      </div>
    `;

    const typeSection = element.closest('.rdv-modal-section');
    typeSection.parentNode.insertBefore(newMotifField, typeSection.nextSibling);

  } else if (type === 'urgence') {
    document.getElementById('rdvDuration').value = '1';
  }
}

function editRdv() {
  if (!currentRdvId) return;

  const rdvInfo = rdvDetails[currentRdvId];
  if (!rdvInfo) return;

  closeRdvModal();

  const modal = document.getElementById('addRdvModal');

  document.getElementById('rdvEditId').value = currentRdvId;

  document.getElementById('clientInfoSection').style.display = 'block';
  document.getElementById('descriptionSection').style.display = 'block';
  document.getElementById('addressField').style.display = 'block';
  document.getElementById('durationField').style.display = 'block';
  document.getElementById('phoneField').style.display = 'block';
  document.getElementById('rdvClient').required = true;

  const motifField = document.getElementById('motifField');
  if (motifField) motifField.remove();

  document.getElementById('rdvClient').value = rdvInfo.client;

  const typeMap = {
    'type-devis': 'devis',
    'type-installation': 'installation',
    'type-maintenance': 'maintenance',
    'type-urgence': 'urgence',
    'type-conge': 'conge'
  };
  const type = typeMap[rdvInfo.typeClass] || 'devis';
  document.getElementById('rdvType').value = type;
  document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('selected'));
  const selectedOption = document.querySelector(`.type-option.${rdvInfo.typeClass}`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
    selectType(type, selectedOption);
  }

  const timeMatch = rdvInfo.time.match(/(\d+)\s+(\w+)\s+(\d+)\s+•\s+(\d+):(\d+)/);
  if (timeMatch) {
    const day = timeMatch[1];
    const monthName = timeMatch[2];
    const year = timeMatch[3];
    const hour = timeMatch[4];
    const minute = timeMatch[5];

    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthIndex = monthNames.indexOf(monthName);

    if (monthIndex !== -1) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      document.getElementById('rdvDate').value = dateStr;
      document.getElementById('rdvTime').value = `${hour}:${minute}`;
    }
  }

  document.getElementById('rdvPhone').value = rdvInfo.phone || '';
  document.getElementById('rdvAddress').value = rdvInfo.address || '';
  document.getElementById('rdvDescription').value = rdvInfo.description || '';
  document.getElementById('rdvDuration').value = '1.5';

  document.getElementById('addRdvModalTitle').textContent = 'Modifier le rendez-vous';
  document.getElementById('addRdvModalSubtitle').textContent = 'Modifiez les informations du rendez-vous';
  document.getElementById('submitBtnText').textContent = 'Enregistrer';

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function deleteRdv() {
  if (!currentRdvId) return;

  if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) return;

  const rdvInfo = rdvDetails[currentRdvId];
  const clientName = rdvInfo ? rdvInfo.client : 'RDV';

  delete rdvDetails[currentRdvId];

  for (let day in rdvByDay) {
    rdvByDay[day] = rdvByDay[day].filter(rdv => rdv.id !== currentRdvId);
    if (rdvByDay[day].length === 0) {
      delete rdvByDay[day];
    }
  }

  addToHistory('delete', currentRdvId, `RDV "${clientName}" supprimé`);

  closeRdvModal();
  renderCalendar();
  updateRdvPanel(selectedDay);

  showToast('Rendez-vous supprimé', 'error');
}

function blockDaySlot() {
  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  openAddRdvModal(dateStr);

  setTimeout(() => {
    document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('selected'));
    const congeOption = document.querySelector('.type-option.type-conge');
    if (congeOption) {
      congeOption.classList.add('selected');
      document.getElementById('rdvType').value = 'conge';

      document.getElementById('clientInfoSection').style.display = 'none';
      document.getElementById('descriptionSection').style.display = 'none';
      document.getElementById('rdvClient').required = false;

      const motifField = document.createElement('div');
      motifField.id = 'motifField';
      motifField.className = 'rdv-modal-section';
      motifField.innerHTML = `
        <div class="rdv-modal-section-title">Motif du blocage</div>
        <div class="form-group">
          <label>RAISON *</label>
          <input type="text" id="rdvMotif" placeholder="Ex: Congés annuels, Formation, Rendez-vous personnel..." required>
        </div>
      `;

      const typeSection = congeOption.closest('.rdv-modal-section');
      typeSection.parentNode.insertBefore(motifField, typeSection.nextSibling);
    }
  }, 100);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #34C759, #30D158)' : 'linear-gradient(135deg, #FF3B30, #FF6259)'};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 15px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================================
// VIEW SWITCHING
// ============================================================================

function switchView(view) {
  currentView = view;

  document.querySelectorAll('.view-toggle-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.closest('.view-toggle-btn').classList.add('active');

  document.getElementById('month-view').classList.remove('active');
  document.getElementById('week-view').classList.remove('active');
  document.getElementById('day-view').classList.remove('active');

  setTimeout(() => {
    document.getElementById('month-view').style.display = 'none';
    document.getElementById('week-view').style.display = 'none';
    document.getElementById('day-view').style.display = 'none';

    if (view === 'month') {
      document.getElementById('month-view').style.display = 'block';
      setTimeout(() => {
        document.getElementById('month-view').classList.add('active');
      }, 10);
    } else if (view === 'week') {
      document.getElementById('week-view').style.display = 'block';
      if (!currentWeekStart) {
        currentWeekStart = getWeekStart(new Date(currentYear, currentMonth, selectedDay));
      }
      renderWeekView();
      setTimeout(() => {
        document.getElementById('week-view').classList.add('active');
      }, 10);
    } else if (view === 'day') {
      document.getElementById('day-view').style.display = 'block';
      if (!currentDayDate) {
        currentDayDate = new Date(currentYear, currentMonth, selectedDay);
      }
      renderDayView();
      setTimeout(() => {
        document.getElementById('day-view').classList.add('active');
      }, 10);
    }
  }, 150);
}

// ============================================================================
// MONTH VIEW
// ============================================================================

function toggleMonthDropdown() {
  const trigger = document.querySelector('#monthDropdown .calendar-dropdown-trigger');
  const menu = document.getElementById('monthDropdownMenu');

  trigger.classList.toggle('active');
  menu.classList.toggle('active');
}

function toggleYearDropdown() {
  const trigger = document.querySelector('#yearDropdown .calendar-dropdown-trigger');
  const menu = document.getElementById('yearDropdownMenu');

  trigger.classList.toggle('active');
  menu.classList.toggle('active');
}

function selectMonth(month, name) {
  currentMonth = month;

  document.getElementById('monthDropdownText').textContent = name;

  document.querySelectorAll('#monthDropdownMenu .calendar-dropdown-item').forEach(item => {
    item.classList.remove('selected');
  });
  event.target.closest('.calendar-dropdown-item').classList.add('selected');

  document.querySelector('#monthDropdown .calendar-dropdown-trigger').classList.remove('active');
  document.getElementById('monthDropdownMenu').classList.remove('active');

  renderCalendar();
}

function selectYear(year) {
  currentYear = year;

  document.getElementById('yearDropdownText').textContent = year;

  document.querySelectorAll('#yearDropdownMenu .calendar-dropdown-item').forEach(item => {
    item.classList.remove('selected');
  });
  event.target.closest('.calendar-dropdown-item').classList.add('selected');

  document.querySelector('#yearDropdown .calendar-dropdown-trigger').classList.remove('active');
  document.getElementById('yearDropdownMenu').classList.remove('active');

  renderCalendar();
}

function updateDropdownSelections() {
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  document.getElementById('monthDropdownText').textContent = monthNames[currentMonth];
  document.getElementById('yearDropdownText').textContent = currentYear;

  document.querySelectorAll('#monthDropdownMenu .calendar-dropdown-item').forEach(item => {
    if (parseInt(item.dataset.value) === currentMonth) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });

  document.querySelectorAll('#yearDropdownMenu .calendar-dropdown-item').forEach(item => {
    if (parseInt(item.dataset.value) === currentYear) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
}

function navigateMonth(direction) {
  currentMonth += direction;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateDropdownSelections();
  renderCalendar();
}

function renderCalendar() {
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  updateDropdownSelections();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  const prevMonthDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const calendarDaysEl = document.getElementById('calendar-days-container');
  calendarDaysEl.innerHTML = '';

  for (let i = prevMonthDays; i > 0; i--) {
    const dayEl = createDayElement(prevMonthLastDay - i + 1, true, false);
    calendarDaysEl.appendChild(dayEl);
  }

  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    const isSelected = day === selectedDay && currentMonth === 9 && currentYear === 2025;
    const dayEl = createDayElement(day, false, isToday, isSelected);
    calendarDaysEl.appendChild(dayEl);
  }

  const totalCells = prevMonthDays + daysInMonth;
  const nextMonthDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let day = 1; day <= nextMonthDays; day++) {
    const dayEl = createDayElement(day, true, false);
    calendarDaysEl.appendChild(dayEl);
  }
}

function createDayElement(day, otherMonth, isToday = false, isSelected = false) {
  const dayEl = document.createElement('div');
  dayEl.className = 'calendar-day';
  if (otherMonth) dayEl.classList.add('other-month');
  if (isToday) dayEl.classList.add('today');
  if (isSelected) dayEl.classList.add('selected');

  const dayNumber = document.createElement('div');
  dayNumber.className = 'calendar-day-number';
  dayNumber.textContent = day;
  dayEl.appendChild(dayNumber);

  if (!otherMonth) {
    const addBtn = document.createElement('div');
    addBtn.className = 'calendar-day-add';
    addBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    `;
    addBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      openAddRdvModal(dateStr);
    });
    dayEl.appendChild(addBtn);
  }

  if (!otherMonth && rdvByDay[day]) {
    const hasRdvForDay = currentMonth === 9 && currentYear === 2025;

    if (hasRdvForDay) {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'calendar-day-dots';

      const rdvTypes = new Set();
      rdvByDay[day].forEach(rdv => {
        if (rdv.typeClass === 'type-devis') rdvTypes.add('devis');
        if (rdv.typeClass === 'type-installation') rdvTypes.add('installation');
        if (rdv.typeClass === 'type-maintenance') rdvTypes.add('maintenance');
        if (rdv.typeClass === 'type-urgence') rdvTypes.add('urgence');
        if (rdv.typeClass === 'type-conge') rdvTypes.add('conge');
      });

      let dotCount = 0;
      rdvTypes.forEach(type => {
        if (dotCount < 4) {
          const dot = document.createElement('div');
          dot.className = `calendar-day-dot dot-${type} visible`;
          dot.setAttribute('data-type', type);
          dotsContainer.appendChild(dot);
          dotCount++;
        }
      });

      dayEl.appendChild(dotsContainer);
    }
  }

  if (!otherMonth) {
    dayEl.addEventListener('click', function(e) {
      e.preventDefault();

      document.querySelectorAll('.calendar-day').forEach(d => {
        d.classList.remove('selected');
      });
      this.classList.add('selected');

      void this.offsetHeight;

      selectedDay = day;

      updateRdvPanel(day);
    });

    dayEl.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.classList.add('drag-over');
    });

    dayEl.addEventListener('dragleave', function(e) {
      this.classList.remove('drag-over');
    });

    dayEl.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');

      const rdvId = e.dataTransfer.getData('text/plain');
      const targetDay = day;

      let sourceDay = null;
      for (let d in rdvByDay) {
        const rdvIndex = rdvByDay[d].findIndex(r => r.id === rdvId);
        if (rdvIndex !== -1) {
          sourceDay = d;
          const rdv = rdvByDay[d][rdvIndex];
          rdvByDay[d].splice(rdvIndex, 1);

          if (rdvByDay[d].length === 0) {
            delete rdvByDay[d];
          }

          if (!rdvByDay[targetDay]) {
            rdvByDay[targetDay] = [];
          }
          rdvByDay[targetDay].push(rdv);

          if (rdvDetails[rdvId]) {
            const oldDate = rdvDetails[rdvId].time;
            const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
            const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
            const newDate = new Date(currentYear, currentMonth, targetDay);
            const timePart = oldDate.split('•')[1];
            rdvDetails[rdvId].time = `${dayNames[newDate.getDay()]} ${targetDay} ${monthNames[currentMonth]} ${currentYear} •${timePart}`;
          }

          const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
          addToHistory('move', rdvId, `RDV "${rdv.client}" déplacé du ${sourceDay} au ${targetDay} ${monthNames[currentMonth]}`);
          showToast(`RDV déplacé vers le ${targetDay} ${monthNames[currentMonth]}`, 'success');
          break;
        }
      }

      renderCalendar();
      updateRdvPanel(targetDay);

      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
      this.classList.add('selected');
      selectedDay = targetDay;
    });
  }

  return dayEl;
}

function updateRdvPanel(day) {
  const rdvDateEl = document.querySelector('.rdv-date');
  const rdvCountEl = document.querySelector('.rdv-count');
  const rdvListEl = document.querySelector('.rdv-list');

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const date = new Date(currentYear, currentMonth, day);
  rdvDateEl.textContent = `${dayNames[date.getDay()]} ${day} ${monthNames[currentMonth]} ${currentYear}`;

  let dayRdv = [];
  if (currentMonth === 9 && currentYear === 2025) {
    dayRdv = rdvByDay[day] || [];
  }

  const count = dayRdv.length;
  rdvCountEl.textContent = count === 0 ? 'Aucun rendez-vous' : count === 1 ? '1 rendez-vous' : `${count} rendez-vous`;

  rdvListEl.style.opacity = '0';
  rdvListEl.style.transform = 'translateY(10px)';

  setTimeout(() => {
    if (dayRdv.length === 0) {
      rdvListEl.innerHTML = '<div style="text-align: center; padding: 40px; color: #999; font-size: 14px;">Aucun rendez-vous prévu ce jour</div>';
    } else {
      rdvListEl.innerHTML = dayRdv.map(rdv => `
        <div class="rdv-item ${rdv.typeClass}" data-rdv-id="${rdv.id}">
          <div class="rdv-time">${rdv.time}</div>
          <div class="rdv-client">${rdv.client}</div>
          <span class="rdv-type ${rdv.typeClass}">${rdv.type}</span>
        </div>
      `).join('');

      document.querySelectorAll('.rdv-item').forEach(item => {
        let pressTimer = null;
        let isDragReady = false;

        item.addEventListener('mousedown', function(e) {
          pressTimer = setTimeout(() => {
            isDragReady = true;
            this.classList.add('drag-ready');
            this.setAttribute('draggable', 'true');
            showToast('Glissez pour déplacer le RDV', 'success');
          }, 500);
        });

        item.addEventListener('mouseup', function(e) {
          clearTimeout(pressTimer);
          if (!isDragReady) {
            openRdvModal(this.dataset.rdvId);
          }
        });

        item.addEventListener('mouseleave', function(e) {
          clearTimeout(pressTimer);
        });

        item.addEventListener('dragstart', function(e) {
          if (!isDragReady) {
            e.preventDefault();
            return;
          }
          this.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', this.dataset.rdvId);
        });

        item.addEventListener('dragend', function(e) {
          this.classList.remove('dragging');
          this.classList.remove('drag-ready');
          this.setAttribute('draggable', 'false');
          isDragReady = false;
        });
      });
    }

    requestAnimationFrame(() => {
      rdvListEl.style.transition = 'all 0.3s ease';
      rdvListEl.style.opacity = '1';
      rdvListEl.style.transform = 'translateY(0)';
    });
  }, 150);
}

// ============================================================================
// WEEK VIEW
// ============================================================================

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  return new Date(d.setDate(diff));
}

function navigateWeek(direction) {
  const newDate = new Date(currentWeekStart);
  newDate.setDate(newDate.getDate() + (direction * 7));
  currentWeekStart = newDate;
  renderWeekView();
}

function renderWeekView() {
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const fullDayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }

  const weekTitle = document.getElementById('week-title');
  const firstDay = weekDays[0];
  const lastDay = weekDays[6];
  weekTitle.textContent = `Semaine du ${firstDay.getDate()} ${monthNames[firstDay.getMonth()]} au ${lastDay.getDate()} ${monthNames[lastDay.getMonth()]} ${lastDay.getFullYear()}`;

  const weekContent = document.getElementById('week-content');
  const hours = Array.from({length: 12}, (_, i) => i + 8); // 8h à 19h

  let html = '<div class="week-grid" style="grid-template-columns: 80px repeat(7, 1fr);">';

  // Header row
  html += '<div class="week-time-label"></div>';
  weekDays.forEach((day, index) => {
    const isToday = day.toDateString() === new Date().toDateString();
    html += `
      <div class="week-day-header ${isToday ? 'today' : ''}">
        ${dayNames[index]}<br>${day.getDate()}
      </div>
    `;
  });

  // Time slots
  hours.forEach(hour => {
    html += `<div class="week-time-label">${String(hour).padStart(2, '0')}:00</div>`;

    weekDays.forEach(day => {
      const dayRdvs = getRdvForDate(day);
      const hourRdvs = dayRdvs.filter(rdv => {
        const rdvHour = parseInt(rdv.time.split(':')[0]);
        return rdvHour === hour;
      });

      html += '<div class="week-time-slot">';
      hourRdvs.forEach(rdv => {
        html += `
          <div class="week-rdv-item ${rdv.typeClass}" onclick="openRdvModal('${rdv.id}')">
            <div class="week-rdv-time">${rdv.time}</div>
            <div class="week-rdv-client">${rdv.client}</div>
          </div>
        `;
      });
      html += '</div>';
    });
  });

  html += '</div>';
  weekContent.innerHTML = html;
}

function getRdvForDate(date) {
  if (date.getMonth() !== 9 || date.getFullYear() !== 2025) {
    return [];
  }
  const day = date.getDate();
  return rdvByDay[day] || [];
}

// ============================================================================
// DAY VIEW
// ============================================================================

function navigateDay(direction) {
  const newDate = new Date(currentDayDate);
  newDate.setDate(newDate.getDate() + direction);
  currentDayDate = newDate;
  renderDayView();
}

function renderDayView() {
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const fullDayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const dayTitle = document.getElementById('day-title');
  dayTitle.textContent = `${fullDayNames[currentDayDate.getDay()]} ${currentDayDate.getDate()} ${monthNames[currentDayDate.getMonth()]} ${currentDayDate.getFullYear()}`;

  const dayContent = document.getElementById('day-content');
  const dayRdvs = getRdvForDate(currentDayDate);

  if (dayRdvs.length === 0) {
    dayContent.innerHTML = `
      <div style="text-align: center; padding: 100px 40px; color: #999;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 64px; height: 64px; margin: 0 auto 20px; stroke: url(#gradient-stroke);">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <h3 style="margin-bottom: 10px; font-size: 20px; color: #000;">Aucun rendez-vous</h3>
        <p>Aucun rendez-vous prévu pour cette journée</p>
        <button class="add-rdv-btn" onclick="openAddRdvModal('${currentDayDate.toISOString().split('T')[0]}')" style="margin-top: 20px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Ajouter un RDV
        </button>
      </div>
    `;
  } else {
    let html = '<div class="day-timeline">';

    const hours = Array.from({length: 13}, (_, i) => i + 7); // 7h à 19h

    hours.forEach(hour => {
      html += `
        <div class="day-time-label">${String(hour).padStart(2, '0')}:00</div>
        <div class="day-events-column">
      `;

      const hourRdvs = dayRdvs.filter(rdv => {
        const rdvHour = parseInt(rdv.time.split(':')[0]);
        return rdvHour === hour;
      });

      if (hourRdvs.length > 0) {
        hourRdvs.forEach(rdv => {
          const details = rdvDetails[rdv.id];
          html += `
            <div class="day-rdv-item" onclick="openRdvModal('${rdv.id}')">
              <div class="day-rdv-header">
                <div class="day-rdv-time">${rdv.time}</div>
                <div class="day-rdv-badge ${rdv.typeClass}">${rdv.type}</div>
              </div>
              <div class="day-rdv-client">${rdv.client}</div>
              ${details && details.description ? `<div class="day-rdv-description">${details.description}</div>` : ''}
            </div>
          `;
        });
      } else {
        html += `
          <div class="day-time-slot" onclick="openAddRdvModal('${currentDayDate.toISOString().split('T')[0]}')">
            <div style="text-align: center; color: #999; font-size: 12px;">Créneau disponible</div>
          </div>
        `;
      }

      html += '</div>';
    });

    html += '</div>';
    dayContent.innerHTML = html;
  }
}

// ============================================================================
// FILTER FUNCTIONS
// ============================================================================

function filterByType(type, element) {
  currentFilter = type;

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.classList.remove('active');
  });
  element.classList.add('active');

  document.querySelectorAll('.rdv-item').forEach(item => {
    if (type === 'all' || item.classList.contains('type-' + type)) {
      item.style.display = 'block';
      item.style.animation = 'fadeInItem 0.3s ease forwards';
    } else {
      item.style.animation = 'fadeOutItem 0.3s ease forwards';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });

  document.querySelectorAll('.calendar-day-dot').forEach((dot, index) => {
    const dotType = dot.getAttribute('data-type');

    if (type === 'all' || dotType === type) {
      setTimeout(() => {
        dot.classList.remove('hidden');
        dot.classList.add('visible');
      }, index * 30);
    } else {
      setTimeout(() => {
        dot.classList.add('hidden');
        dot.classList.remove('visible');
      }, index * 20);
    }
  });

  const visibleRdv = document.querySelectorAll('.rdv-item[style*="display: block"]').length;
  const rdvCountElement = document.querySelector('.rdv-count');
  if (rdvCountElement) {
    rdvCountElement.textContent = visibleRdv === 0 ? 'Aucun rendez-vous' : visibleRdv === 1 ? '1 rendez-vous' : `${visibleRdv} rendez-vous`;
  }
}

// ============================================================================
// FORM HANDLING
// ============================================================================

function handleFormSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById('rdvEditId').value;
  const isEdit = editId !== '';
  const type = document.getElementById('rdvType').value;

  let clientName = '';
  if (type === 'conge') {
    const motifInput = document.getElementById('rdvMotif');
    clientName = motifInput ? motifInput.value : 'Jour bloqué';
  } else {
    clientName = document.getElementById('rdvClient').value;
  }

  const formData = {
    client: clientName,
    type: type,
    date: document.getElementById('rdvDate').value,
    time: document.getElementById('rdvTime').value,
    duration: parseFloat(document.getElementById('rdvDuration').value),
    phone: type === 'conge' ? '' : document.getElementById('rdvPhone').value,
    address: type === 'conge' ? '' : document.getElementById('rdvAddress').value,
    description: type === 'conge' ? '' : document.getElementById('rdvDescription').value
  };

  const [hours, minutes] = formData.time.split(':').map(Number);
  const endHour = hours + Math.floor(formData.duration);
  const endMinute = minutes + ((formData.duration % 1) * 60);
  const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

  const timeStr = `${formData.time} - ${endTime}`;

  const dateObj = new Date(formData.date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();

  const typeClassMap = {
    'devis': 'type-devis',
    'installation': 'type-installation',
    'maintenance': 'type-maintenance',
    'urgence': 'type-urgence',
    'conge': 'type-conge'
  };

  const typeNameMap = {
    'devis': 'Devis',
    'installation': 'Installation',
    'maintenance': 'Maintenance',
    'urgence': 'Urgence',
    'conge': 'Jour bloqué'
  };

  const rdvId = isEdit ? editId : `rdv${rdvIdCounter++}`;
  const typeClass = typeClassMap[formData.type];
  const typeName = typeNameMap[formData.type];

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const fullDateStr = `${dayNames[dateObj.getDay()]} ${day} ${monthNames[month]} ${year} • ${timeStr}`;

  const rdvData = {
    id: rdvId,
    time: timeStr,
    client: formData.client,
    type: `${typeName}`,
    typeClass: typeClass
  };

  const rdvDetailData = {
    client: formData.client,
    time: fullDateStr,
    type: typeName,
    typeClass: typeClass,
    address: formData.address,
    phone: formData.phone,
    duration: `${Math.floor(formData.duration)}h${String((formData.duration % 1) * 60).padStart(2, '0')}`,
    description: formData.description
  };

  rdvDetails[rdvId] = rdvDetailData;

  if (isEdit) {
    for (let d in rdvByDay) {
      rdvByDay[d] = rdvByDay[d].filter(r => r.id !== rdvId);
      if (rdvByDay[d].length === 0) delete rdvByDay[d];
    }
    addToHistory('edit', rdvId, `RDV "${formData.client}" modifié`);
  } else {
    addToHistory('create', rdvId, `RDV "${formData.client}" créé pour le ${day} ${monthNames[month]}`);
  }

  if (!rdvByDay[day]) {
    rdvByDay[day] = [];
  }
  rdvByDay[day].push(rdvData);

  closeAddRdvModal();
  renderCalendar();

  if (month === currentMonth && year === currentYear) {
    selectedDay = day;
    updateRdvPanel(day);
  }

  showToast(isEdit ? 'Rendez-vous modifié avec succès' : 'Rendez-vous créé avec succès', 'success');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize month view
  document.getElementById('month-view').style.display = 'block';
  setTimeout(() => {
    document.getElementById('month-view').classList.add('active');
  }, 10);

  updateDropdownSelections();
  renderCalendar();
  updateRdvPanel(20);

  // Initialize week and day dates
  currentWeekStart = getWeekStart(new Date(currentYear, currentMonth, selectedDay));
  currentDayDate = new Date(currentYear, currentMonth, selectedDay);

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.calendar-dropdown')) {
      document.querySelectorAll('.calendar-dropdown-trigger').forEach(trigger => {
        trigger.classList.remove('active');
      });
      document.querySelectorAll('.calendar-dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
      });
    }
  });

  // Modal backdrop close
  document.getElementById('rdvModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('rdvModal')) {
      closeRdvModal();
    }
  });

  document.getElementById('addRdvModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('addRdvModal')) {
      closeAddRdvModal();
    }
  });

  // Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRdvModal();
      closeAddRdvModal();
    }
  });

  // Form submission
  document.getElementById('rdvForm').addEventListener('submit', handleFormSubmit);
});
