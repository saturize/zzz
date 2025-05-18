const fs = require('fs');
const path = require('path');

function loadAdjectivesList() {
  try {
    const filePath = path.join(__dirname, 'ressources', 'kaikki.org-dictionary-French-by-pos-adj.jsonl');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.trim().split('\n');
    const adjectivesList = new Set();

    for (const line of lines) {
      try {
        const adjObj = JSON.parse(line);

        if (!adjObj.word) continue;

        const word = adjObj.word.trim();

        // NO PLURAL
        if (word.endsWith('s')) continue;

        adjectivesList.add(word);

      } catch (err) {
        console.error('Erreur parsing ligne JSON:', err);
      }
    }

    const finalList = Array.from(adjectivesList);
    console.log(`✔️ ${finalList.length} adjectifs singuliers sans 's' finaux`);
    return finalList;

  } catch (error) {
    console.error('Erreur chargement adjectifs:', error);
    return ["motivé", "créative", "gentille"];
  }
}

const adjectives = loadAdjectivesList();
module.exports = adjectives;