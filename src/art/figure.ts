/**
 * Tabula's schematic engraved figure (stand-in for the commissioned art, F16).
 * Every interactive shape is keyed by a structure ID from content/structures.yaml.
 * kind 'area' = outline + hatch + wash; 'line' = vessel/nerve stroke.
 */
import { smooth, symmetricOutline, mirror, ellipse, line, both, chevron, MID, type Pt } from './geometry';

export type Figure = 'male' | 'female';
export type Layer = 'surface' | 'muscles' | 'viscera' | 'skeleton';
export const LAYERS: Layer[] = ['surface', 'muscles', 'viscera', 'skeleton'];

export interface Shape { d: string; kind: 'area' | 'line' }
export interface StructureArt { id: string; layer: Layer; pigment: string; shapes: Shape[]; sex?: Figure; label: [number, number] }
export interface MisbeliefArt { id: string; layer: Layer; paths: string[] }

// ── Silhouettes ─────────────────────────────────────────────────────────
const maleRight: Pt[] = [
  [200, 28], [224, 33], [239, 52], [244, 80], [240, 106], [231, 124], [219, 137], [212, 148], [214, 163],
  [234, 174], [264, 181], [288, 192], [301, 214], [307, 252], [313, 302], [319, 352], [327, 402],
  [335, 452], [342, 510], [348, 560], [352, 586], [361, 612], [365, 642], [359, 670], [348, 678], [340, 662],
  [333, 634], [329, 602], [321, 556], [311, 502], [303, 452], [295, 410], [287, 360], [281, 302], [275, 254],
  [269, 234], [267, 282], [263, 332], [257, 382], [255, 420], [261, 462], [269, 502], [273, 542], [271, 602],
  [265, 662], [259, 722], [255, 772], [257, 822], [253, 882], [245, 932], [243, 956], [261, 975], [257, 989],
  [218, 989], [214, 970], [216, 940], [218, 880], [220, 822], [220, 776], [222, 722], [220, 642], [214, 592],
  [207, 562], [200, 553],
];
const femaleRight: Pt[] = maleRight.map(([x, y]) => {
  if (y > 165 && y < 300 && x > 230) return [MID + (x - MID) * 0.9, y]; // narrower shoulders/arms
  if (y >= 300 && y < 440 && x > 240 && x < 270) return [MID + (x - MID) * 0.9, y]; // waist
  if (y >= 440 && y < 640 && x > 240 && x < 300) return [MID + (x - MID) * 1.12, y]; // hips and thighs
  return [x, y];
}) as Pt[];

export const silhouette: Record<Figure, string> = {
  male: smooth(symmetricOutline(maleRight), true, 0.42),
  female: smooth(symmetricOutline(femaleRight), true, 0.42),
};

// ── Decorative (non-interactive) engraving details ───────────────────────
export const ribs: string[] = Array.from({ length: 7 }, (_, i) => {
  const y = 208 + i * 20;
  const w = 46 + Math.sin((i / 6) * Math.PI) * 14;
  return [smooth([[MID + 7, y], [MID + w * 0.7, y - 6], [MID + w, y + 10], [MID + w * 0.85, y + 26]]), smooth(mirror([[MID + 7, y], [MID + w * 0.7, y - 6], [MID + w, y + 10], [MID + w * 0.85, y + 26]]))];
}).flat();
export const limbBones: string[] = [
  ...both([[262, 196], [290, 300], [312, 420]]), // humerus
  ...both([[314, 426], [328, 510], [344, 584]]), // radius/ulna
  ...both([[224, 548], [236, 660], [238, 770]]), // femur
  ...both([[238, 782], [236, 870], [234, 946]]), // tibia
  smooth([[160, 470], [200, 456], [240, 470], [250, 520], [228, 548], [200, 540], [172, 548], [150, 520]], true), // pelvis
  ...both([[204, 196], [240, 190], [272, 196]]), // clavicles
];
export const surfaceDetails: string[] = [
  smooth([[192, 108], [200, 112], [208, 108]]), // mouth
  line([200, 88], [197, 100], [203, 101]), // nose
  ellipse(200, 430, 2.2, 3), // navel
  ellipse(176, 250, 2, 2), ellipse(224, 250, 2, 2),
];

