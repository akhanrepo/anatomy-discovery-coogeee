/** F10: schematics drawn *after* each tradition's plate (not the plates themselves). */
import { silhouette } from './figure';
import { smooth, ellipse, both, line } from './geometry';

const channel = (pts: [number, number][]) => [smooth(pts), ...pts.filter((_, i) => i % 2 === 1).map(([x, y]) => ellipse(x, y, 2.2, 2.2))].join(' ');
export const LENS_ART: Record<string, { paths: { d: string; cls: string }[] }> = {
  'islamic-galenic': { paths: [
    ...both([[200, 150], [236, 210], [300, 330], [340, 580]]).map((d) => ({ d, cls: 'bone' })),
    ...both([[200, 120], [216, 220], [228, 520], [236, 940]]).map((d) => ({ d, cls: 'nerve' })),
    ...both([[210, 380], [260, 300], [312, 420]]).map((d) => ({ d, cls: 'muscle' })),
    ...both([[180, 390], [150, 300], [126, 200]]).map((d) => ({ d, cls: 'vein' })),
    { d: ellipse(176, 392, 26, 16), cls: 'vein' },
    ...both([[212, 300], [226, 240], [270, 240], [330, 560]]).map((d) => ({ d, cls: 'artery' })),
    { d: ellipse(212, 300, 14, 18), cls: 'artery' },
  ] },
  'chinese-classical': { paths: [
    ...[[[178, 210], [168, 300], [160, 420], [150, 520], [140, 600]], [[222, 210], [232, 300], [240, 420], [250, 520], [260, 600]], [[200, 140], [200, 260], [200, 380], [200, 500], [200, 540]]].map((p) => ({ d: channel(p as [number, number][]), cls: 'channel' })),
    ...both([[264, 196], [290, 300], [314, 420], [334, 520], [350, 620]]).map((d) => ({ d: `${d} ${[[290, 300], [334, 520]].map(([x, y]) => ellipse(x, y, 2.2, 2.2)).join(' ')}`, cls: 'channel' })),
    ...both([[224, 560], [236, 680], [238, 800], [236, 940]]).map((d) => ({ d, cls: 'channel' })),
  ] },
  ayurveda: { paths: [
    ...[[200, 250, 18], [178, 320, 14], [222, 320, 14], [200, 390, 20], [176, 440, 11], [224, 440, 11], [200, 490, 14]].map(([x, y, r]) => ({ d: ellipse(x, y, r, r * 0.8), cls: 'receptacle' })),
    ...[[[200, 268], [200, 370]], [[190, 330], [182, 430]], [[210, 330], [218, 430]], [[200, 410], [200, 476]], [[186, 250], [130, 230], [100, 260]], [[214, 250], [270, 230], [300, 260]]].map((p) => ({ d: smooth(p as [number, number][]), cls: 'srotas' })),
    { d: line([200, 150], [200, 232]), cls: 'srotas' },
  ] },
};
export const lensSilhouette = silhouette.male;
