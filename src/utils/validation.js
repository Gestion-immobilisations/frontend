export const validateInterventionForm = (data) => {
  const errors = {};

  if (!data.id_bien) {
    errors.id_bien = 'Veuillez sélectionner un équipement.';
  }

  if (!data.type_intervention) {
    errors.type_intervention = 'Veuillez choisir un type d\'intervention.';
  }

  if (!data.date_prevue) {
    errors.date_prevue = 'La date prévue est obligatoire.';
  } else {
    const selected = new Date(data.date_prevue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(selected.getTime())) {
      errors.date_prevue = 'Date invalide.';
    }
  }

  if (!data.priorite) {
    errors.priorite = 'Veuillez indiquer la priorité.';
  }

  const desc = (data.description || '').trim();
  if (!desc) {
    errors.description = 'La description est obligatoire.';
  } else if (desc.length < 10) {
    errors.description = 'La description doit contenir au moins 10 caractères.';
  }

  if (data.cout_estime !== '' && data.cout_estime != null) {
    const cout = Number(data.cout_estime);
    if (Number.isNaN(cout) || cout < 0) {
      errors.cout_estime = 'Le coût estimé doit être un nombre positif.';
    }
  }

  return errors;
};

export const validatePanneForm = (data) => {
  const errors = {};

  if (!data.id_bien) {
    errors.id_bien = 'Veuillez sélectionner un équipement.';
  }

  if (!data.urgence) {
    errors.urgence = 'Veuillez indiquer le niveau d\'urgence.';
  }

  const desc = (data.description || '').trim();
  if (!desc) {
    errors.description = 'La description est obligatoire.';
  } else if (desc.length < 10) {
    errors.description = 'La description doit contenir au moins 10 caractères.';
  }

  return errors;
};

export const validatePieceForm = (data) => {
  const errors = {};

  if (!(data.reference || '').trim()) {
    errors.reference = 'La référence est obligatoire.';
  }
  if (!(data.designation || '').trim()) {
    errors.designation = 'La désignation est obligatoire.';
  }
  const qty = Number(data.quantite);
  if (Number.isNaN(qty) || qty < 0) {
    errors.quantite = 'La quantité doit être un nombre positif.';
  }
  const seuil = Number(data.seuil_alerte);
  if (Number.isNaN(seuil) || seuil < 0) {
    errors.seuil_alerte = 'Le seuil d\'alerte doit être un nombre positif.';
  }

  return errors;
};