// ── Structures ──────────────────────────────────────────────────────────
const lungR: Pt[] = [[194, 206], [176, 199], [157, 220], [147, 270], [143, 330], [151, 360], [181, 352], [194, 330]];
const lungL: Pt[] = [[206, 206], [224, 199], [243, 220], [253, 270], [258, 330], [250, 360], [228, 352], [216, 340], [222, 318], [212, 300]];
const heart: Pt[] = [[196, 268], [214, 262], [232, 276], [240, 300], [231, 326], [214, 343], [200, 331], [190, 305], [190, 285]];
const muscleShapes: string[] = [
  ...[[[205, 206], [244, 198], [280, 202], [266, 252], [232, 270], [206, 264]] as Pt[]].flatMap((p) => [smooth(p, true), smooth(mirror(p), true)]), // pectorals
  ...[[[276, 186], [302, 214], [298, 262], [272, 238]] as Pt[]].flatMap((p) => [smooth(p, true), smooth(mirror(p), true)]), // deltoids
  ...[[[282, 258], [300, 300], [298, 372], [287, 396], [279, 330]] as Pt[]].flatMap((p) => [smooth(p, true), smooth(mirror(p), true)]), // biceps
  ...[[[314, 432], [334, 470], [340, 540], [330, 560], [318, 500]] as Pt[]].flatMap((p) => [smooth(p, true), smooth(mirror(p), true)]), // forearms
  ...[0, 1, 2, 3].map((i) => `${smooth([[202, 282 + i * 40], [222, 282 + i * 40], [222, 316 + i * 40], [202, 316 + i * 40]], true)} ${smooth(mirror([[202, 282 + i * 40], [222, 282 + i * 40], [222, 316 + i * 40], [202, 316 + i * 40]]), true)}`), // rectus abdominis
  ...[[[230, 548], [266, 566], [262, 720], [240, 762], [224, 646]] as Pt[]].flatMap((p) => [smooth(p, true), smooth(mirror(p), true)]), // quadriceps
  ...[[[226, 796], [252, 818], [250, 900], [236, 922], [228, 860]] as Pt[]].flatMap((p) => [smooth(p, true), smooth(mirror(p), true)]), // calves
];

