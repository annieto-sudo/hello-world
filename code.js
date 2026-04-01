// ============================================================
// Organization Directory — Quince Vendor Portal
// Run this plugin inside Figma to build the full screen +
// linked prototype frames.
// ============================================================

async function main() {
  // ── Font preload ──────────────────────────────────────────
  await Promise.all([
    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' }),
  ]);

  const page = figma.currentPage;
  page.name = 'Organization Directory';

  // ── Helpers ───────────────────────────────────────────────
  function hex(h) {
    return {
      r: parseInt(h.slice(1, 3), 16) / 255,
      g: parseInt(h.slice(3, 5), 16) / 255,
      b: parseInt(h.slice(5, 7), 16) / 255,
    };
  }
  function solidFill(h) { return [{ type: 'SOLID', color: hex(h) }]; }
  function stroke(h, w = 1) {
    return { strokes: [{ type: 'SOLID', color: hex(h) }], strokeWeight: w };
  }

  function makeFrame(name, w, h) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    f.fills = [];
    return f;
  }

  function hStack(name, gap = 0) {
    const f = figma.createFrame();
    f.name = name;
    f.layoutMode = 'HORIZONTAL';
    f.primaryAxisSizingMode = 'HUG';
    f.counterAxisSizingMode = 'HUG';
    f.itemSpacing = gap;
    f.fills = [];
    return f;
  }

  function vStack(name, gap = 0) {
    const f = figma.createFrame();
    f.name = name;
    f.layoutMode = 'VERTICAL';
    f.primaryAxisSizingMode = 'HUG';
    f.counterAxisSizingMode = 'HUG';
    f.itemSpacing = gap;
    f.fills = [];
    return f;
  }

  function txt(content, size, style, colorHex, opts = {}) {
    const t = figma.createText();
    t.fontName = { family: 'Inter', style };
    t.fontSize = size;
    t.characters = content;
    t.fills = solidFill(colorHex);
    if (opts.opacity !== undefined) t.opacity = opts.opacity;
    if (opts.letterSpacing !== undefined) t.letterSpacing = opts.letterSpacing;
    return t;
  }

  // Pill badge (type badge or status pill)
  function badge(label, bgHex, textHex, dotHex = null) {
    const f = hStack('badge-' + label, 5);
    f.primaryAxisAlignItems = 'CENTER';
    f.counterAxisAlignItems = 'CENTER';
    f.paddingLeft = f.paddingRight = 8;
    f.paddingTop = f.paddingBottom = 3;
    f.cornerRadius = 100;
    f.fills = solidFill(bgHex);
    if (dotHex) {
      const dot = figma.createEllipse();
      dot.resize(6, 6);
      dot.fills = solidFill(dotHex);
      f.appendChild(dot);
    }
    const l = txt(label, 11, 'Medium', textHex);
    f.appendChild(l);
    return f;
  }

  // Rounded button
  function button(label, bgHex, textHex, borderHex = null) {
    const f = hStack('btn-' + label, 0);
    f.primaryAxisAlignItems = 'CENTER';
    f.counterAxisAlignItems = 'CENTER';
    f.paddingLeft = f.paddingRight = 14;
    f.paddingTop = f.paddingBottom = 9;
    f.cornerRadius = 8;
    f.fills = solidFill(bgHex);
    if (borderHex) {
      f.strokes = [{ type: 'SOLID', color: hex(borderHex) }];
      f.strokeWeight = 1;
    }
    f.appendChild(txt(label, 13, 'Medium', textHex));
    return f;
  }

  // Input / dropdown row item
  function inputBox(placeholder, w = 200) {
    const f = hStack('input-' + placeholder, 0);
    f.primaryAxisAlignItems = 'CENTER';
    f.counterAxisAlignItems = 'CENTER';
    f.paddingLeft = f.paddingRight = 12;
    f.paddingTop = f.paddingBottom = 0;
    f.resize(w, 36);
    f.primaryAxisSizingMode = 'FIXED';
    f.counterAxisSizingMode = 'FIXED';
    f.cornerRadius = 8;
    f.fills = solidFill('#FFFFFF');
    f.strokes = [{ type: 'SOLID', color: hex('#E5E5E3') }];
    f.strokeWeight = 1;
    const t = txt(placeholder, 12, 'Regular', '#9E9E9C');
    f.appendChild(t);
    return f;
  }

  // Checkbox
  function checkbox() {
    const box = figma.createRectangle();
    box.resize(14, 14);
    box.cornerRadius = 3;
    box.fills = solidFill('#FFFFFF');
    box.strokes = [{ type: 'SOLID', color: hex('#CBCBC9') }];
    box.strokeWeight = 1;
    return box;
  }

  // ── Page dimensions ───────────────────────────────────────
  const PAGE_W = 1440;
  const CONTENT_W = 1280;
  const LEFT = (PAGE_W - CONTENT_W) / 2; // 80px

  // ── MAIN FRAME ────────────────────────────────────────────
  const main = makeFrame('Organization Directory — Main', PAGE_W, 1080);
  main.fills = solidFill('#F8F8F7');
  main.x = 0; main.y = 0;
  page.appendChild(main);

  let curY = 32; // running Y cursor

  // ── TOP BAR ───────────────────────────────────────────────
  // Title block
  const titleGroup = vStack('TitleGroup', 4);
  titleGroup.x = LEFT; titleGroup.y = curY;
  const pageTitle = txt('Organization directory', 20, 'Medium', '#111111');
  const pageSub = txt('Vendors, factories, and 3P inspection companies', 13, 'Regular', '#6B6B69');
  titleGroup.appendChild(pageTitle);
  titleGroup.appendChild(pageSub);
  main.appendChild(titleGroup);

  // Buttons — top right
  const btnRow = hStack('TopButtons', 8);
  const exportBtn = button('Export CSV', '#FFFFFF', '#333333', '#E5E5E3');
  const onboardBtn = button('+ Onboard org', '#185FA5', '#FFFFFF');
  btnRow.appendChild(exportBtn);
  btnRow.appendChild(onboardBtn);
  // Position flush right
  btnRow.x = LEFT + CONTENT_W - 260;
  btnRow.y = curY + 4;
  main.appendChild(btnRow);

  curY += 72; // after top bar

  // ── STAT CARDS ────────────────────────────────────────────
  const cardDefs = [
    { val: '142', label: 'Total vendors', sub: null, valColor: '#111111', subColor: null },
    { val: '318', label: 'Factories', sub: null, valColor: '#111111', subColor: null },
    { val: '27', label: '3P companies', sub: null, valColor: '#111111', subColor: null },
    { val: '8', label: 'Certs expiring', sub: 'Within 30 days', valColor: '#92400E', subColor: '#92400E' },
  ];
  const cardW = (CONTENT_W - 3 * 12) / 4; // 4 cards with 12px gaps
  cardDefs.forEach((def, i) => {
    const card = vStack('Card-' + def.label, 4);
    card.paddingLeft = card.paddingRight = 16;
    card.paddingTop = card.paddingBottom = 16;
    card.cornerRadius = 8;
    card.fills = solidFill('#FFFFFF');
    card.strokes = [{ type: 'SOLID', color: hex('#E5E5E3') }];
    card.strokeWeight = 1;

    card.appendChild(txt(def.val, 28, 'SemiBold', def.valColor));
    card.appendChild(txt(def.label, 13, 'Regular', '#6B6B69'));
    if (def.sub) card.appendChild(txt(def.sub, 11, 'Regular', def.subColor));

    card.x = LEFT + i * (cardW + 12);
    card.y = curY;
    // Fix width
    card.primaryAxisSizingMode = 'HUG';
    card.counterAxisSizingMode = 'FIXED';
    card.resize(cardW, card.height || 90);
    main.appendChild(card);
  });
  curY += 90 + 24;

  // ── TABS ─────────────────────────────────────────────────
  const tabDefs = [
    { label: 'All orgs (487)', active: true },
    { label: 'Vendors (142)', active: false },
    { label: 'Factories (318)', active: false },
    { label: '3P companies (27)', active: false },
  ];
  const tabBar = hStack('Tabs', 0);
  tabBar.x = LEFT; tabBar.y = curY;
  tabBar.strokeWeight = 0;
  tabBar.fills = [];
  // Bottom border line for entire tab bar
  tabBar.strokes = [{ type: 'SOLID', color: hex('#E5E5E3') }];
  tabBar.strokeWeight = 1;
  tabBar.strokeAlign = 'OUTSIDE';

  tabDefs.forEach((td) => {
    const tab = vStack('tab-' + td.label, 0);
    tab.primaryAxisAlignItems = 'CENTER';
    tab.counterAxisAlignItems = 'CENTER';
    tab.paddingLeft = tab.paddingRight = 16;
    tab.paddingBottom = 12;
    tab.paddingTop = 0;
    tab.fills = [];

    const tLabel = txt(td.label, 13, td.active ? 'Medium' : 'Regular',
      td.active ? '#185FA5' : '#6B6B69');
    tab.appendChild(tLabel);

    if (td.active) {
      const underline = figma.createRectangle();
      underline.resize(tLabel.width + 32, 2);
      underline.fills = solidFill('#185FA5');
      underline.y = 0;
      tab.appendChild(underline);
    }

    tabBar.appendChild(tab);
  });
  main.appendChild(tabBar);
  curY += 44;

  // ── FILTER TOOLBAR ───────────────────────────────────────
  const filterBar = hStack('FilterBar', 8);
  filterBar.x = LEFT; filterBar.y = curY;

  const searchBox = inputBox('Search by name, ID, or country…', 480);
  filterBar.appendChild(searchBox);
  filterBar.appendChild(inputBox('All countries', 160));
  filterBar.appendChild(inputBox('All statuses', 140));
  filterBar.appendChild(inputBox('All org types', 150));
  main.appendChild(filterBar);
  curY += 36 + 16;

  // ── TABLE ─────────────────────────────────────────────────
  const tableW = CONTENT_W;
  const tableFrame = vStack('Table', 0);
  tableFrame.x = LEFT; tableFrame.y = curY;
  tableFrame.cornerRadius = 12;
  tableFrame.fills = solidFill('#FFFFFF');
  tableFrame.strokes = [{ type: 'SOLID', color: hex('#E5E5E3') }];
  tableFrame.strokeWeight = 1;
  tableFrame.clipsContent = true;
  tableFrame.primaryAxisSizingMode = 'HUG';
  tableFrame.counterAxisSizingMode = 'FIXED';
  tableFrame.resize(tableW, 10);

  // Column widths: checkbox(40) | name(260) | type(110) | country(100) | parent(180) | certs(120) | status(120) | action(80)
  const COL = [40, 260, 110, 100, 180, 120, 120, 80];
  const COL_LABELS = ['', 'Name / ID', 'Type', 'Country', 'Parent org', 'Certs', 'Status', ''];
  const ROW_H = 56;

  function tableRow(cells, isHeader = false, bgHex = '#FFFFFF') {
    const row = hStack('Row', 0);
    row.primaryAxisSizingMode = 'FIXED';
    row.counterAxisSizingMode = 'FIXED';
    row.resize(tableW, ROW_H);
    row.fills = solidFill(bgHex);
    row.primaryAxisAlignItems = 'CENTER';
    row.counterAxisAlignItems = 'CENTER';
    if (!isHeader) {
      row.strokes = [{ type: 'SOLID', color: hex('#F0F0EE') }];
      row.strokeWeight = 1;
      row.strokeAlign = 'INSIDE';
    }

    cells.forEach((cellContent, ci) => {
      const cell = hStack('cell-' + ci, 0);
      cell.primaryAxisSizingMode = 'FIXED';
      cell.counterAxisSizingMode = 'FIXED';
      cell.resize(COL[ci], ROW_H);
      cell.fills = [];
      cell.paddingLeft = ci === 0 ? 16 : 0;
      cell.paddingRight = ci === COL.length - 1 ? 16 : 0;
      cell.primaryAxisAlignItems = ci === 0 ? 'CENTER' : 'MIN';
      cell.counterAxisAlignItems = 'CENTER';

      if (typeof cellContent === 'string') {
        if (isHeader) {
          if (cellContent) {
            const ht = txt(cellContent.toUpperCase(), 11, 'Medium', '#9E9E9C');
            ht.letterSpacing = { unit: 'PERCENT', value: 3 };
            cell.appendChild(ht);
          }
        } else {
          if (cellContent) cell.appendChild(txt(cellContent, 13, 'Regular', '#333333'));
        }
      } else if (cellContent !== null) {
        cell.appendChild(cellContent);
      }
      row.appendChild(cell);
    });
    return row;
  }

  // Header row
  const headerRow = tableRow(
    [null, ...COL_LABELS.slice(1)],
    true,
  );
  headerRow.fills = solidFill('#F5F5F3');
  tableFrame.appendChild(headerRow);

  // ── Data rows ─────────────────────────────────────────────
  // Row 1 – M Square China
  const nameCell1 = vStack('nameCell1', 2);
  nameCell1.appendChild(txt('M Square China', 13, 'Medium', '#111111'));
  nameCell1.appendChild(txt('MSQCH005', 11, 'Regular', '#9E9E9C'));

  const viewLink1 = txt('View →', 13, 'Medium', '#185FA5');

  const row1 = tableRow([
    checkbox(),
    nameCell1,
    badge('Vendor', '#EEEDFE', '#534AB7'),
    txt('China', 13, 'Regular', '#333333'),
    txt('—', 13, 'Regular', '#9E9E9C'),
    txt('4 active', 13, 'Regular', '#333333'),
    badge('Active', '#DCFCE7', '#166534', '#16A34A'),
    viewLink1,
  ]);
  tableFrame.appendChild(row1);

  // Row 2 – Dongguan (child, slightly indented name)
  const nameCell2 = vStack('nameCell2', 2);
  const indent = hStack('indent', 4);
  indent.fills = [];
  // indent marker
  const indentBar = figma.createRectangle();
  indentBar.resize(2, 16); indentBar.cornerRadius = 1; indentBar.fills = solidFill('#CBCBC9');
  indent.appendChild(indentBar);
  const nameStack2 = vStack('ns2', 2);
  nameStack2.appendChild(txt('Dongguan City Hongrun Garments', 13, 'Medium', '#111111'));
  nameStack2.appendChild(txt('MSQCH-F001', 11, 'Regular', '#9E9E9C'));
  indent.appendChild(nameStack2);
  nameCell2.appendChild(indent);

  const parentLink2 = txt('M Square China', 13, 'Regular', '#534AB7');
  const certsCell2 = txt('1 expiring', 13, 'Regular', '#D97706');
  const viewLink2 = txt('View →', 13, 'Medium', '#185FA5');

  const row2 = tableRow([
    checkbox(),
    nameCell2,
    badge('Factory', '#E1F5EE', '#0F6E56'),
    txt('China', 13, 'Regular', '#333333'),
    parentLink2,
    certsCell2,
    badge('Active', '#DCFCE7', '#166534', '#16A34A'),
    viewLink2,
  ]);
  tableFrame.appendChild(row2);

  // Row 3 – Bureau Veritas
  const nameCell3 = vStack('nameCell3', 2);
  nameCell3.appendChild(txt('Bureau Veritas Consumer Products', 13, 'Medium', '#111111'));
  nameCell3.appendChild(txt('BV-3P-012', 11, 'Regular', '#9E9E9C'));
  const viewLink3 = txt('View →', 13, 'Medium', '#185FA5');

  const row3 = tableRow([
    checkbox(),
    nameCell3,
    badge('3P company', '#FAEEDA', '#854F0B'),
    txt('Global', 13, 'Regular', '#333333'),
    txt('—', 13, 'Regular', '#9E9E9C'),
    txt('2 accreditations', 13, 'Regular', '#333333'),
    badge('Active', '#DCFCE7', '#166534', '#16A34A'),
    viewLink3,
  ]);
  tableFrame.appendChild(row3);

  // Row 4 – Hanoi Textile
  const nameCell4 = vStack('nameCell4', 2);
  nameCell4.appendChild(txt('Hanoi Textile Manufacturing', 13, 'Medium', '#111111'));
  nameCell4.appendChild(txt('VN-FAC-087', 11, 'Regular', '#9E9E9C'));
  const parentLink4 = txt('Nguyen Apparel Group', 13, 'Regular', '#534AB7');
  const viewLink4 = txt('View →', 13, 'Medium', '#185FA5');

  const row4 = tableRow([
    checkbox(),
    nameCell4,
    badge('Factory', '#E1F5EE', '#0F6E56'),
    txt('Vietnam', 13, 'Regular', '#333333'),
    parentLink4,
    txt('3 active', 13, 'Regular', '#333333'),
    badge('Pending review', '#FEF9C3', '#854D0E', '#CA8A04'),
    viewLink4,
  ]);
  tableFrame.appendChild(row4);

  // Row 5 – Pacific Quality
  const nameCell5 = vStack('nameCell5', 2);
  nameCell5.appendChild(txt('Pacific Quality Inspections Ltd', 13, 'Medium', '#111111'));
  nameCell5.appendChild(txt('PQI-3P-004', 11, 'Regular', '#9E9E9C'));
  const viewLink5 = txt('View →', 13, 'Medium', '#185FA5');

  const row5 = tableRow([
    checkbox(),
    nameCell5,
    badge('3P company', '#FAEEDA', '#854F0B'),
    txt('Hong Kong', 13, 'Regular', '#333333'),
    txt('—', 13, 'Regular', '#9E9E9C'),
    txt('Contract expired', 13, 'Regular', '#9E9E9C'),
    badge('Inactive', '#F3F3F2', '#6B6B69', '#CBCBC9'),
    viewLink5,
  ]);
  tableFrame.appendChild(row5);

  main.appendChild(tableFrame);
  curY += tableFrame.height + 16;

  // ── PAGINATION FOOTER ─────────────────────────────────────
  const pagination = hStack('Pagination', 8);
  pagination.x = LEFT; pagination.y = curY;
  pagination.primaryAxisSizingMode = 'FIXED';
  pagination.counterAxisSizingMode = 'HUG';
  pagination.resize(tableW, 36);
  pagination.primaryAxisAlignItems = 'SPACE_BETWEEN';
  pagination.counterAxisAlignItems = 'CENTER';
  pagination.fills = [];

  pagination.appendChild(txt('Showing 5 of 487 orgs', 13, 'Regular', '#6B6B69'));

  const pageButtons = hStack('PageButtons', 8);
  pageButtons.appendChild(button('← Prev', '#FFFFFF', '#333333', '#E5E5E3'));
  pageButtons.appendChild(button('Next →', '#FFFFFF', '#333333', '#E5E5E3'));
  pagination.appendChild(pageButtons);
  main.appendChild(pagination);

  // ── PROTOTYPE DESTINATION FRAMES ─────────────────────────
  // Frame A: Onboard org wizard
  const frameA = makeFrame('Onboard org — wizard (step 1)', PAGE_W, 1080);
  frameA.fills = solidFill('#F8F8F7');
  frameA.x = PAGE_W + 120; frameA.y = 0;
  const frameALabel = txt('Onboard org — wizard (step 1)', 24, 'Medium', '#9E9E9C');
  frameALabel.x = (PAGE_W - 400) / 2; frameALabel.y = 500;
  frameA.appendChild(frameALabel);
  page.appendChild(frameA);

  // Frame B: Vendor detail — M Square China
  const frameB = makeFrame('Vendor detail — M Square China', PAGE_W, 1080);
  frameB.fills = solidFill('#F8F8F7');
  frameB.x = (PAGE_W + 120) * 2; frameB.y = 0;
  const frameBLabel = txt('Vendor detail — M Square China', 24, 'Medium', '#9E9E9C');
  frameBLabel.x = (PAGE_W - 380) / 2; frameBLabel.y = 500;
  frameB.appendChild(frameBLabel);
  page.appendChild(frameB);

  // Frame C: Factory detail — Dongguan Hongrun
  const frameC = makeFrame('Factory detail — Dongguan Hongrun', PAGE_W, 1080);
  frameC.fills = solidFill('#F8F8F7');
  frameC.x = (PAGE_W + 120) * 3; frameC.y = 0;
  const frameCLabel = txt('Factory detail — Dongguan Hongrun', 24, 'Medium', '#9E9E9C');
  frameCLabel.x = (PAGE_W - 400) / 2; frameCLabel.y = 500;
  frameC.appendChild(frameCLabel);
  page.appendChild(frameC);

  // Frame D: Vendors-only filtered view (duplicate of main with "Vendors" tab active)
  const frameD = makeFrame('Organization Directory — Vendors view', PAGE_W, 1080);
  frameD.fills = solidFill('#F8F8F7');
  frameD.x = (PAGE_W + 120) * 4; frameD.y = 0;
  const frameDLabel = txt('Organization Directory (Vendors tab active)', 24, 'Medium', '#9E9E9C');
  frameDLabel.x = (PAGE_W - 500) / 2; frameDLabel.y = 500;
  frameD.appendChild(frameDLabel);
  page.appendChild(frameD);

  // ── PROTOTYPE CONNECTIONS ─────────────────────────────────
  // Onboard btn → Frame A
  onboardBtn.reactions = [{
    action: { type: 'NODE', destinationId: frameA.id, navigation: 'NAVIGATE', transition: null, preserveScrollPosition: false },
    trigger: { type: 'ON_CLICK' },
  }];

  // View → Row 1 (M Square China) → Frame B
  viewLink1.reactions = [{
    action: { type: 'NODE', destinationId: frameB.id, navigation: 'NAVIGATE', transition: null, preserveScrollPosition: false },
    trigger: { type: 'ON_CLICK' },
  }];

  // View → Row 2 (Dongguan) → Frame C
  viewLink2.reactions = [{
    action: { type: 'NODE', destinationId: frameC.id, navigation: 'NAVIGATE', transition: null, preserveScrollPosition: false },
    trigger: { type: 'ON_CLICK' },
  }];

  // Vendors tab → Frame D
  const vendorsTab = tabBar.children[1]; // 'Vendors (142)' is index 1
  vendorsTab.reactions = [{
    action: { type: 'NODE', destinationId: frameD.id, navigation: 'NAVIGATE', transition: null, preserveScrollPosition: false },
    trigger: { type: 'ON_CLICK' },
  }];

  // ── Wrap up ───────────────────────────────────────────────
  figma.viewport.scrollAndZoomIntoView([main]);
  figma.currentPage.selection = [main];

  figma.closePlugin('Organization Directory screen built ✓');
}

main().catch((err) => figma.closePlugin('Error: ' + err.message));
