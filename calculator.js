// ===== Dynamic Cut List Calculator =====
// Adjusting dimensions on any project recalculates cut lists automatically

(function() {
    'use strict';

    // Helper: get element by ID
    function $(id) { return document.getElementById(id); }

    // Helper: update cut list items with named placeholder values
    // Each value object has keys that match [key] placeholders in both cut list AND step text
    function updateCutList(id, values) {
        const list = $(id);
        if (!list) return;
        const items = list.querySelectorAll('li');
        for (const li of items) {
            for (const [key, val] of Object.entries(values)) {
                li.textContent = li.textContent.replace(new RegExp(`\\[${key}\\]`, 'g'), String(val));
            }
        }
        // Update step text placeholders using the same card and values
        const cardId = id.replace('-cutlist', '');
        const card = $(cardId);
        updateStepText(card, values);
    }

    // Helper: replace [placeholder] text in step descriptions
    function updateStepText(card, values) {
        if (!card) return;
        const steps = card.querySelectorAll('.steps-list li');
        for (const li of steps) {
            // Replace [key] placeholders in textContent (preserves <strong> tags)
            const original = li.textContent;
            let newText = original;
            for (const [key, val] of Object.entries(values)) {
                newText = newText.replace(new RegExp(`\\[${key}\\]`, 'g'), String(val));
            }
            li.textContent = newText;
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

        updateCutList('cb-cutlist', {
            maple: `${maple}`, walnut: `${walnut}`,
            strips: `${strips}`, len: `${len}`,
            dims: `${wid}" × ${len}"`
        });
    }

    // ===== Floating Shelves Calculator =====
    function updateFloatingShelves() {
        const len = parseInt($('fs-len').value);
        const dep = parseInt($('fs-dep').value);
        const bracketDepth = dep; // bracket arm depth matches shelf depth

        $('fs-len-val').textContent = len;
        $('fs-dep-val').textContent = dep;

        updateCutList('fs-cutlist', {
            face: `${len - 2}`,
            arms: `${bracketDepth + 2}`
        });
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

        updateCutList('pb-cutlist', {
            frontBack: `${len - 2}`,
            sides: `${wid - 7}`,
            dims: `${len - 2}" × ${wid - 7}"`
        });
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

        updateCutList('st-cutlist', {
            legs: `${height - 2}`,
            sideRails: `${wid - 7}`,
            shortRails: `${dep - 7}`,
            dims: `${wid}" × ${dep}"`
        });
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

        updateCutList('sh-cutlist', {
            leg1: leg1Len.toFixed(1),
            leg2: leg2Len.toFixed(1),
            sides: sideLen.toFixed(1),
            tops: topLen.toFixed(1),
            beams: beamLen.toFixed(1)
        });
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


        updateCutList('gs-cutlist', {
            posts: hei,
            rungs: `${rungs}`,
            rails: len,
            shelves: `${shelves}`,
            shelfDims: `${dep}" × ${len}"`
        });
    }

    // ===== Fold-Down Workbench Calculator (Ana White Folding) =====
    function updateFoldBench() {
        const wid = parseInt($('fb-wid').value);
        const dep = parseInt($('fb-dep').value);
        const len = parseInt($('fb-len').value);

        $('fb-wid-val').textContent = wid;
        $('fb-dep-val').textContent = dep;
        $('fb-len-val').textContent = len;

        updateCutList('fb-cutlist', {
            surface: `${dep}" × ${len}"`,
            legs: len,
            mounts: dep,
            storageSides: dep,
            storageBottoms: dep - 2
        });
    }

    // ===== Pegboard Wall Calculator =====
    function updatePegboardWall() {
        const wid = parseInt($('pw-wid').value);
        const hei = parseInt($('pw-hei').value);

        $('pw-wid-val').textContent = wid;
        $('pw-hei-val').textContent = hei;

        updateCutList('pw-cutlist', {
            board: `${wid}" × ${hei}"`,
            topBottom: wid,
            sides: hei - 8
        });
    }

    // ===== Corner Cabinet Calculator =====
    function updateCornerCabinet() {
        const hei = parseInt($('cc-hei').value);
        const sid = parseInt($('cc-sid').value);

        $('cc-hei-val').textContent = hei;
        $('cc-sid-val').textContent = sid;

        const doorLen = (hei / 2) - 2; // each door covers half

        updateCutList('cc-cutlist', {
            sides: `${sid}" × ${hei}"`,
            back: `${sid}" × ${hei}"`,
            top: `${sid}" × 24"`,
            doors: `${sid}" × ${doorLen}"`,
            shelf: `${sid}" × 24"`
        });
    }

    // ===== Bike Rack Calculator =====
    function updateBikeRack() {
        const len = parseInt($('br-len').value);
        const hei = parseInt($('br-hei').value);

        $('br-len-val').textContent = len;
        $('br-hei-val').textContent = hei;



        const numHooks = Math.floor(len / 12);
        const supportBlocks = numHooks * 2;
        updateCutList('br-cutlist', {
            rail: len,
            blocks: `${supportBlocks}`,
            hooks: `${numHooks * 2}`
        });
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