export const structures: StructureArt[] = [
  // surface
  { id: 'skin', layer: 'surface', pigment: 'umber', label: [300, 140], shapes: [{ d: '', kind: 'area' }] }, // filled per figure
  { id: 'eye', layer: 'surface', pigment: 'indigo', label: [258, 84], shapes: [smooth([[174, 84], [184, 79], [194, 84], [184, 88]], true), smooth([[206, 84], [216, 79], [226, 84], [216, 88]], true)].map((d) => ({ d, kind: 'area' })) },
  // muscles
  { id: 'skeletal-muscle', layer: 'muscles', pigment: 'rose', label: [320, 300], shapes: muscleShapes.map((d) => ({ d, kind: 'area' })) },
  { id: 'interstitium', layer: 'muscles', pigment: 'verdigris', label: [280, 470], shapes: both([[230, 290], [250, 330], [254, 400], [246, 450], [232, 470]]).map((d) => ({ d, kind: 'line' })) },
  { id: 'diaphragm', layer: 'muscles', pigment: 'rose', label: [272, 360], shapes: [{ d: smooth([[146, 372], [172, 346], [200, 340], [228, 346], [254, 372]]), kind: 'line' }] },
  // viscera
  { id: 'trachea', layer: 'viscera', pigment: 'rose', label: [236, 168], shapes: [{ d: `${line([200, 142], [200, 214])} ${smooth([[200, 214], [190, 226], [180, 236]])} ${smooth([[200, 214], [210, 226], [220, 236]])}`, kind: 'line' }] },
  { id: 'lungs', layer: 'viscera', pigment: 'rose', label: [120, 280], shapes: [smooth(lungR, true), smooth(lungL, true)].map((d) => ({ d, kind: 'area' })) },
  { id: 'heart', layer: 'viscera', pigment: 'madder', label: [270, 304], shapes: [{ d: smooth(heart, true), kind: 'area' }] },
  { id: 'interventricular-septum', layer: 'viscera', pigment: 'madder', label: [262, 336], shapes: [{ d: smooth([[214, 272], [216, 300], [220, 334]]), kind: 'line' }] },
  { id: 'aortic-valve', layer: 'viscera', pigment: 'madder', label: [252, 262], shapes: [{ d: `${ellipse(208, 272, 5, 5)} ${line([208, 267], [208, 272], [204, 275])} ${line([208, 272], [212, 275])}`, kind: 'area' }] },
  { id: 'pulmonary-artery', layer: 'viscera', pigment: 'indigo', label: [150, 236], shapes: [{ d: `${smooth([[204, 270], [200, 250], [186, 240], [168, 250]])} ${smooth([[200, 250], [214, 240], [232, 250]])}`, kind: 'line' }] },
  { id: 'pulmonary-vein', layer: 'viscera', pigment: 'madder', label: [140, 300], shapes: [{ d: `${smooth([[170, 292], [184, 296], [198, 298]])} ${smooth([[240, 290], [230, 294], [226, 300]])}`, kind: 'line' }] },
  { id: 'capillaries', layer: 'viscera', pigment: 'madder', label: [118, 330], shapes: [{ d: [[160, 300], [170, 320], [158, 336], [236, 312], [244, 330], [230, 340]].map(([x, y]) => smooth([[x, y], [x + 4, y + 3], [x + 1, y + 7], [x + 6, y + 9], [x + 3, y + 13]])).join(' '), kind: 'line' }] },
  { id: 'arteries', layer: 'viscera', pigment: 'madder', label: [330, 440], shapes: [
    smooth([[212, 266], [212, 244], [226, 236], [230, 250], [210, 290], [206, 340], [206, 470]]),
    ...both([[206, 470], [224, 540], [234, 650], [238, 770], [236, 940]]),
    ...both([[214, 244], [214, 200], [214, 152]]),
    ...both([[226, 238], [266, 240], [292, 320], [316, 430], [340, 580]]),
  ].map((d) => ({ d, kind: 'line' })) },
  { id: 'veins', layer: 'viscera', pigment: 'indigo', label: [64, 560], shapes: [
    smooth([[192, 160], [192, 240], [193, 340], [194, 470]]),
    ...both([[194, 470], [212, 540], [222, 650], [228, 770], [228, 940]]),
    ...both([[187, 150], [189, 200], [191, 240]]),
    ...both([[196, 236], [258, 246], [284, 330], [306, 440], [330, 580]]),
  ].map((d) => ({ d, kind: 'line' })) },
  { id: 'venous-valves', layer: 'viscera', pigment: 'indigo', label: [270, 860], shapes: [[222, 640], [226, 720], [228, 850], [300, 420], [314, 500]].flatMap(([x, y]) => [chevron(x, y, 5, -1), chevron(2 * MID - x, y, 5, -1)]).map((d) => ({ d, kind: 'line' })) },
  { id: 'liver', layer: 'viscera', pigment: 'ochre', label: [104, 392], shapes: [{ d: smooth([[146, 362], [200, 364], [222, 374], [212, 394], [180, 414], [152, 406], [144, 386]], true), kind: 'area' }] },
  { id: 'stomach', layer: 'viscera', pigment: 'ochre', label: [292, 384], shapes: [{ d: smooth([[214, 374], [238, 368], [256, 380], [258, 406], [244, 428], [220, 432], [214, 420], [234, 412], [238, 394], [222, 388]], true), kind: 'area' }] },
  { id: 'pancreas', layer: 'viscera', pigment: 'verdigris', label: [292, 432], shapes: [{ d: smooth([[204, 432], [236, 428], [256, 434], [236, 442], [206, 442]], true), kind: 'area' }] },
  { id: 'kidneys', layer: 'viscera', pigment: 'ochre', label: [110, 440], shapes: [smooth([[160, 418], [174, 414], [178, 432], [172, 452], [160, 450], [156, 434]], true), smooth(mirror([[160, 418], [174, 414], [178, 432], [172, 452], [160, 450], [156, 434]]), true)].map((d) => ({ d, kind: 'area' })) },
  { id: 'intestines', layer: 'viscera', pigment: 'ochre', label: [104, 500], shapes: [{ d: `${smooth([[162, 446], [240, 446], [246, 520], [200, 532], [158, 518]], true)} ${smooth([[172, 462], [228, 462], [230, 482], [172, 486], [174, 506], [226, 506]])}`, kind: 'area' }] },
  { id: 'lacteals', layer: 'viscera', pigment: 'verdigris', label: [108, 470], shapes: [{ d: [[176, 470], [184, 500], [222, 470], [214, 500], [200, 512]].map(([x, y]) => smooth([[x, y], [(x + 199) / 2, (y + 456) / 2 + 4], [199, 456]])).join(' '), kind: 'line' }] },
  { id: 'thoracic-duct', layer: 'viscera', pigment: 'verdigris', label: [150, 180], shapes: [{ d: smooth([[199, 456], [197, 380], [197, 260], [196, 190], [186, 160]]), kind: 'line' }] },
  { id: 'uterus', layer: 'viscera', pigment: 'madder', sex: 'female', label: [250, 540], shapes: [{ d: smooth([[190, 506], [210, 506], [214, 524], [204, 546], [196, 546], [186, 524]], true), kind: 'area' }] },
  { id: 'uterine-tubes', layer: 'viscera', pigment: 'rose', sex: 'female', label: [254, 500], shapes: both([[210, 508], [226, 500], [238, 506], [240, 516]]).map((d) => ({ d, kind: 'line' })) },
  { id: 'testes', layer: 'viscera', pigment: 'rose', sex: 'male', label: [250, 580], shapes: [ellipse(193, 568, 6, 9), ellipse(207, 568, 6, 9)].map((d) => ({ d, kind: 'area' })) },
  // skeleton & nervous system
  { id: 'skull', layer: 'skeleton', pigment: 'bone', label: [268, 52], shapes: [{ d: smooth([[200, 34], [228, 40], [240, 66], [238, 98], [226, 116], [174, 116], [162, 98], [160, 66], [172, 40]], true), kind: 'area' }] },
  { id: 'skull-sutures', layer: 'skeleton', pigment: 'bone', label: [140, 44], shapes: [{ d: `${line([170, 52], [178, 48], [184, 53], [192, 47], [200, 52], [208, 47], [216, 53], [222, 48], [230, 52])} ${line([200, 36], [202, 44], [198, 50])}`, kind: 'line' }] },
  { id: 'mandible', layer: 'skeleton', pigment: 'bone', label: [262, 130], shapes: [{ d: smooth([[176, 110], [182, 128], [200, 138], [218, 128], [224, 110]]), kind: 'line' }] },
  { id: 'meninges', layer: 'skeleton', pigment: 'orpiment', label: [130, 70], shapes: [{ d: ellipse(200, 72, 35, 33), kind: 'line' }] },
  { id: 'meningeal-lymphatics', layer: 'skeleton', pigment: 'verdigris', label: [134, 96], shapes: [{ d: `${smooth([[168, 64], [176, 48], [192, 41], [200, 40]])} ${smooth(mirror([[168, 64], [176, 48], [192, 41], [200, 40]]))}`, kind: 'line' }] },
  { id: 'brain', layer: 'skeleton', pigment: 'orpiment', label: [270, 70], shapes: [{ d: `${ellipse(200, 72, 31, 29)} ${smooth([[178, 60], [186, 54], [192, 62], [198, 56]])} ${smooth([[202, 60], [210, 52], [216, 62], [222, 58]])} ${smooth([[176, 78], [186, 72], [194, 82]])} ${smooth([[206, 82], [214, 72], [224, 78]])}`, kind: 'area' }] },
  { id: 'cerebellum', layer: 'skeleton', pigment: 'orpiment', label: [262, 104], shapes: [{ d: ellipse(200, 104, 17, 6), kind: 'area' }] },
  { id: 'arterial-circle', layer: 'skeleton', pigment: 'madder', label: [140, 112], shapes: [{ d: smooth([[200, 93], [207, 97], [207, 104], [200, 108], [193, 104], [193, 97]], true), kind: 'line' }] },
  { id: 'optic-nerves', layer: 'skeleton', pigment: 'orpiment', label: [134, 84], shapes: both([[184, 84], [192, 90], [199, 97]]).map((d) => ({ d, kind: 'line' })) },
  { id: 'cranial-nerves', layer: 'skeleton', pigment: 'orpiment', label: [254, 118], shapes: [{ d: [[-14, 8], [-8, 12], [8, 12], [14, 8]].map(([dx, dy]) => line([200 + dx / 3, 104], [200 + dx, 104 + dy])).join(' '), kind: 'line' }] },
  { id: 'spine', layer: 'skeleton', pigment: 'bone', label: [150, 420], shapes: [{ d: Array.from({ length: 27 }, (_, i) => smooth([[193, 150 + i * 13], [207, 150 + i * 13], [207, 159 + i * 13], [193, 159 + i * 13]], true)).join(' '), kind: 'area' }] },
  { id: 'sternum', layer: 'skeleton', pigment: 'bone', label: [140, 250], shapes: [{ d: smooth([[194, 204], [206, 204], [207, 250], [204, 300], [196, 300], [193, 250]], true), kind: 'area' }] },
  { id: 'spinal-cord', layer: 'skeleton', pigment: 'orpiment', label: [242, 470], shapes: [{ d: line([200, 112], [200, 476]), kind: 'line' }] },
  { id: 'nerves', layer: 'skeleton', pigment: 'orpiment', label: [348, 520], shapes: [
    ...both([[204, 200], [266, 238], [296, 350], [324, 500], [346, 600]]),
    ...both([[204, 476], [222, 560], [234, 760], [230, 940]]),
  ].map((d) => ({ d, kind: 'line' })) },
  { id: 'recurrent-laryngeal-nerve', layer: 'skeleton', pigment: 'orpiment', label: [264, 222], shapes: [{ d: smooth([[210, 128], [212, 200], [214, 240], [222, 252], [212, 258], [205, 236], [204, 190], [203, 150]]), kind: 'line' }] },
];

