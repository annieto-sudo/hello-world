// ============================================================
// Onboard new organization — single-page form (rebuild)
// Run this inside Figma via Plugins > Development > Run Plugin
// File: pPTKp3TXepa3dMQ9sEuCPi
// ============================================================

async function main() {
  await Promise.all([
    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Bold' }),
  ]);

  // ── Helpers ─────────────────────────────────────────────────
  function hex(node, c, a = 1) {
    const r = parseInt(c.slice(1,3),16)/255, g = parseInt(c.slice(3,5),16)/255, b = parseInt(c.slice(5,7),16)/255;
    node.fills = [{ type:'SOLID', color:{r,g,b}, opacity:a }];
  }
  function noFill(node) { node.fills = []; }
  function stroke(node, c, w = 1) {
    const r = parseInt(c.slice(1,3),16)/255, g = parseInt(c.slice(3,5),16)/255, b = parseInt(c.slice(5,7),16)/255;
    node.strokes = [{ type:'SOLID', color:{r,g,b} }];
    node.strokeWeight = w; node.strokeAlign = 'INSIDE';
  }
  function txt(str, size, style, colorHex, opts = {}) {
    const t = figma.createText();
    t.fontName = { family:'Inter', style };
    t.fontSize = size;
    t.characters = str;
    hex(t, colorHex);
    if (opts.w) { t.textAutoResize = 'HEIGHT'; t.resize(opts.w, 20); }
    return t;
  }
  function fr(w, h, bg, radius = 0) {
    const f = figma.createFrame();
    f.resize(w, h);
    if (bg) hex(f, bg); else noFill(f);
    f.cornerRadius = radius;
    f.clipsContent = false;
    return f;
  }
  function place(parent, child, x, y) {
    parent.appendChild(child);
    child.x = x; child.y = y;
    return child;
  }
  function divLine(w) {
    const d = figma.createRectangle();
    d.resize(w, 1);
    hex(d, '#E5E7EB');
    return d;
  }
  function inputField(label, placeholder, w, hint = null, disabled = false) {
    const h = hint ? 88 : 72;
    const wrap = fr(w, h, null);
    const lbl = txt(label, 13, 'Medium', disabled ? '#9CA3AF' : '#374151');
    place(wrap, lbl, 0, 0);
    const bg = disabled ? '#F9FAFB' : '#FFFFFF';
    const bd = disabled ? '#E5E7EB' : '#D1D5DB';
    const box = fr(w, 40, bg, 6); stroke(box, bd);
    if (disabled) box.opacity = 0.7;
    const ph = txt(placeholder, 14, 'Regular', '#9CA3AF');
    box.appendChild(ph); ph.x = 12; ph.y = 10;
    place(wrap, box, 0, 22);
    if (hint) {
      const ht = txt(hint, 12, 'Regular', '#6B7280', { w });
      place(wrap, ht, 0, 66);
    }
    return wrap;
  }
  function selectField(label, placeholder, w, disabled = false) {
    const wrap = fr(w, 72, null);
    const lbl = txt(label, 13, 'Medium', disabled ? '#9CA3AF' : '#374151');
    place(wrap, lbl, 0, 0);
    const bg = disabled ? '#F9FAFB' : '#FFFFFF';
    const bd = disabled ? '#E5E7EB' : '#D1D5DB';
    const box = fr(w, 40, bg, 6); stroke(box, bd);
    if (disabled) box.opacity = 0.7;
    const ph = txt(placeholder, 14, 'Regular', '#9CA3AF');
    box.appendChild(ph); ph.x = 12; ph.y = 10;
    const cv = txt('▾', 12, 'Regular', '#9CA3AF');
    box.appendChild(cv); cv.x = w - 22; cv.y = 14;
    place(wrap, box, 0, 22);
    return wrap;
  }
  function sectionBand(title, subtitle, w) {
    const band = fr(w, subtitle ? 64 : 48, '#F9FAFB');
    stroke(band, '#E5E7EB'); band.strokeAlign = 'OUTSIDE';
    const t = txt(title, 14, 'Semi Bold', '#111827');
    place(band, t, 0, subtitle ? 10 : 14);
    if (subtitle) {
      const s = txt(subtitle, 13, 'Regular', '#6B7280', { w: w - 0 });
      place(band, s, 0, 34);
    }
    return band;
  }
  function subLabel(str, w) {
    const t = txt(str, 12, 'Semi Bold', '#6B7280', { w });
    t.letterSpacing = { value: 0.4, unit: 'PIXELS' };
    return t;
  }

  // ── Map tile helper (compact) ────────────────────────────────
  function buildMapTile(w, h, lat, lng, pinColor) {
    const tile = fr(w, h, '#E8E4DC', 8);
    stroke(tile, '#D1D5DB');

    // Street grid
    const streets = [
      { x:0, y:h*0.35, w, h:2 }, { x:0, y:h*0.6, w, h:2 },
      { x:w*0.3, y:0, w:2, h }, { x:w*0.6, y:0, w:2, h },
    ];
    for (const s of streets) {
      const r = figma.createRectangle();
      r.resize(Math.max(s.w,2), Math.max(s.h,2));
      hex(r, '#FFFFFF'); r.opacity = 0.8;
      tile.appendChild(r); r.x = s.x; r.y = s.y;
    }
    // Park blob
    const park = figma.createEllipse();
    park.resize(w*0.18, h*0.22);
    hex(park, '#C8DEC0'); park.opacity = 0.9;
    tile.appendChild(park); park.x = w*0.65; park.y = h*0.1;

    // Pin marker
    const pinX = w * 0.45, pinY = h * 0.38;
    const pinOuter = figma.createEllipse();
    pinOuter.resize(22, 22);
    hex(pinOuter, '#FFFFFF');
    pinOuter.effects = [{ type:'DROP_SHADOW', color:{r:0,g:0,b:0,a:0.25}, offset:{x:0,y:2}, radius:6, spread:0, visible:true, blendMode:'NORMAL' }];
    tile.appendChild(pinOuter); pinOuter.x = pinX - 11; pinOuter.y = pinY - 11;
    const pinDot = figma.createEllipse();
    pinDot.resize(12, 12);
    hex(pinDot, pinColor);
    tile.appendChild(pinDot); pinDot.x = pinX - 6; pinDot.y = pinY - 6;

    // Pointer triangle
    const pointer = figma.createPolygon();
    pointer.pointCount = 3;
    pointer.resize(10, 8);
    hex(pointer, pinColor); pointer.rotation = 180;
    tile.appendChild(pointer); pointer.x = pinX + 3; pointer.y = pinY + 10;

    // Coords chip
    const chip = fr(160, 24, '#1F2937', 4);
    chip.opacity = 0.88;
    const chipTxt = txt(`${lat}° N,  ${lng}° E`, 11, 'Regular', '#FFFFFF');
    chip.appendChild(chipTxt); chipTxt.x = 10; chipTxt.y = 5;
    tile.appendChild(chip); chip.x = (w - 160)/2; chip.y = h - 32;

    return tile;
  }

  // ── Checkbox row ─────────────────────────────────────────────
  function checkboxRow(label, checked, w) {
    const wrap = fr(w, 28, null);
    // Box
    const box = fr(18, 18, checked ? '#2563EB' : '#FFFFFF', 4);
    stroke(box, checked ? '#2563EB' : '#D1D5DB');
    if (checked) {
      const ck = txt('✓', 11, 'Bold', '#FFFFFF');
      box.appendChild(ck); ck.x = 3; ck.y = 2;
    }
    place(wrap, box, 0, 5);
    const lbl = txt(label, 14, 'Regular', '#374151');
    place(wrap, lbl, 26, 6);
    return wrap;
  }

  // ── Suffix input (value + unit tag) ─────────────────────────
  function suffixInput(label, placeholder, suffix, colW) {
    const wrap = fr(colW, 72, null);
    const lbl = txt(label, 13, 'Medium', '#374151');
    place(wrap, lbl, 0, 0);
    const box = fr(colW, 40, '#FFFFFF', 6);
    stroke(box, '#D1D5DB');
    const ph = txt(placeholder, 14, 'Regular', '#9CA3AF');
    box.appendChild(ph); ph.x = 12; ph.y = 10;
    // suffix badge
    const badge = fr(suffix.length * 7 + 16, 28, '#F3F4F6', 4);
    badge.appendChild(txt(suffix, 12, 'Medium', '#6B7280'));
    badge.children[0].x = 8; badge.children[0].y = 6;
    box.appendChild(badge); badge.x = colW - badge.width - 6; badge.y = 6;
    place(wrap, box, 0, 22);
    return wrap;
  }

  // ── Pill / badge ─────────────────────────────────────────────
  function pill(label, bgHex, fgHex) {
    const p = fr(label.length * 7 + 18, 24, bgHex, 12);
    const t = txt(label, 12, 'Medium', fgHex);
    p.appendChild(t); t.x = 9; t.y = 5;
    return p;
  }

  // ════════════════════════════════════════════════════════════
  // REMOVE OLD FRAME
  const OLD_IDS = ['44:2', '45:2'];
  for (const id of OLD_IDS) {
    const old = figma.getNodeById(id);
    if (old) old.remove();
  }

  // ════════════════════════════════════════════════════════════
  // PAGE FRAME
  const PW = 1440;
  const PAD = 48;
  const IW = PW - PAD * 2; // 1344
  const COL = (IW - 24) / 2; // ~660
  const THIRD = (IW - 48) / 3; // ~416

  const page = fr(PW, 100, '#FFFFFF');
  page.name = 'Onboard new organization';
  page.x = 1560; page.y = 0;
  figma.currentPage.appendChild(page);

  let py = 0; // running y cursor (absolute in page)

  // ── NAV BAR ─────────────────────────────────────────────────
  const nav = fr(PW, 56, '#FFFFFF');
  stroke(nav, '#E5E7EB'); nav.strokeAlign = 'OUTSIDE';
  nav.effects = [{ type:'DROP_SHADOW', color:{r:0,g:0,b:0,a:0.06}, offset:{x:0,y:1}, radius:3, spread:0, visible:true, blendMode:'NORMAL' }];
  place(page, nav, 0, py);
  const backLnk = txt('← Organization directory', 14, 'Medium', '#2563EB');
  place(nav, backLnk, PAD, 16);
  const navT = txt('New Onboarding', 15, 'Semi Bold', '#111827');
  place(nav, navT, (PW - 150)/2, 16);
  py += 56;

  // ── PAGE HEADER ──────────────────────────────────────────────
  const pgHdr = fr(PW, 72, '#F9FAFB');
  stroke(pgHdr, '#E5E7EB'); pgHdr.strokeAlign = 'OUTSIDE';
  place(page, pgHdr, 0, py);
  place(pgHdr, txt('Organization directory  /  New Onboarding', 12, 'Regular', '#6B7280'), PAD, 12);
  place(pgHdr, txt('New Onboarding', 22, 'Bold', '#111827'), PAD, 32);
  py += 72;

  // ════════════════════════════════════════════════════════════
  // SECTION 1 — Organization info
  const s1Band = sectionBand('Organization info', 'Basic details about the organization being onboarded.', PW);
  place(page, s1Band, 0, py); py += 64;

  py += 28;
  place(page, inputField('Organization name *', 'e.g. Guangzhou Textile Co.', IW, 'Must match the legal registered name'), PAD, py);
  py += 88 + 20;

  place(page, selectField('Organization type *', 'Select type…  (Vendor / Factory / 3P Inspection)', COL), PAD, py);
  place(page, selectField('Country of origin *', 'Select country…', COL), PAD + COL + 24, py);
  py += 72 + 20;

  place(page, inputField('Vendor / Parent ID', 'e.g. MSQCH005', COL, 'Leave blank to auto-generate'), PAD, py);
  place(page, inputField('Year founded', 'e.g. 2008', COL), PAD + COL + 24, py);
  py += 88 + 20;

  place(page, inputField('Website (optional)', 'https://', IW), PAD, py);
  py += 72 + 32;

  place(page, divLine(PW), 0, py); py += 1;

  // ════════════════════════════════════════════════════════════
  // SECTION 2 — Location & address
  const s2Band = sectionBand('Location & address', 'Manufacturing address and pickup logistics. GPS pin captured from map.', PW);
  place(page, s2Band, 0, py); py += 64;
  py += 28;

  // ── Manufacturing address sub-section ───────────────────────
  const mfgLabel = subLabel('MANUFACTURING ADDRESS', IW);
  place(page, mfgLabel, PAD, py); py += 20 + 14;

  place(page, inputField('Street address *', 'e.g. 18/F Tower 1, Times Square', IW), PAD, py);
  py += 72 + 20;

  place(page, inputField('City *', 'e.g. Hong Kong', COL), PAD, py);
  place(page, inputField('Province / Region', 'e.g. SAR', COL), PAD + COL + 24, py);
  py += 72 + 20;

  place(page, inputField('Postal code', 'e.g. 518000', THIRD), PAD, py);
  place(page, selectField('Country *', 'Select country…', THIRD * 2 + 24), PAD + THIRD + 24, py);
  py += 72 + 24;

  // Map pin area
  const mapRowW = IW;
  const mapTile = buildMapTile(440, 180, '22.3193', '114.1694', '#2563EB');
  place(page, mapTile, PAD, py);

  // Right of map: instructions + coords
  const mapInfoX = PAD + 440 + 24;
  const mapInfoW = IW - 440 - 24;
  place(page, txt('Map pin', 13, 'Semi Bold', '#374151'), mapInfoX, py);
  place(page, txt('Click on the map to drop a pin and capture the GPS coordinates for this address.', 13, 'Regular', '#6B7280', { w: mapInfoW }), mapInfoX, py + 22);

  // Coords display fields (read-only, populated from map)
  const coordW = (mapInfoW - 16) / 2;
  const latField = fr(coordW, 56, '#F9FAFB', 6); stroke(latField, '#E5E7EB');
  const latLbl = txt('Latitude', 11, 'Medium', '#6B7280'); latField.appendChild(latLbl); latLbl.x = 10; latLbl.y = 8;
  const latVal = txt('22.3193°', 14, 'Medium', '#111827'); latField.appendChild(latVal); latVal.x = 10; latVal.y = 26;
  place(page, latField, mapInfoX, py + 70);

  const lngField = fr(coordW, 56, '#F9FAFB', 6); stroke(lngField, '#E5E7EB');
  const lngLbl = txt('Longitude', 11, 'Medium', '#6B7280'); lngField.appendChild(lngLbl); lngLbl.x = 10; lngLbl.y = 8;
  const lngVal = txt('114.1694°', 14, 'Medium', '#111827'); lngField.appendChild(lngVal); lngVal.x = 10; lngVal.y = 26;
  place(page, lngField, mapInfoX + coordW + 16, py + 70);

  const changePinLnk = txt('↺  Repin on map', 13, 'Medium', '#2563EB');
  place(page, changePinLnk, mapInfoX, py + 140);

  py += 180 + 32;

  // ── Pickup address sub-section ───────────────────────────────
  place(page, divLine(IW), PAD, py); py += 1 + 24;

  const pickupLabel = subLabel('PICKUP ADDRESS', IW);
  place(page, pickupLabel, PAD, py); py += 20 + 14;

  // Checkbox: same as manufacturing
  const cbRow = checkboxRow('Same as manufacturing address', true, IW);
  place(page, cbRow, PAD, py); py += 28 + 20;

  // Grayed-out pickup fields (disabled = checkbox is checked by default)
  place(page, inputField('Street address', 'Same as manufacturing address', IW, null, true), PAD, py);
  py += 72 + 16;

  place(page, inputField('City', '', COL, null, true), PAD, py);
  place(page, inputField('Province / Region', '', COL, null, true), PAD + COL + 24, py);
  py += 72 + 16;

  place(page, inputField('Postal code', '', THIRD, null, true), PAD, py);
  place(page, selectField('Country', 'Select country…', THIRD * 2 + 24, true), PAD + THIRD + 24, py);
  py += 72 + 16;

  // Pickup map (grayed/disabled)
  const pickupMapWrap = fr(440, 180, '#F9FAFB', 8);
  stroke(pickupMapWrap, '#E5E7EB');
  pickupMapWrap.opacity = 0.5;
  const pickupMapNote = txt('Pickup map pin — same location as above', 13, 'Regular', '#9CA3AF');
  pickupMapWrap.appendChild(pickupMapNote);
  pickupMapNote.x = 80; pickupMapNote.y = 78;
  place(page, pickupMapWrap, PAD, py);
  py += 180 + 32;

  place(page, divLine(PW), 0, py); py += 1;

  // ════════════════════════════════════════════════════════════
  // SECTION 3 — Production (Factory-specific)
  const s3Band = fr(PW, 72, '#FFF7ED');
  noFill(s3Band); hex(s3Band, '#FFF7ED');
  stroke(s3Band, '#FED7AA'); s3Band.strokeAlign = 'OUTSIDE';
  place(page, s3Band, 0, py);
  // Factory icon pill
  const factoryPill = pill('Factory only', '#FED7AA', '#92400E');
  place(s3Band, factoryPill, PAD, 22);
  const s3Title = txt('Production', 14, 'Semi Bold', '#111827');
  place(s3Band, s3Title, PAD + factoryPill.width + 10, 12);
  const s3Sub = txt('Shown when Organization type = Factory. Describes what and how much this factory can produce.', 13, 'Regular', '#78350F', { w: PW - PAD * 2 - factoryPill.width - 10 });
  place(s3Band, s3Sub, PAD + factoryPill.width + 10, 34);
  py += 72;
  py += 28;

  // Capabilities (full-width multi-select)
  const capWrap = fr(IW, 72, null);
  const capLbl = txt('Capabilities *', 13, 'Medium', '#374151');
  place(capWrap, capLbl, 0, 0);
  const capBox = fr(IW, 40, '#FFFFFF', 6); stroke(capBox, '#D1D5DB');
  const capPh = txt('Select capabilities…  (e.g. Cut & Sew, Knitting, Embroidery, Dyeing, QC…)', 14, 'Regular', '#9CA3AF');
  capBox.appendChild(capPh); capPh.x = 12; capPh.y = 10;
  const capCv = txt('▾', 12, 'Regular', '#6B7280');
  capBox.appendChild(capCv); capCv.x = IW - 22; capCv.y = 14;
  place(capWrap, capBox, 0, 22);
  place(page, capWrap, PAD, py); py += 72 + 20;

  // Monthly capacity + Lead time
  const capColW = (IW - 24) / 2;
  place(page, suffixInput('Monthly capacity *', 'e.g. 120', '× 1,000 units', capColW), PAD, py);
  place(page, suffixInput('Production lead time *', 'e.g. 45', 'days', capColW), PAD + capColW + 24, py);
  py += 72 + 32;

  place(page, divLine(PW), 0, py); py += 1;

  // ════════════════════════════════════════════════════════════
  // SECTION 4 — Primary contact
  const s4Band = sectionBand('Primary contact', 'Main point of contact at this organization.', PW);
  place(page, s4Band, 0, py); py += 64;
  py += 28;

  place(page, inputField('First name *', 'e.g. Wei', COL), PAD, py);
  place(page, inputField('Last name *', 'e.g. Zhang', COL), PAD + COL + 24, py);
  py += 72 + 20;

  place(page, inputField('Email *', 'name@company.com', COL), PAD, py);
  place(page, inputField('Phone', '+1 (555) 000-0000', COL), PAD + COL + 24, py);
  py += 72 + 20;

  place(page, inputField('Title / Role', 'e.g. Supply Chain Manager', IW), PAD, py);
  py += 72 + 32;

  place(page, divLine(PW), 0, py); py += 1;

  // ════════════════════════════════════════════════════════════
  // SECTION 5 — Certifications
  const s5Band = sectionBand('Certifications (optional)', 'Add known certifications — can also be added after onboarding.', PW);
  place(page, s5Band, 0, py); py += 64;
  py += 28;

  // Column headers
  const CERT_COLS = [{ label:'Certification', w:380 }, { label:'Issuing body', w:300 }, { label:'Expiry date', w:200 }, { label:'Status', w:120 }];
  let cx = PAD;
  for (const cc of CERT_COLS) {
    place(page, txt(cc.label, 12, 'Medium', '#6B7280'), cx, py);
    cx += cc.w + 16;
  }
  py += 20 + 8;

  // Cert row
  const certRow = fr(IW, 40, null);
  cx = 0;
  for (const cc of CERT_COLS) {
    const b = fr(cc.w, 40, '#FFFFFF', 6); stroke(b, '#D1D5DB');
    const phs = ['e.g. ISO 9001', 'e.g. Bureau Veritas', 'MM/YYYY', 'Valid ▾'];
    const ph = txt(phs[CERT_COLS.indexOf(cc)], 14, 'Regular', '#9CA3AF');
    b.appendChild(ph); ph.x = 10; ph.y = 10;
    place(certRow, b, cx, 0); cx += cc.w + 16;
  }
  // Remove button
  const rmBtn = fr(36, 36, null); noFill(rmBtn);
  const rmT = txt('×', 18, 'Regular', '#9CA3AF'); place(rmBtn, rmT, 10, 6);
  place(certRow, rmBtn, cx, 2);
  place(page, certRow, PAD, py); py += 40 + 14;

  place(page, txt('+ Add certification', 13, 'Medium', '#2563EB'), PAD, py);
  py += 20 + 32;

  // ── Info note ────────────────────────────────────────────────
  const noteRow = fr(PW, 48, '#EFF6FF');
  place(page, noteRow, 0, py);
  const noteDot = figma.createEllipse(); noteDot.resize(8, 8);
  hex(noteDot, '#2563EB'); noteRow.appendChild(noteDot); noteDot.x = PAD; noteDot.y = 20;
  const noteT = txt('Fields marked * are required. You can save a draft at any time and return to complete the form.', 13, 'Regular', '#1E40AF', { w: IW - 20 });
  noteRow.appendChild(noteT); noteT.x = PAD + 16; noteT.y = 15;
  py += 48;

  // ── Footer ───────────────────────────────────────────────────
  const foot = fr(PW, 64, '#FFFFFF');
  foot.effects = [{ type:'DROP_SHADOW', color:{r:0,g:0,b:0,a:0.08}, offset:{x:0,y:-2}, radius:8, spread:0, visible:true, blendMode:'NORMAL' }];
  place(page, foot, 0, py);

  const cBtn = fr(100, 40, '#FFFFFF', 6); stroke(cBtn, '#D1D5DB');
  place(cBtn, txt('Cancel', 14, 'Medium', '#374151'), 26, 10);
  place(foot, cBtn, PAD, 12);

  const sBtn = fr(130, 40, '#FFFFFF', 6); stroke(sBtn, '#2563EB');
  place(sBtn, txt('Save draft', 14, 'Medium', '#2563EB'), 22, 10);
  place(foot, sBtn, PAD + 116, 12);

  const subBtn = fr(178, 40, '#1D4ED8', 6);
  place(subBtn, txt('Submit onboarding', 14, 'Semi Bold', '#FFFFFF'), 16, 10);
  place(foot, subBtn, PW - PAD - 178, 12);

  py += 64;

  // ── Resize page to exact content height ──────────────────────
  page.resize(PW, py);

  figma.currentPage.selection = [page];
  figma.viewport.scrollAndZoomIntoView([page]);
  figma.closePlugin(`Done — frame ${page.id}, height ${py}px`);
}

main().catch(err => figma.closePlugin('Error: ' + err.message));
