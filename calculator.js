// ===== Dynamic Cut List Calculator =====
// Adjusting dimensions on any project recalculates cut lists automatically

(function() {
    'use strict';

    // Helper: get element by ID
    function $(id) { return document.getElementById(id); }

    // Helper: update cut list items with computed values
    function updateCutList(id, values) {
        const list = $(id);
        if (!list) return;
        const items = list.querySelectorAll('li');
        for (const li of items) {
            const idx = Array.from(items).indexOf(li);
            if (values[idx] !== undefined) {
                li.textContent = li.textContent.replace(/\[.*?\]/, values[idx]);
            }
        };
        // Update step text placeholders
        updateStepText(id.replace('-cutlist', ''), values);
    }

    // Helper: replace [placeholder] text in step descriptions
    function updateStepText(projectId, values) {
        const card = $(projectId);
        if (!card) return;
        const steps = card.querySelectorAll('.steps-list li');
        for (const li of steps) {
            for (const [key, val] of Object.entries(values)) {
                const html = li.innerHTML;
                li.textContent = html.replace(`[${key}]`, val);
            }
        }
    }

    // ===== Cutting Board Calculator =====
    function updateCuttingBoard() {
        const len = parseInt($('cb-len').value);
        const wid = parseInt($('cb-wid').value);
        const strips = parseInt($('cb-strips').value);
        const maple = Math.ceil(strips / 2);
        const walnut = Math.floor(strips / 2);


        $('cb-len-val').textContent = len;
        $('cb-wid-val').textContent = wid;
        $('cb-strips-val').textContent = strips;

        updateCutList('cb-cutlist', [
            `${maple} × 3⅝" × [${len}]`,
            `${walnut} × 3⅝" × [${len}]`
        ]);
    }

    // ===== Floating Shelves Calculator =====
    function updateFloatingShelves() {
        const len = parseInt($('fs-len').value);
        const dep = parseInt($('fs-dep').value);
        const bracketDepth = dep; // bracket arm depth matches shelf depth

        $('fs-len-val').textContent = len;
        $('fs-dep-val').textContent = dep;

        updateCutList('fs-cutlist', [
            `1 × 1×10 × [${len - 2}]"`,
            `2 × 1×4 × [${bracketDepth + 2}]"`,
            `2 × M6×40mm L-brackets`
        ]);
    }

    // ===== Planter Box Calculator =====
    function updatePlanterBox() {
        const len = parseInt($('pb-len').value);
        const wid = parseInt($('pb-wid').value);
        const hei = parseInt($('pb-hei').value);
        // Front/back are full length, sides are narrower (fit inside front/back)

        $('pb-len-val').textContent = len;
        $('pb-wid-val').textContent = wid;
        $('pb-hei-val').textContent = hei;

        updateCutList('pb-cutlist', [
            `2 × 1×6 × [${len - 2}]"`,
            `2 × 1×6 × [${sideLen}]"`,
            `1 × plywood [${len - 2}" × ${sideLen}"]`
        ]);
    }

    // ===== Side Table Calculator =====
    function updateSideTable() {
        const wid = parseInt($('st-wid').value);
        const dep = parseInt($('st-dep').value);
        const height = parseInt($('st-hei').value);
        // Legs are shorter than height by ~2" (top + rail thickness)

        $('st-wid-val').textContent = wid;
        $('st-dep-val').textContent = dep;
        $('st-hei-val').textContent = height;

        updateCutList('st-cutlist', [
            `4 × 1×4 × [${legLen}]"`,
            `2 × 1×4 × [${railLen}]"`,
            `2 × 1×4 × [${shortRailLen}]"`,
            `1 × 1×10 × [${wid}" × ${dep}"]`
        ]);
    }

    // ===== Sawhorses Calculator (Ana White Heavy Duty) =====
    function updateSawhorses() {
        const topWid = parseFloat($('sh-wid').value);
        const height = parseInt($('sh-hei').value);

        $('sh-wid-val').textContent = topWid.toFixed(3);
        $('sh-hei-val').textContent = height;

        // Based on Ana White's plan: legs at 15°, braces at 15°
        // Simplified: leg lengths scale proportionally
        const leg1Len = Math.round((height / 30) * 10.75 * 10) / 10; // ~10¾" scaled
        const leg2Len = Math.round((height / 30) * 19.25 * 10) / 10; // ~19¼" scaled
        const sideLen = Math.round((height / 30) * 25.875 * 10) / 10; // ~25⅞" scaled
        const topLen = Math.round((height / 30) * 32 * 10) / 10; // ~32" scaled
        const beamLen = topWid + 0.625; // ~33⅝" scaled

        updateCutList('sh-cutlist', [
            `4 × 2×4 @ [${leg1Len.toFixed(1)}]"`,
            `4 × 2×4 @ [${leg2Len.toFixed(1)}]"`,
            `8 × 2×4 @ [${sideLen.toFixed(1)}]"`,
            `6 × 2×4 @ [${topLen.toFixed(1)}]"`,
            `4 × 1×3 @ [${beamLen.toFixed(1)}]"`
        ]);
    }

    // ===== Garage Shelving Calculator (Ana White Ultimate) =====
    function updateGarageShelf() {
        const len = parseInt($('gs-len').value);
        const hei = parseInt($('gs-hei').value);
        const dep = parseInt($('gs-dep').value);
        const shelves = parseInt($('gs-shelf').value);

        $('gs-len-val').textContent = len;
        $('gs-hei-val').textContent = hei;
        $('gs-dep-val').textContent = dep;
        $('gs-shelf-val').textContent = shelves;

        // Ana White: 2×4 ladder supports, 21" rungs
        // Plywood on top
        const rungsPerLadder = shelves;
        const rungs = rungsPerLadder * 4;


        updateCutList('gs-cutlist', [
            `4 × 2×4 × [${hei}]"`,
            `${rungs} × 2×4 × [21]"`,
            `4 × 2×4 × [${len}]"`,
            `${shelves} × ¾" plywood × [${dep}" × ${len}"]`,
            `1 × ¾" plywood × [${dep}" × ${len}"]`
        ]);
    }

    // ===== Fold-Down Workbench Calculator (Ana White Folding) =====
    function updateFoldBench() {
        const wid = parseInt($('fb-wid').value);
        const dep = parseInt($('fb-dep').value);
        const len = parseInt($('fb-len').value);

        $('fb-wid-val').textContent = wid;
        $('fb-dep-val').textContent = dep;
        $('fb-len-val').textContent = len;

        updateCutList('fb-cutlist', [
            `1 × ¾" plywood × [${dep}" × ${len}"]`,
            `2 × 2×4 × [${len}]"`,
            `2 × 2×4 × [${dep}]"`,
            `4 × 2×4 × [${dep}]"`,
            `2 × 2×4 × [${dep - 2}]"`
        ]);
    }

    // ===== Pegboard Wall Calculator =====
    function updatePegboardWall() {
        const wid = parseInt($('pw-wid').value);
        const hei = parseInt($('pw-hei').value);

        $('pw-wid-val').textContent = wid;
        $('pw-hei-val').textContent = hei;

        // Frame: top/bottom = width, sides = height - 8" (subtract two 1×4 thicknesses)
        const sideLen = hei - 8;

        updateCutList('pw-cutlist', [
            `1 × ¼" pegboard × [${wid}" × ${hei}"]`,
            `2 × 1×4 × [${wid}]"`,
            `2 × 1×4 × [${sideLen}]"`
        ]);
    }

    // ===== Corner Cabinet Calculator =====
    function updateCornerCabinet() {
        const hei = parseInt($('cc-hei').value);
        const sid = parseInt($('cc-sid').value);

        $('cc-hei-val').textContent = hei;
        $('cc-sid-val').textContent = sid;

        const doorLen = (hei / 2) - 2; // each door covers half

        updateCutList('cc-cutlist', [
            `2 × ¾" plywood × [${sid}" × [${hei}]]"`,
            `1 × ¾" plywood × [${sid}" × [${hei}]]"`,
            `1 × ¾" plywood × [${sid}" × 24"]`,
            `2 × ¾" plywood × [${sid}" × [${doorLen}]]"`,
            `1 × ¾" plywood × [${sid}" × 24"]`
        ]);
    }

    // ===== Bike Rack Calculator =====
    function updateBikeRack() {
        const len = parseInt($('br-len').value);
        const hei = parseInt($('br-hei').value);

        $('br-len-val').textContent = len;
        $('br-hei-val').textContent = hei;



        updateCutList('br-cutlist', [
            `1 × 2×4 × [${len}]"`,
            `${supportBlocks} × 2×4 × [8]"`,
            `${numHooks * 2} × 2×4 × [4]"`
        ]);
    }

    // ===== Wire up all calculators =====
    function init() {
        // Cutting Board
        $('cb-len').addEventListener('input', updateCuttingBoard);
        $('cb-wid').addEventListener('input', updateCuttingBoard);
        $('cb-strips').addEventListener('input', updateCuttingBoard);

        // Floating Shelves
        $('fs-len').addEventListener('input', updateFloatingShelves);
        $('fs-dep').addEventListener('input', updateFloatingShelves);

        // Planter Box
        $('pb-len').addEventListener('input', updatePlanterBox);
        $('pb-wid').addEventListener('input', updatePlanterBox);
        $('pb-hei').addEventListener('input', updatePlanterBox);

        // Side Table
        $('st-wid').addEventListener('input', updateSideTable);
        $('st-dep').addEventListener('input', updateSideTable);
        $('st-hei').addEventListener('input', updateSideTable);

        // Sawhorses
        $('sh-wid').addEventListener('input', updateSawhorses);
        $('sh-hei').addEventListener('input', updateSawhorses);

        // Garage Shelf
        $('gs-len').addEventListener('input', updateGarageShelf);
        $('gs-hei').addEventListener('input', updateGarageShelf);
        $('gs-dep').addEventListener('input', updateGarageShelf);
        $('gs-shelf').addEventListener('input', updateGarageShelf);

        // Fold-Down Bench
        $('fb-wid').addEventListener('input', updateFoldBench);
        $('fb-dep').addEventListener('input', updateFoldBench);
        $('fb-len').addEventListener('input', updateFoldBench);

        // Pegboard Wall
        $('pw-wid').addEventListener('input', updatePegboardWall);
        $('pw-hei').addEventListener('input', updatePegboardWall);

        // Corner Cabinet
        $('cc-hei').addEventListener('input', updateCornerCabinet);
        $('cc-sid').addEventListener('input', updateCornerCabinet);

        // Bike Rack
        $('br-len').addEventListener('input', updateBikeRack);
        $('br-hei').addEventListener('input', updateBikeRack);

        // Run initial calculations (all defaults)
        updateCuttingBoard();
        updateFloatingShelves();
        updatePlanterBox();
        updateSideTable();
        updateSawhorses();
        updateGarageShelf();
        updateFoldBench();
        updatePegboardWall();
        updateCornerCabinet();
        updateBikeRack();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