// ── Misbeliefs, drawn in vermilion (F09) ────────────────────────────────
export const misbeliefArt: MisbeliefArt[] = [
  { id: 'arteries-pneuma', layer: 'viscera', paths: [300, 360, 420].map((y) => smooth([[203, y], [209, y + 6], [203, y + 12], [209, y + 18]])) },
  { id: 'septal-pores', layer: 'viscera', paths: [282, 294, 306, 318, 330].map((y, i) => ellipse(215 + i * 1.2, y, 1.6, 1.6)) },
  { id: 'rete-mirabile', layer: 'skeleton', paths: [`${line([186, 98], [214, 110])} ${line([186, 110], [214, 98])} ${line([190, 96], [190, 112])} ${line([200, 94], [200, 114])} ${line([210, 96], [210, 112])} ${line([184, 104], [216, 104])}`] },
  { id: 'two-part-mandible', layer: 'skeleton', paths: [line([200, 132], [200, 144]), smooth([[176, 110], [182, 128], [197, 136]]), smooth([[224, 110], [218, 128], [203, 136]])] },
  { id: 'venous-valves-brake', layer: 'viscera', paths: [[222, 650], [226, 730], [228, 860]].flatMap(([x, y]) => [chevron(x, y + 8, 5, 1), chevron(2 * MID - x, y + 8, 5, 1)]) },
  { id: 'liver-makes-blood', layer: 'viscera', paths: [[[176, 392], [150, 300], [120, 220]], [[190, 400], [196, 300], [196, 180]], [[172, 404], [190, 520], [214, 700]], [[160, 400], [110, 470], [70, 520]]].map((p) => smooth(p as unknown as Pt[])) },
  { id: 'lacteals-to-liver', layer: 'viscera', paths: [smooth([[196, 470], [186, 440], [178, 410]]), smooth([[208, 480], [196, 440], [186, 412]])] },
  { id: 'reticular-theory', layer: 'skeleton', paths: [Array.from({ length: 8 }, (_, i) => line([180, 60 + i * 8], [220, 64 + i * 8])).join(' '), Array.from({ length: 6 }, (_, i) => line([184 + i * 7, 56], [186 + i * 7, 120])).join(' '), line([196, 140], [204, 180], [196, 220], [204, 260], [196, 300])] },
  { id: 'brain-no-lymphatics', layer: 'skeleton', paths: [`${line([170, 40], [182, 52])} ${line([182, 40], [170, 52])} ${line([218, 40], [230, 52])} ${line([230, 40], [218, 52])}`] },
];

export const structureArt = (id: string) => structures.find((s) => s.id === id);
