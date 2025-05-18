const fs = require('fs');
const path = require('path');

function loadAdjectivesList() {
  try {
    const filePath = path.join(__dirname, 'ressources', 'kaikki.org-dictionary-French-by-pos-adj.jsonl');
    
    // LECTURE
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // PARSING LIGNE
    const lines = fileContent.trim().split('\n');
    const adjectivesList = [];
    
    // PARSING
    for (const line of lines) {
      try {
        const adjObj = JSON.parse(line);
        
        // WORD
        if (adjObj.pos === "adj" && adjObj.word) {
          // SINGLE ONLY
          const isSingular = true;
          
          if (adjObj.forms && Array.isArray(adjObj.forms)) {
            const mainForm = adjObj.forms.find(form => form.form === adjObj.word);
            if (mainForm && mainForm.tags && mainForm.tags.includes("plural")) {
              continue;
            }
          }
          
          adjectivesList.push(adjObj.word);
        }
      } catch (parseError) {
        console.error('Erreur lors du parsing d\'une ligne JSON:', parseError);
      }
    }
    
    console.log(`Chargement réussi de ${adjectivesList.length} adjectifs (uniquement singulier)`);
    return adjectivesList;
  } catch (error) {
    console.error('Erreur lors du chargement des adjectifs:', error);
    return [
      "motivé", "dynamique", "innovant", "créatif", "ambitieux", 
      "énergique", "talentueux", "passionné", "entreprenant", "déterminé"
    ];
  }
}

const adjectives = loadAdjectivesList();

module.exports = adjectives;