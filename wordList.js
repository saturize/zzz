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

        const hasFormOf = adjObj.senses?.some(sense => sense.tags?.includes("form-of"));
        if (hasFormOf) continue;

        // IGNORE PLURAL
        const isPlural =
          adjObj.senses?.some(sense =>
            sense.tags?.includes("plural") ||
            sense.glosses?.some(gloss => gloss.toLowerCase().includes("plural of"))
          ) ||
          adjObj.word.endsWith("s");

        if (isPlural) continue;

        adjectivesList.add(adjObj.word);

      } catch (err) {
        console.error('Erreur parsing ligne JSON:', err);
      }
    }

    const finalList = Array.from(adjectivesList);
    console.log(`✔️ ${finalList.length} adjectifs singuliers chargés`);
    return finalList;

  } catch (error) {
    console.error('Erreur chargement fichier adjectifs:', error);
    return [
      "belle", "motivé", "gentille", "sombre", "énergique"
    ];
  }
}

const adjectives = loadAdjectivesList();
module.exports = adjectives;