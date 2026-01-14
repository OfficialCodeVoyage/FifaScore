const fs = require('fs');
const path = require('path');

const teams = [
  { file: 'real-madrid.svg', name: 'RMA', bg: '#FFFFFF', text: '#00529F' },
  { file: 'barcelona.svg', name: 'BAR', bg: '#A50044', text: '#FFFFFF' },
  { file: 'atletico-madrid.svg', name: 'ATM', bg: '#CB3524', text: '#FFFFFF' },
  { file: 'real-sociedad.svg', name: 'RSO', bg: '#0067B1', text: '#FFFFFF' },
  { file: 'villarreal.svg', name: 'VIL', bg: '#FFE114', text: '#005DAA' },
  { file: 'man-city.svg', name: 'MCI', bg: '#6CABDD', text: '#1C2C5B' },
  { file: 'liverpool.svg', name: 'LIV', bg: '#C8102E', text: '#FFFFFF' },
  { file: 'arsenal.svg', name: 'ARS', bg: '#EF0107', text: '#FFFFFF' },
  { file: 'chelsea.svg', name: 'CHE', bg: '#034694', text: '#FFFFFF' },
  { file: 'man-united.svg', name: 'MUN', bg: '#DA291C', text: '#FBE122' },
  { file: 'tottenham.svg', name: 'TOT', bg: '#132257', text: '#FFFFFF' },
  { file: 'newcastle.svg', name: 'NEW', bg: '#241F20', text: '#FFFFFF' },
  { file: 'aston-villa.svg', name: 'AVL', bg: '#670E36', text: '#95BFE5' },
  { file: 'brighton.svg', name: 'BHA', bg: '#0057B8', text: '#FFFFFF' },
  { file: 'west-ham.svg', name: 'WHU', bg: '#7A263A', text: '#1BB1E7' },
  { file: 'bayern.svg', name: 'BAY', bg: '#DC052D', text: '#FFFFFF' },
  { file: 'dortmund.svg', name: 'BVB', bg: '#FDE100', text: '#000000' },
  { file: 'leverkusen.svg', name: 'LEV', bg: '#E32221', text: '#000000' },
  { file: 'leipzig.svg', name: 'RBL', bg: '#DD0741', text: '#FFFFFF' },
  { file: 'frankfurt.svg', name: 'SGE', bg: '#E1000F', text: '#FFFFFF' },
  { file: 'inter.svg', name: 'INT', bg: '#010E80', text: '#FFFFFF' },
  { file: 'ac-milan.svg', name: 'ACM', bg: '#FB090B', text: '#000000' },
  { file: 'juventus.svg', name: 'JUV', bg: '#000000', text: '#FFFFFF' },
  { file: 'napoli.svg', name: 'NAP', bg: '#12A0D7', text: '#FFFFFF' },
  { file: 'atalanta.svg', name: 'ATA', bg: '#1E71B8', text: '#000000' },
  { file: 'roma.svg', name: 'ROM', bg: '#8E1F2F', text: '#F0BC42' },
  { file: 'lazio.svg', name: 'LAZ', bg: '#87D8F7', text: '#FFFFFF' },
  { file: 'psg.svg', name: 'PSG', bg: '#004170', text: '#DA291C' },
  { file: 'marseille.svg', name: 'OM', bg: '#2FAEE0', text: '#FFFFFF' },
  { file: 'monaco.svg', name: 'MON', bg: '#E30613', text: '#FFFFFF' },
  { file: 'lyon.svg', name: 'LYO', bg: '#0C3D72', text: '#DA291C' },
  { file: 'benfica.svg', name: 'BEN', bg: '#E41B23', text: '#FFFFFF' },
  { file: 'porto.svg', name: 'POR', bg: '#003893', text: '#FFFFFF' },
  { file: 'sporting.svg', name: 'SCP', bg: '#00A54F', text: '#FFFFFF' },
  { file: 'ajax.svg', name: 'AJA', bg: '#D2122E', text: '#FFFFFF' },
  { file: 'psv.svg', name: 'PSV', bg: '#ED1C24', text: '#FFFFFF' },
  { file: 'al-nassr.svg', name: 'NAS', bg: '#FFCC00', text: '#003366' },
  { file: 'al-hilal.svg', name: 'HIL', bg: '#003399', text: '#FFFFFF' },
  { file: 'al-ittihad.svg', name: 'ITT', bg: '#000000', text: '#FFD700' },
  { file: 'celtic.svg', name: 'CEL', bg: '#008844', text: '#FFFFFF' },
  { file: 'rangers.svg', name: 'RAN', bg: '#1B458F', text: '#FFFFFF' },
  { file: 'galatasaray.svg', name: 'GAL', bg: '#FDB913', text: '#C2171C' },
  { file: 'fenerbahce.svg', name: 'FEN', bg: '#FFED00', text: '#00235D' },
  { file: 'inter-miami.svg', name: 'MIA', bg: '#F5B5C8', text: '#231F20' },
  { file: 'la-galaxy.svg', name: 'LAG', bg: '#00245D', text: '#FFD200' },
];

const generateSvg = (name, bg, text) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="12" fill="${bg}"/>
  <text x="50" y="58" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${text}" text-anchor="middle">${name}</text>
</svg>`;

const logosDir = path.join(__dirname, '..', 'public', 'logos');

teams.forEach(team => {
  const filePath = path.join(logosDir, team.file);
  // Only generate if file doesn't exist or is small (failed download)
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > 2000) {
      // Check if it's actually an SVG (not HTML)
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('<svg') || content.includes('<?xml')) {
        console.log(`Keeping existing: ${team.file}`);
        return;
      }
    }
  } catch (e) {
    // File doesn't exist, will create
  }

  const svg = generateSvg(team.name, team.bg, team.text);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated: ${team.file}`);
});

console.log('Done!');
