export function getFillColor(f) {
    const confidence = f.properties.confidence;

    // Couleur de départ RGBA (Jaune)
    let startColor = [255, 255, 0, 255]; // Jaune opaque
    
    // Couleur de fin RGBA (Vert)
    let endColor = [0, 128, 0, 255]; // Vert opaque

    // Interpoler chaque composante de la couleur
    let r = Math.round(interpolate(startColor[0], endColor[0], confidence));
    let g = Math.round(interpolate(startColor[1], endColor[1], confidence));
    let b = Math.round(interpolate(startColor[2], endColor[2], confidence));

    return [r, g, b, 255];
}

function interpolate(start, end, factor) {
    return start + (end - start) * factor;
}

export function getFillColorLandCover(f) {
    if (f.properties.subtype === 'forest') return [0, 128, 0, 128]
    if (f.properties.subtype === 'urban') return [250, 0, 0, 128]
    if (f.properties.subtype === 'barren') return [180, 180, 0, 128]
    if (f.properties.subtype === 'shrub') return [255, 187, 34, 128]
    if (f.properties.subtype === 'wetland') return [0, 150, 160, 128]
    if (f.properties.subtype === 'mangrove') return [0, 207, 117, 128]
    if (f.properties.subtype === 'crop') return [0, 128, 0, 128]
    if (f.properties.subtype === 'grass') return [0, 100, 0, 128]
}