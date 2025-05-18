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
        
        if (adjObj.pos === "adj" && adjObj.word) {
        
            // PLURAL ??
          let isPlural = false;
          
          if (adjObj.senses && Array.isArray(adjObj.senses)) {
            for (const sense of adjObj.senses) {
              if (
                (sense.tags && sense.tags.includes("plural")) || 
                (sense.glosses && sense.glosses.some(gloss => gloss.includes("plural of")))
              ) {
                isPlural = true;
                break;
              }
            }
          }
          
          if (
            adjObj.word.includes("pluriel") || 
            adjObj.word.includes("pluraux") || 
            (adjObj.head_templates && adjObj.head_templates.some(
              template => template.expansion && (
                template.expansion.includes("plural") || 
                template.expansion.includes("pluriel") || 
                template.expansion.includes("pluraux")
              )
            ))
          ) {
            isPlural = true;
          }
          
          if (!isPlural) {
            adjectivesList.push(adjObj.word);
          }
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