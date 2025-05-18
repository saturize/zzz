const fs = require('fs');
const path = require('path');

// Fonction pour charger les adjectifs du fichier JSONL
function loadAdjectivesList() {
  try {
    // Chemin vers le fichier JSONL dans le dossier ressources
    const filePath = path.join(__dirname, 'ressources', 'kaikki.org-dictionary-French-by-pos-adj.jsonl');
    
    // Lire le fichier JSONL
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Diviser le contenu en lignes et parser chaque ligne comme un objet JSON
    const lines = fileContent.trim().split('\n');
    const adjectivesList = [];
    
    for (const line of lines) {
      try {
        const adjObj = JSON.parse(line);
        
        // Vérifier que c'est bien un adjectif et qu'il a une propriété word
        if (adjObj.pos === "adj" && adjObj.word) {
          adjectivesList.push(adjObj.word);
        }
      } catch (parseError) {
        console.error('Erreur lors du parsing d\'une ligne JSON:', parseError);
        // Continuer avec la ligne suivante
      }
    }
    
    console.log(`Chargement réussi de ${adjectivesList.length} adjectifs`);
    return adjectivesList;
  } catch (error) {
    console.error('Erreur lors du chargement des adjectifs:', error);
    // Retourner une liste de repli en cas d'erreur
    return [
      "motivé", "dynamique", "innovant", "créatif", "ambitieux", 
      "énergique", "talentueux", "passionné", "entreprenant", "déterminé"
    ];
  }
}

// Charger les adjectifs
const adjectives = loadAdjectivesList();

module.exports = adjectives;
