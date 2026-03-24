const fs = require("fs");

const dataPath = "c:\\Users\\idkth\\Documents\\scion\\ma_extracted_data.json";
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const uaeLinks = {
  "aurora-opulence":
    "https://www.amazon.ae/Maison-lAvenir-Aurora-Opulence-Fragrance/dp/B0DGLHZCNX",
  "eternal-oud":
    "https://www.amazon.ae/Maison-lAvenir-Eternal-Oud-Fragrance/dp/B0DGLLSH43",
  "ethereal-embrace":
    "https://www.amazon.ae/Maison-lAvenir-Ethereal-Embrace-Fragrance/dp/B0DGLM918B",
  "jardin-de-jade":
    "https://www.amazon.ae/Maison-lAvenir-Jardin-Jade-Fragrance/dp/B0DG919KGY",
  "noir-intense":
    "https://www.amazon.ae/Maison-lAvenir-Noir-Intense-Fragrance/dp/B0DZX2RL6P",
  "avenir-triumph": "https://www.amazon.ae/dp/B0DGLLSZ3Z",
  "electra-elixir": "https://www.amazon.ae/dp/B0DG91RTPJ",
  "majestic-millenium": "https://www.amazon.ae/dp/B0DG91RP8F",
  "midnight-solstice": "https://www.amazon.ae/dp/B0DGLLPVM4",
  "nebula-nectar": "https://www.amazon.ae/dp/B0DG91YF2G",
  "nova-noir": "https://www.amazon.ae/dp/B0DGLLPVM4",
  "opulent-odyssey": "https://www.amazon.ae/dp/B0DG91LRYK",
  "oud-intense": "https://www.amazon.ae/dp/B0DG91RP8F",
  "oud-opulence": "https://www.amazon.ae/dp/B0DG91LRYK",
  "vortex-echo": "https://www.amazon.ae/dp/B0DGLLS26V",
};

// Update the data
for (const slug in data) {
  if (uaeLinks[slug]) {
    data[slug].uaeLink = uaeLinks[slug];
  } else {
    // Default to search if not found
    data[slug].uaeLink =
      `https://www.amazon.ae/s?k=Maison+de+lAvenir+${data[slug].title.replace(/ /g, "+")}`;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log("Updated ma_extracted_data.json with UAE links.");
