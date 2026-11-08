// Spectral Kubelka-Munk pigment engine
const WL = []; for (let l = 400; l <= 700; l += 10) WL.push(l);
const sig = x => 1 / (1 + Math.exp(-x));
const g = (l, mu, w) => Math.exp(-(((l - mu) / w) ** 2));
const lobe = (x, mu, s1, s2) => { const s = x < mu ? s1 : s2; return Math.exp(-0.5 * ((x - mu) / s) ** 2); };
const CMF = WL.map(l => [
  1.056 * lobe(l, 599.8, 37.9, 31.0) + 0.362 * lobe(l, 442.0, 16.0, 26.7) - 0.065 * lobe(l, 501.1, 20.4, 26.2),
  0.821 * lobe(l, 568.8, 46.9, 40.5) + 0.286 * lobe(l, 530.9, 16.3, 31.1),
  1.217 * lobe(l, 437.0, 11.8, 36.0) + 0.681 * lobe(l, 459.0, 26.0, 13.8)
]);
const WHITE_E = CMF.reduce((a, c) => [a[0] + c[0], a[1] + c[1], a[2] + c[2]], [0, 0, 0]);
const D65 = [0.95047, 1, 1.08883];

const PIGMENTS = [
  { id: 'ru', op: 0.16, name: 'Raw Umber', T: 0.4, f: l => 0.03 + 0.07 * sig((l - 560) / 45) },
  { id: 'bu', op: 0.14, name: 'Burnt Umber', T: 0.4, f: l => 0.03 + 0.10 * sig((l - 600) / 35) },
  { id: 'ib', op: 0.12, name: 'Ivory Black', T: 0.45, f: l => 0.022 + 0.003 * (700 - l) / 300 },
  { id: 'um', op: 0.12, name: 'Ultramarine Blue', T: 0.4, f: l => 0.025 + 0.24 * lobe(l, 440, 26, 42) + 0.07 * sig((l - 672) / 12) },
  { id: 'kbl', op: 0.85, name: "King's Blue Light", pigment: 'PB29, PW6', T: 0.7, f: l => 0.22 + 0.55 * lobe(l, 450, 32, 44) + 0.12 * sig((l - 660) / 14) },
  { id: 'cb', op: 0.5, name: 'Cobalt Blue', T: 0.22, f: l => 0.04 + 0.40 * lobe(l, 455, 30, 45) + 0.04 * sig((l - 670) / 15) },
  { id: 'cv', op: 0.45, name: 'Cobalt Violet', T: 0.18, f: l => 0.10 + 0.45 * sig((l - 605) / 18) + 0.42 * g(l, 435, 40) },
  { id: 'ac', op: 0.06, name: 'Alizarin Crimson', T: 0.55, f: l => 0.025 + 0.45 * sig((l - 628) / 14) + 0.05 * g(l, 415, 30) },
  { id: 'mg', op: 0.1, name: 'Magenta', T: 0.6, f: l => 0.05 + 0.62 * sig((l - 610) / 14) + 0.28 * g(l, 430, 38) },
  { id: 'bp', op: 0.75, name: 'Brilliant Pink', pigment: 'PR112, PR122, PW6', T: 1.0, f: l => 0.15 + 0.75 * sig((l - 595) / 13) + 0.25 * g(l, 420, 38) - 0.05 * g(l, 545, 30) },
  { id: 'bs', op: 0.08, name: 'Burnt Sienna', pigment: 'PR101', T: 0.55, f: l => 0.032 + 0.40 * sig((l - 598) / 16) },
  { id: 'co', op: 1.0, name: 'Cadmium Orange', T: 0.45, f: l => 0.05 + 0.82 * sig((l - 578) / 11) },
  { id: 'tw', op: 1.2, name: 'Titanium White', T: 1, f: l => 0.93 - 0.08 * g(l, 400, 20) },
  { id: 'cy', op: 1.0, name: 'Cadmium Yellow Pale', T: 0.9, f: l => 0.06 + 0.84 * sig((l - 512) / 10) },
  { id: 'bgl', op: 0.07, name: 'Bright Green Lake', pigment: 'PG7, PY74', T: 0.9, f: l => 0.028 + 0.26 * lobe(l, 535, 24, 40) + 0.03 * sig((l - 610) / 20) },
  { id: 'vg', op: 0.12, name: 'Viridian Green Deep', T: 0.3, f: l => 0.03 + 0.13 * lobe(l, 505, 35, 40) },
  { id: 'mb', op: 0.2, name: 'Manganese Blue', T: 0.6, f: l => 0.035 + 0.28 * lobe(l, 478, 35, 45) },
  { id: 'cr', op: 0.06, name: 'Caribbean Blue', pigment: 'PB16 (Old Holland)', T: 1.5, f: l => 0.012 + 0.26 * lobe(l, 476, 28, 34) },
  // historical pigments used by other painters' palettes (see PALETTES in the page)
  { id: 'cym', op: 1.0, name: 'Cadmium Yellow', T: 0.5, f: l => 0.05 + 0.86 * sig((l - 530) / 10) },
  { id: 'my', op: 0.95, name: 'Mars Yellow', T: 0.35, f: l => 0.05 + 0.46 * sig((l - 560) / 18) },
  { id: 'yo', op: 0.7, name: 'Yellow Ochre', T: 0.3, f: l => 0.09 + 0.47 * sig((l - 545) / 24) },
  { id: 'vm', op: 1.0, name: 'Vermilion', T: 0.7, f: l => 0.07 + 0.57 * sig((l - 608) / 10) }, // matched to Michael's reference swatch, about 7.5R 4.6/10
  { id: 'mr', op: 0.95, name: 'Mars Red', T: 0.5, f: l => 0.05 + 0.42 * sig((l - 602) / 17) },
  { id: 'rm', op: 0.05, name: 'Rose Madder', T: 0.3, f: l => 0.06 + 0.66 * sig((l - 612) / 14) + 0.2 * g(l, 420, 35) },
  { id: 'rs', op: 0.2, name: 'Raw Sienna', T: 0.3, f: l => 0.06 + 0.48 * sig((l - 565) / 26) },
  { id: 'eg', op: 0.5, name: 'Emerald Green', T: 0.5, f: l => 0.05 + 0.55 * lobe(l, 520, 28, 38) },
  { id: 'zy', op: 0.5, name: 'Zinc Yellow', T: 0.3, f: l => 0.08 + 0.8 * sig((l - 505) / 12) },
  { id: 'ro', op: 0.9, name: 'Red Ochre', T: 0.45, f: l => 0.06 + 0.32 * sig((l - 595) / 22) },
  { id: 'rl', op: 0.05, name: 'Red Lake', T: 0.45, f: l => 0.04 + 0.6 * sig((l - 618) / 13) + 0.1 * g(l, 415, 30) },
  // 19th-century French academic colors (Gérôme): light red is a calcined, slightly orange iron-oxide red; purple lake a transparent violet-red lake
  // Michael's Quinacridone Yellow, matched to his swatch: a transparent warm yellow-orange that absorbs the blues and greens
  { id: 'qy', op: 0.08, name: 'Quinacridone Yellow', T: 0.42, f: l => 0.046 + 0.424 * sig((l - 591.6) / 19.5) },
  { id: 'lr', op: 0.9, name: 'Light Red', T: 0.45, f: l => 0.055 + 0.36 * sig((l - 603) / 16) },
  { id: 'pl', op: 0.05, name: 'Purple Lake', T: 0.32, f: l => 0.045 + 0.47 * sig((l - 618) / 15) + 0.19 * g(l, 426, 34) },
  { id: 'bo', op: 0.7, name: 'Brown Ochre', T: 0.4, f: l => 0.05 + 0.2 * sig((l - 575) / 35) },
  { id: 'pb', op: 0.05, name: 'Prussian Blue', T: 1.3, f: l => 0.02 + 0.16 * lobe(l, 470, 30, 45) + 0.03 * sig((l - 690) / 10) },
  { id: 'mbk', op: 0.9, name: 'Mars Black', T: 0.5, f: l => 0.03 + 0.008 * (l - 400) / 300 },
  // idealised spectral pigments: each reflects a band of light peaking at one wavelength, every 25 nm across the visible
  { id: 'sp400', op: 0.9, name: 'Spectral 400 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 400, 28, 28) },
  { id: 'sp425', op: 0.9, name: 'Spectral 425 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 425, 28, 28) },
  { id: 'sp450', op: 0.9, name: 'Spectral 450 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 450, 28, 28) },
  { id: 'sp475', op: 0.9, name: 'Spectral 475 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 475, 28, 28) },
  { id: 'sp500', op: 0.9, name: 'Spectral 500 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 500, 28, 28) },
  { id: 'sp525', op: 0.9, name: 'Spectral 525 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 525, 28, 28) },
  { id: 'sp550', op: 0.9, name: 'Spectral 550 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 550, 28, 28) },
  { id: 'sp575', op: 0.9, name: 'Spectral 575 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 575, 28, 28) },
  { id: 'sp600', op: 0.9, name: 'Spectral 600 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 600, 28, 28) },
  { id: 'sp625', op: 0.9, name: 'Spectral 625 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 625, 28, 28) },
  { id: 'sp650', op: 0.9, name: 'Spectral 650 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 650, 28, 28) },
  { id: 'sp675', op: 0.9, name: 'Spectral 675 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 675, 28, 28) },
  { id: 'sp700', op: 0.9, name: 'Spectral 700 nm', T: 0.7, f: l => 0.02 + 0.85 * lobe(l, 700, 28, 28) },
  // 17th-century pigments for Van Dyck's palette (National Gallery technical studies)
  { id: 'lty', op: 0.9, name: 'Lead-Tin Yellow', T: 0.35, f: l => 0.18 + 0.52 * sig((l - 508) / 18) },
  { id: 'vdb', op: 0.1, name: 'Cologne Earth', T: 0.35, f: l => 0.025 + 0.05 * sig((l - 585) / 45) },
  { id: 'az', op: 0.5, name: 'Azurite', T: 0.15, f: l => 0.06 + 0.3 * lobe(l, 472, 40, 45) },
  { id: 'sm', op: 0.1, name: 'Smalt', T: 0.1, f: l => 0.08 + 0.25 * lobe(l, 440, 30, 50) + 0.12 * sig((l - 660) / 20) },
  { id: 'nu', op: 0.15, name: 'Natural Ultramarine', pigment: 'PB29 (lazurite)', T: 0.25, f: l => 0.0308 + 0.1338 * lobe(l, 443.2, 26, 42) + 0.0181 * sig((l - 672) / 12) }, // masstone 6.25PB 2.5/7
  { id: 'vdg', op: 0.15, name: 'Verdigris', T: 0.4, f: l => 0.04 + 0.25 * lobe(l, 500, 35, 45) },
  // Michael Harding colours for the wide-gamut Harding palette (pigment codes from his chart)
  { id: 'hcl', op: 0.85, name: 'Cadmium Yellow Lemon', pigment: 'PY35', T: 0.7, f: l => 0.11 + 0.74 * sig((l - 506) / 10) },
  { id: 'hcd', op: 1.0, name: 'Cadmium Yellow Deep', pigment: 'PY35', T: 0.6, f: l => 0.08 + 0.74 * sig((l - 546) / 10) },
  { id: 'hcr', op: 1.0, name: 'Cadmium Red Light', pigment: 'PR108', T: 0.6, f: l => 0.05 + 0.78 * sig((l - 596) / 9) },
  { id: 'huv', op: 0.1, name: 'Ultramarine Violet', pigment: 'PV15', T: 0.25, f: l => 0.04 + 0.2 * lobe(l, 420, 25, 40) + 0.24 * sig((l - 632) / 18) },
  { id: 'hpb', op: 0.04, name: 'Phthalo Blue', pigment: 'PB15:3', T: 0.7, f: l => 0.008 + 0.2 * lobe(l, 468, 30, 30) + 0.02 * sig((l - 690) / 10) },
  { id: 'hpt', op: 0.8, name: 'Phthalo Turquoise', pigment: 'PB15:3, PG7, PW4, PW6', T: 1.2, f: l => 0.06 + 0.55 * lobe(l, 490, 35, 40) },
  { id: 'hpg', op: 0.04, name: 'Phthalo Green', pigment: 'PG7', T: 1.1, f: l => 0.015 + 0.17 * lobe(l, 496, 26, 32) },
];
// historical pigments refit to the swatches in Michael Harding's colour chart and Michael's own colours matched to his reference swatches: Raw Umber, Burnt Umber, Ivory Black and Ultramarine take hue from the swatch with value kept, since photographed darks read too dark
const HARDING_R = {"cym": [0.0811, 0.0811, 0.0811, 0.0811, 0.0811, 0.0811, 0.0812, 0.0816, 0.0824, 0.0848, 0.0911, 0.1075, 0.1478, 0.2333, 0.3703, 0.5179, 0.624, 0.68, 0.7043, 0.7138, 0.7174, 0.7188, 0.7193, 0.7195, 0.7195, 0.7196, 0.7196, 0.7196, 0.7196, 0.7196, 0.7196], "yo": [0.0555, 0.0555, 0.0559, 0.0568, 0.058, 0.0599, 0.0628, 0.0671, 0.0734, 0.0827, 0.0962, 0.1151, 0.141, 0.1747, 0.2164, 0.2644, 0.3154, 0.3655, 0.4107, 0.4486, 0.4784, 0.5008, 0.5169, 0.5282, 0.536, 0.5412, 0.5448, 0.5471, 0.5487, 0.5498, 0.5504], "rs": [0.0266, 0.0266, 0.0266, 0.0269, 0.0273, 0.0279, 0.0288, 0.0302, 0.0321, 0.0349, 0.0388, 0.0445, 0.0525, 0.0635, 0.0784, 0.0976, 0.1215, 0.1496, 0.1806, 0.2126, 0.2432, 0.2705, 0.2934, 0.3117, 0.3256, 0.3359, 0.3433, 0.3486, 0.3523, 0.3548, 0.3566], "mr": [0.0166, 0.0166, 0.0166, 0.0166, 0.0166, 0.0166, 0.0167, 0.0168, 0.017, 0.0174, 0.018, 0.0192, 0.0212, 0.0248, 0.0309, 0.041, 0.0566, 0.0787, 0.1062, 0.1357, 0.1626, 0.1838, 0.1986, 0.208, 0.2138, 0.2171, 0.2191, 0.2201, 0.2207, 0.2209, 0.2209], "eg": [0.0809, 0.0814, 0.0827, 0.0864, 0.0949, 0.1121, 0.1421, 0.1867, 0.2422, 0.2979, 0.3385, 0.3516, 0.3399, 0.3123, 0.2739, 0.2312, 0.1901, 0.155, 0.1278, 0.1086, 0.0961, 0.0887, 0.0846, 0.0825, 0.0815, 0.081, 0.0809, 0.0808, 0.0808, 0.0808, 0.0808], "pb": [0.0324, 0.0372, 0.04, 0.0405, 0.0391, 0.0366, 0.0333, 0.0296, 0.0259, 0.0225, 0.0196, 0.0173, 0.0155, 0.0143, 0.0135, 0.013, 0.0127, 0.0126, 0.0125, 0.0125, 0.0125, 0.0126, 0.0129, 0.0135, 0.0145, 0.0157, 0.0163, 0.0163, 0.0163, 0.0163, 0.0163], "ru": [0.0279, 0.0288, 0.0298, 0.031, 0.0325, 0.0342, 0.0362, 0.0385, 0.0411, 0.0439, 0.047, 0.0503, 0.0537, 0.0571, 0.0605, 0.0637, 0.0668, 0.0696, 0.0722, 0.0744, 0.0764, 0.0781, 0.0795, 0.0807, 0.0817, 0.0826, 0.0833, 0.0835, 0.0835, 0.0835, 0.0835], "bu": [0.0274, 0.0276, 0.0278, 0.0281, 0.0285, 0.029, 0.0296, 0.0305, 0.0317, 0.0331, 0.0349, 0.0373, 0.0401, 0.0435, 0.0476, 0.0522, 0.0572, 0.0627, 0.0682, 0.0736, 0.0788, 0.0835, 0.0876, 0.0912, 0.0941, 0.0965, 0.0984, 0.0999, 0.1007, 0.1007, 0.1007], "ib": [0.0263, 0.0263, 0.0263, 0.0263, 0.0263, 0.0262, 0.0259, 0.0257, 0.0254, 0.0252, 0.0249, 0.0247, 0.0244, 0.0242, 0.0239, 0.0237, 0.0235, 0.0232, 0.023, 0.0227, 0.0225, 0.0222, 0.022, 0.0217, 0.0215, 0.0212, 0.021, 0.0208, 0.0205, 0.0203, 0.02], "um": [0.1974, 0.2451, 0.2701, 0.2702, 0.2546, 0.2288, 0.1966, 0.1623, 0.1297, 0.1015, 0.0789, 0.0622, 0.0507, 0.0432, 0.0388, 0.0362, 0.0349, 0.0342, 0.034, 0.034, 0.0344, 0.0354, 0.0375, 0.0419, 0.0499, 0.0621, 0.0761, 0.088, 0.0959, 0.0978, 0.0978], "cy": [0.0505, 0.052, 0.0543, 0.0575, 0.0623, 0.0692, 0.0792, 0.0935, 0.1135, 0.1407, 0.1768, 0.2227, 0.2777, 0.3397, 0.4047, 0.4679, 0.525, 0.5732, 0.6117, 0.641, 0.6626, 0.6782, 0.6891, 0.6967, 0.702, 0.7055, 0.708, 0.7097, 0.7108, 0.7116, 0.7121], "bp": [0.242, 0.2493, 0.236, 0.2073, 0.1726, 0.1414, 0.1185, 0.1045, 0.0965, 0.0909, 0.085, 0.0777, 0.0712, 0.0702, 0.08, 0.1045, 0.147, 0.2114, 0.2958, 0.386, 0.4612, 0.511, 0.5391, 0.5536, 0.5606, 0.5639, 0.5654, 0.5662, 0.5665, 0.5666, 0.5666], "cv": [0.1165, 0.1281, 0.1685, 0.2019, 0.2182, 0.2118, 0.185, 0.1463, 0.1065, 0.0736, 0.051, 0.0378, 0.0315, 0.0294, 0.0298, 0.0322, 0.0367, 0.0442, 0.0561, 0.0734, 0.0965, 0.124, 0.1523, 0.1777, 0.1977, 0.2119, 0.2211, 0.2269, 0.2303, 0.2324, 0.2336]};
PIGMENTS.forEach(p => {
  p.R = HARDING_R[p.id] ? HARDING_R[p.id].slice() : WL.map(p.f);
  p.KS = p.R.map(r => (1 - r) ** 2 / (2 * r));
});
const PIG = Object.fromEntries(PIGMENTS.map(p => [p.id, p]));
// the white for a historical palette: lead white, swapped into the white slot when that palette is chosen
const LEAD_WHITE = (() => { const p = { name: 'Lead White', op: 0.9, T: 0.9, f: l => 0.87 - 0.16 * g(l, 400, 32) }; p.R = WL.map(p.f); p.KS = p.R.map(r => (1 - r) ** 2 / (2 * r)); return p; })();

// Clear medium: Oleogel adds no color, only dilutes pigment in the film
const MEDIUM = { id: 'og', name: 'Oleogel' };
const FILM_X = 4.2; // film thickness factor (scattering units of a full-strength opaque paint)
const GROUNDS = [
  { id: 'white', name: 'White gesso', f: l => 0.86 - 0.05 * g(l, 400, 25) },
  { id: 'lgrey', name: 'Light grey', f: l => 0.40 },
  { id: 'mgrey', name: 'Mid grey', f: l => 0.19 },
  { id: 'brown', name: 'Warm brown', f: l => 0.075 + 0.17 * sig((l - 565) / 38) },
  { id: 'black', name: 'Black', f: l => 0.03 },
];
GROUNDS.forEach(gr => gr.R = WL.map(gr.f));
const GROUND = Object.fromEntries(GROUNDS.map(gr => [gr.id, gr]));
// pigment load (0..1) = pigment parts / all parts including medium
function pigmentLoad(parts) {
  let pig = 0, all = 0; for (const id in parts) { const c = parts[id] > 0 ? parts[id] : 0; all += c; if (PIG[id]) pig += c; }
  return all ? pig / all : 0;
}
// Kubelka-Munk finite film over a ground
function filmR(parts, Rg) {
  const Rinf = mixR(parts); if (!Rinf) return Rg.slice();
  let all = 0, sx = 0; for (const id in parts) { const c = parts[id] > 0 ? parts[id] : 0; all += c; }
  for (const id in parts) { const p = PIG[id]; if (p && parts[id] > 0) sx += parts[id] / all * p.op; }
  const SX = FILM_X * sx;
  return Rinf.map((r, i) => {
    r = Math.min(0.999, Math.max(0.001, r));
    const a = (1 / r + r) / 2, b = (1 / r - r) / 2, bsx = b * SX;
    if (bsx > 20) return r;
    const coth = 1 / Math.tanh(bsx);
    return (1 - Rg[i] * (a - b * coth)) / (a - Rg[i] + b * coth);
  });
}
// hiding: contrast ratio of film over black vs over white (1 = fully opaque)
function hiding(parts) {
  const yb = R2XYZ(filmR(parts, GROUND.black.R))[1], yw = R2XYZ(filmR(parts, GROUND.white.R))[1];
  return Math.max(0, Math.min(1, yb / yw));
}

// parts: {id: number}
function mixR(parts) {
  let S = 0; const K = WL.map(() => 0);
  for (const id in parts) {
    const c = parts[id]; if (!(c > 0)) continue;
    const p = PIG[id]; if (!p) continue; const t = c * p.T; S += t;
    for (let i = 0; i < WL.length; i++) K[i] += t * p.KS[i];
  }
  if (S === 0) return null;
  return K.map(k => { const ks = k / S; return 1 + ks - Math.sqrt(ks * ks + 2 * ks); });
}
function R2XYZ(R) {
  let X = 0, Y = 0, Z = 0;
  for (let i = 0; i < R.length; i++) { X += R[i] * CMF[i][0]; Y += R[i] * CMF[i][1]; Z += R[i] * CMF[i][2]; }
  return [X / WHITE_E[0] * D65[0], Y / WHITE_E[1], Z / WHITE_E[2] * D65[2]];
}
const gam = v => { v = Math.max(0, Math.min(1, v)); return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055; };
const ungam = v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
function XYZ2rgb([X, Y, Z]) {
  const r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, gg = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
  return [gam(r), gam(gg), gam(b)].map(v => Math.round(v * 255));
}
function rgb2XYZ([r, gg, b]) {
  r = ungam(r / 255); gg = ungam(gg / 255); b = ungam(b / 255);
  return [0.4124 * r + 0.3576 * gg + 0.1805 * b, 0.2126 * r + 0.7152 * gg + 0.0722 * b, 0.0193 * r + 0.1192 * gg + 0.9505 * b];
}
function XYZ2Lab([X, Y, Z]) {
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const fx = f(X / D65[0]), fy = f(Y), fz = f(Z / D65[2]);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
// Lab hue angle -> Munsell hue number (0..100, 0 = 10RP, 5 = 5R)
const HUE_TABLE = [ // [munsell number of the "5" hue, lab angle]
  [5, 24], [15, 55], [25, 88], [35, 112], [45, 158], [55, 196], [65, 236], [75, 282], [85, 318], [95, 352]
];
function labAngle2munsell(h) {
  const T = HUE_TABLE.concat([[105, 384]]);
  let a = h; if (a < 24) a += 360;
  for (let i = 0; i < T.length - 1; i++) {
    if (a >= T[i][1] && a <= T[i + 1][1]) {
      const t = (a - T[i][1]) / (T[i + 1][1] - T[i][1]);
      return ((T[i][0] + t * (T[i + 1][0] - T[i][0])) % 100 + 100) % 100;
    }
  }
  return 5;
}
function munsell2labAngle(m) {
  const T = HUE_TABLE.concat([[105, 384]]);
  let a = m; if (a < 5) a += 100;
  for (let i = 0; i < T.length - 1; i++) {
    if (a >= T[i][0] && a <= T[i + 1][0]) {
      const t = (a - T[i][0]) / (T[i + 1][0] - T[i][0]);
      return (T[i][1] + t * (T[i + 1][1] - T[i][1])) % 360;
    }
  }
  return 24;
}
const FAMILIES = ['R', 'YR', 'Y', 'GY', 'G', 'BG', 'B', 'PB', 'P', 'RP'];
function analyze(R) {
  const xyz = R2XYZ(R); const rgb = XYZ2rgb(xyz); const lab = XYZ2Lab(xyz);
  const C = Math.hypot(lab[1], lab[2]); let h = Math.atan2(lab[2], lab[1]) * 180 / Math.PI; if (h < 0) h += 360;
  const V = Math.max(0, Math.min(10, lab[0] / 10));
  const chroma = C / 5;
  const hue = labAngle2munsell(h);
  return { rgb, lab, C, h, V, chroma, hue, hex: '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('') };
}
function munsellText(a) {
  const v = (Math.round(a.V * 10) / 10).toFixed(1).replace(/\.0$/, '');
  if (a.chroma < 0.6) return `N ${v}/`;
  let n = Math.round(a.hue / 2.5) * 2.5; n = (n + 100) % 100;
  let fam = Math.floor(n / 10); let step = n - fam * 10;
  if (step === 0) { step = 10; fam = (fam + 9) % 10; }
  const s = (step % 1 === 0 ? step.toFixed(0) : step.toFixed(1));
  return `${s}${FAMILIES[fam]} ${v}/${Math.max(1, Math.round(a.chroma))}`;
}
if (typeof module !== 'undefined') module.exports = { filmR, hiding, GROUND, pigmentLoad, PIGMENTS, PIG, mixR, analyze, munsellText, rgb2XYZ, XYZ2Lab };
