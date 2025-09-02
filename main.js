function canvas_arrow(context, fromx, fromy, tox, toy) {
    context.beginPath();
    var headlen =  15; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(fromx + (tox - fromx)*0.985, fromy + (toy - fromy)*0.985);
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
}

function get_form_bounds(form) {
    const padding = 1;

    let bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    let currentWalk = { x: 0, y: 0 };

    form.pattern.forEach(movement => {
        currentWalk.x += movement.moveX;
        currentWalk.y += movement.moveY;

        bounds.minX = Math.min(bounds.minX, currentWalk.x);
        bounds.minY = Math.min(bounds.minY, currentWalk.y);
        bounds.maxX = Math.max(bounds.maxX, currentWalk.x);
        bounds.maxY = Math.max(bounds.maxY, currentWalk.y);
    });

    bounds.minX -= padding;
    bounds.minY -= padding;
    bounds.maxX += padding;
    bounds.maxY += padding * 1.25;
    return bounds;
}

const TEXTBOX_WIDTH = 280;

function draw_form(form) {
    const bounds = get_form_bounds(form);
    const stepDistance = Math.min(canvas.width / (bounds.maxX - bounds.minX), canvas.height / (bounds.maxY - bounds.minY));
    let currentPoint = { x: canvas.width / (bounds.maxX - bounds.minX) * -bounds.minX, y: canvas.height / (bounds.maxY - bounds.minY) * -bounds.minY };
    let textPosition = null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    form.pattern.forEach((movement, index) => {
        let newPoint = { x: currentPoint.x + movement.moveX * stepDistance, y: currentPoint.y + movement.moveY * stepDistance };
        let colorAlpha = index === currentStep ? 1 : 0.07;

        // Yellow circle for kihup
        if(movement.kihup) {
            ctx.fillStyle = `rgba(225,225,0,${colorAlpha})`;
            ctx.beginPath();
            ctx.arc(newPoint.x, newPoint.y, stepDistance / 8, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Backwards is dashed
        ctx.setLineDash(movement.backwards ? [10, 5] : []);
        // Read stance color and draw arrow
        ctx.strokeStyle = (stanceColorData.hasOwnProperty(movement.stance) ? stanceColorData[movement.stance] : stanceColorData.default).replace('$alpha', ''+colorAlpha);
        canvas_arrow(ctx, currentPoint.x, currentPoint.y, newPoint.x, newPoint.y);

        // Draw multiple arrow heads for multiple movements in one stance
        for(let i = 1; i < (movement.multiMove || 1); i++) {
            // Very small arrows on multiMoves tend to merge together, so use a smaller factor
            let shrinkFactorX = Math.abs(movement.moveX) > 0.3 ? 0.93 : 0.7;
            let shrinkFactorY = Math.abs(movement.moveY) > 0.3 ? 0.93 : 0.7;
            
            canvas_arrow(ctx, currentPoint.x, currentPoint.y,
                currentPoint.x + movement.moveX * stepDistance * Math.pow(shrinkFactorX, i),
                currentPoint.y + movement.moveY * stepDistance * Math.pow(shrinkFactorY, i));
        }

        // textPosition being non-null indicates the movement has handTechniques; remember the position to draw on top later
        if(index === currentStep && movement.handTechniques) {
            textPosition = { x: newPoint.x, y: newPoint.y };
        }

        currentPoint = newPoint;
    });

    // Draw hand movement text box
    let currentMovement = form.pattern[currentStep];
    if(textPosition) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.fillRect(textPosition.x + 10, textPosition.y + 10, TEXTBOX_WIDTH, 10 + currentMovement.handTechniques.length*24);
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.strokeRect(textPosition.x + 10, textPosition.y + 10, TEXTBOX_WIDTH, 10 + currentMovement.handTechniques.length*24);
        ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,1)';
        currentMovement.handTechniques.forEach((technique, index) => {
            ctx.font = `${technique.right ? 'italic ' : ''}18px Verdana`;
            ctx.fillText(technique.move, textPosition.x + 18, textPosition.y + 32 + index*24);
        });
    }
}

const canvas = document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
ctx.lineWidth = 3;

const stanceData = [
    {
        name: 'Low/Front Stance',
        koreanName: 'Ap Kubi',
        colorCode: 'lowStance'
    }, {
        name: 'High/Walking Stance',
        koreanName: 'Ap Seogi',
        colorCode: 'highStance'
    }, {
        name: 'Side/Back Stance',
        koreanName: 'Dwi Kubi',
        colorCode: 'sideStance'
    }, {
        name: 'Cat/Tiger Stance',
        koreanName: 'Beom Seogi',
        colorCode: 'catStance'
    }, {
        name: 'Neutral Stance',
        koreanName: 'Naranhi Seogi',
        colorCode: 'neutralStance'
    }, {
        name: 'Horse/Sitting Stance',
        koreanName: 'Juchum Seogi',
        colorCode: 'horseStance'
    }, {
        name: 'Crane Stance',
        koreanName: 'Hakdari Seogi',
        colorCode: 'craneStance'
    },
];

const stanceColorData = {
    lowStance: 'rgba(255,0,0,$alpha)',
    highStance: 'rgba(0,255,0,$alpha)',
    sideStance: 'rgba(0,0,255,$alpha)',
    catStance: 'rgba(127,127,127,$alpha)',
    neutralStance: 'rgba(127,127,255,$alpha)',
    horseStance: 'rgba(255,127,0,$alpha)',
    craneStance: 'rgba(255,0,255,$alpha)',
    default: 'rgba(0,0,0,$alpha)'
}
const formData = [
    {
        name: 'Ki-Bon Il Jang',
        belt: '#ffffff',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }], kihup: true },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }], kihup: true },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
        ]
    }, {
        name: 'Ki-Bon Ee Jang',
        belt: '#ffffff',
        beltStripe: '#eeee00',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'High Block', right: true }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'High Block', right: false }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'High Block', right: true }], kihup: true },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'High Block', right: true }] },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'High Block', right: false }] },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'High Block', right: true }], kihup: true },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
        ]
    }, {
        name: 'Taegeuk Il Jang',
        belt: '#eeee00',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }, { move: 'Middle Punch', right: true }], multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Inner Block', right: false }] },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Inner Block', right: true }] },
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: true }, { move: 'Middle Punch', right: false }], multiMove: 2 },
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'High Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Middle Punch', right: true }], multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'High Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Front Snap Kick', right: false }, { move: 'Middle Punch', right: false }], multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }], kihup: true },
        ]
    }, {
        name: 'Taegeuk Ee Jang',
        belt: '#eeee00',
        beltStripe: '#00ee00',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
            { moveX: 0, moveY: -1, stance: 'highStance', handTechniques: [{ move: 'Inner Block', right: true }] },
            { moveX: 0, moveY: -1, stance: 'highStance', handTechniques: [{ move: 'Inner Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'High Punch', right: true }], multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Front Snap Kick', right: false }, { move: 'High Punch', right: false }], multiMove: 2 },
            { moveX: 0, moveY: -1, stance: 'highStance', handTechniques: [{ move: 'High Block', right: false }] },
            { moveX: 0, moveY: -1, stance: 'highStance', handTechniques: [{ move: 'High Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Inner Block', right: true }] },
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Inner Block', right: false }] },
            { moveX: 0, moveY: 1, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: 0, moveY: 1, stance: 'highStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Middle Punch', right: true }], multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'highStance', handTechniques: [{ move: 'Front Snap Kick', right: false }, { move: 'Middle Punch', right: false }], multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'highStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Middle Punch', right: true }], multiMove: 2, kihup: true },
        ]
    }, {
        name: 'Taegeuk Sam Jang',
        belt: '#00ee00',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Middle Punch', right: true }, { move: 'Middle Punch', right: false }], multiMove: 3 },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Front Snap Kick', right: false }, { move: 'Middle Punch', right: false }, { move: 'Middle Punch', right: true }], multiMove: 3 },
            { moveX: 0, moveY: -1, stance: 'highStance', handTechniques: [{ move: 'Knife Hand Strike', right: true }] },
            { moveX: 0, moveY: -1, stance: 'highStance', handTechniques: [{ move: 'Knife Hand Strike', right: false }] },
            { moveX: -1, moveY: 0, stance: 'sideStance', handTechniques: [{ move: 'Outer Knife Hand Block', right: false }] },
            { moveX: -0.2, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: true }] },
            { moveX: 1, moveY: 0, stance: 'sideStance', handTechniques: [{ move: 'Outer Knife Hand Block', right: true }] },
            { moveX: 0.2, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Middle Punch', right: false }] },
            { moveX: 0, moveY: -1, stance: 'highStance', handTechniques: [{ move: 'Inner Forearm Block', right: true }] },
            { moveX: 0, moveY: -1, stance: 'highStance', handTechniques: [{ move: 'Inner Forearm Block', right: false }] },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Middle Punch', right: true }, { move: 'Middle Punch', right: false }], multiMove: 3 },
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Front Snap Kick', right: false }, { move: 'Middle Punch', right: false }, { move: 'Middle Punch', right: true }], multiMove: 3 },
            { moveX: 0, moveY: 1, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: false }, { move: 'Middle Punch', right: true }], multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'highStance', handTechniques: [{ move: 'Low Block', right: true }, { move: 'Middle Punch', right: false }], multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'highStance', handTechniques: [{ move: 'Front Snap Kick', right: false }, { move: 'Low Block', right: false }, { move: 'Middle Punch', right: true }], multiMove: 3 },
            { moveX: 0, moveY: 1, stance: 'highStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Low Block', right: true }, { move: 'Middle Punch', right: false }], multiMove: 3, kihup: true },
        ]
    }, {
        name: 'Taegeuk Sa Jang',
        belt: '#00ee00',
        beltStripe: '#4444ff',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'sideStance', handTechniques: [{ move: 'Double Knife Hand Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Spearhand', right: true }] },
            { moveX: 1, moveY: 0, stance: 'sideStance', handTechniques: [{ move: 'Double Knife Hand Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Spearhand', right: false }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Knife Hand Strike/High Block', right: true }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Middle Punch', right: false }], multiMove: 2 },
            { moveX: 0, moveY: -2, stance: 'sideStance', handTechniques: [{ move: 'Side Kick', right: false }, { move: 'Side Kick', right: true }, { move: 'Double Knife Hand Block', right: true }], multiMove: 3 },
            { moveX: 1, moveY: 0, stance: 'sideStance', handTechniques: [{ move: 'Outer Forearm Block', right: false }] },
            { moveX: 0.2, moveY: 0, stance: 'sideStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Inner Forearm Block', right: true }], multiMove: 2 },
            { moveX: -1, moveY: 0, stance: 'sideStance', handTechniques: [{ move: 'Outer Forearm Block', right: true }] },
            { moveX: -0.2, moveY: 0, stance: 'sideStance', handTechniques: [{ move: 'Front Snap Kick', right: false }, { move: 'Inner Forearm Block', right: false }], multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Knife Hand Strike/High Block', right: true }] },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Inner Forearm Block*', right: true }], multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Inner Forearm Block', right: false }, { move: 'Middle Punch', right: true }], multiMove: 2 },
            { moveX: -1, moveY: 0, stance: 'highStance', handTechniques: [{ move: 'Inner Forearm Block', right: true }, { move: 'Middle Punch', right: false }], multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Inner Forearm Block', right: false }, { move: 'Middle Punch', right: true }, { move: 'Middle Punch', right: false }], multiMove: 3 },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Inner Forearm Block', right: true }, { move: 'Middle Punch', right: false }, { move: 'Middle Punch', right: true }], multiMove: 3, kihup: true },
        ]
    }, {
        name: 'Taegeuk Oh Jang',
        belt: '#4444ff',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }] },
            { moveX: 1, moveY: 0, backwards: true, stance: 'highStance', handTechniques: [{ move: 'Hammer Fist', right: false }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: true }] },
            { moveX: -1, moveY: 0, backwards: true, stance: 'highStance', handTechniques: [{ move: 'Hammer Fist', right: true }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Inner Forearm Block', right: false }, { move: 'Inner Forearm Block', right: true }], multiMove: 2 },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Backfist', right: true }, { move: 'Inner Forearm Block', right: false }], multiMove: 3 },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Front Snap Kick', right: false }, { move: 'Backfist', right: false }, { move: 'Inner Forearm Block', right: true }], multiMove: 3 },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Backfist', right: true }] },
            { moveX: 1, moveY: 0, stance: 'sideStance', handTechniques: [{ move: 'Outer Knife Hand Block', right: false }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Elbow (Catch Fist)', right: true }] },
            { moveX: -1, moveY: 0, stance: 'sideStance', handTechniques: [{ move: 'Outer Knife Hand Block', right: true }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Elbow (Catch Fist)', right: false }] },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }, { move: 'Inner Forearm Block', right: true }], multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Low Block', right: true }, { move: 'Inner Forearm Block', right: false }], multiMove: 3 },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'High Block', right: false }] },
            { moveX: 1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Side Kick + Backfist', right: true }, { move: 'Elbow (Catch Elbow)', right: false }], multiMove: 2 },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'High Block', right: true }] },
            { moveX: -1, moveY: 0, stance: 'lowStance', handTechniques: [{ move: 'Side Kick + Backfist', right: false }, { move: 'Elbow (Catch Elbow)', right: true }], multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'lowStance', handTechniques: [{ move: 'Low Block', right: false }, { move: 'Inner Forearm Block', right: true }], multiMove: 2 },
            { moveX: 0, moveY: 1.5, stance: 'catStance', handTechniques: [{ move: 'Front Snap Kick', right: true }, { move: 'Backfist', right: true }], multiMove: 2, kihup: true },
        ]
    }, {
        name: 'Taegeuk Yook Jang*',
        belt: '#4444ff',
        beltStripe: '#ee0000',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -0.2, moveY: 0, stance: 'sideStance', multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 0.2, moveY: 0, stance: 'sideStance', multiMove: 2 },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: -0.1, moveY: -0.9 },
            { moveX: -0.9, moveY: -0.1, stance: 'lowStance', multiMove: 2 },
            { moveX: -1, moveY: 0, stance: 'lowStance', multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'lowStance', multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'lowStance', multiMove: 2 },
            { moveX: -1, moveY: 0, stance: 'neutralStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: -0.1, moveY: -0.9, kihup: true },
            { moveX: -0.9, moveY: -0.1, stance: 'lowStance', multiMove: 2 },
            { moveX: -0.2, moveY: 0, stance: 'sideStance', multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 0.2, moveY: 0, stance: 'sideStance', multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'sideStance', backwards: true },
            { moveX: 0, moveY: 1, stance: 'sideStance', backwards: true },
            { moveX: 0, moveY: 1, stance: 'lowStance', backwards: true, multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'lowStance', backwards: true, multiMove: 2 },
        ]
    }, {
        name: 'Keumgang',
        belt: '#000000',
        dan: 2,
        pattern: [
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Twin Inner Forearm Block', right: false }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Palm Strike', right: true }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Palm Strike', right: false }] },
            { moveX: 0, moveY: -1, stance: 'lowStance', handTechniques: [{ move: 'Palm Strike', right: true }] },
            { moveX: 0, moveY: 1, stance: 'sideStance', handTechniques: [{ move: 'Inner Knife Hand Block', right: false }], backwards: true },
            { moveX: 0, moveY: 1, stance: 'sideStance', handTechniques: [{ move: 'Inner Knife Hand Block', right: true }], backwards: true },
            { moveX: 0, moveY: 1, stance: 'sideStance', handTechniques: [{ move: 'Inner Knife Hand Block', right: false }], backwards: true },
            { moveX: -0.2, moveY: 0, stance: 'craneStance', handTechniques: [{ move: 'Low Block + High Block', right: false }] }, // TODO symbolism for slow counts, and number of seconds
            { moveX: -1, moveY: 0, stance: 'horseStance', handTechniques: [{ move: 'Sideways Punch*', right: true }] },
            { moveX: -1, moveY: 0, stance: 'horseStance', handTechniques: [{ move: 'Sideways Punch*', right: true }] },
            { moveX: 0, moveY: -1, stance: 'horseStance', handTechniques: [{ move: 'Mountain Block', right: true }], kihup: true },
            { moveX: 0, moveY: -1, stance: 'horseStance', handTechniques: [{ move: 'Twin Inner Forearm Block', right: false }] },
            { moveX: 0, moveY: 1, stance: 'neutralStance', handTechniques: [{ move: 'Twin Low Block*', right: true }] },
            { moveX: 0, moveY: 1, stance: 'horseStance', handTechniques: [{ move: 'Mountain Block', right: false }] },
            { moveX: 0.2, moveY: 0, stance: 'craneStance', handTechniques: [{ move: 'Low Block + High Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'horseStance', handTechniques: [{ move: 'Sideways Punch*', right: false }] },
            { moveX: 1, moveY: 0, stance: 'horseStance', handTechniques: [{ move: 'Sideways Punch*', right: false }] },
            { moveX: 0.2, moveY: 0, stance: 'craneStance', handTechniques: [{ move: 'Low Block + High Block', right: true }] },
            { moveX: 1, moveY: 0, stance: 'horseStance', handTechniques: [{ move: 'Sideways Punch*', right: false }] },
            { moveX: 1, moveY: 0, stance: 'horseStance', handTechniques: [{ move: 'Sideways Punch*', right: false }] },
            { moveX: 0, moveY: -1, stance: 'horseStance', handTechniques: [{ move: 'Mountain Block', right: false }], kihup: true },
            { moveX: 0, moveY: -1, stance: 'horseStance', handTechniques: [{ move: 'Twin Inner Forearm Block', right: false }] },
            { moveX: 0, moveY: 1, stance: 'neutralStance', handTechniques: [{ move: 'Twin Low Block*', right: false }] },
            { moveX: 0, moveY: 1, stance: 'horseStance', handTechniques: [{ move: 'Mountain Block', right: true }] },
            { moveX: -0.2, moveY: 0, stance: 'craneStance', handTechniques: [{ move: 'Low Block + High Block', right: false }] },
            { moveX: -1, moveY: 0, stance: 'horseStance', handTechniques: [{ move: 'Sideways Punch*', right: true }] },
            { moveX: -1, moveY: 0, stance: 'horseStance', handTechniques: [{ move: 'Sideways Punch*', right: true }] },
        ]
    },
];

const validHandTechniques = [
    'Low Block',
    'High Block',
    'Inner Block',
    'Outer Block',
    'Outer Knife Hand Block',
    'Inner Knife Hand Block',
    'Double Knife Hand Block',
    'Inner Forearm Block',
    'Outer Forearm Block',
    'Mountain Block', // Keumgang
    'Twin Inner Forearm Block', // Keumgang
    'Middle Punch',
    'High Punch',
    'Knife Hand Strike',
    'Spearhand',
    'Backfist',
    'Hammer Fist',
    'Palm Strike', // Keumgang, may be pushed down
    'Front Snap Kick',
    'Side Kick',
    'Knife Hand Strike/High Block',

    'Elbow (Catch Fist)',
    'Elbow (Catch Elbow)',
    'Side Kick + Backfist',

    'Low Block + High Block',
    'Sideways Punch*' // Need to correct*, validated to reduce spam
];

// Check that all hand movements exist in the list above, to avoid typos
formData.forEach(form => form.pattern.forEach((movement, index) => {
    if(movement.handTechniques) {
        movement.handTechniques.forEach((move) => {
            if(!validHandTechniques.includes(move.move)) {
                console.warn(`Unknown hand technique in form ${form.name}, stance index ${index}: ${JSON.stringify(move)}.`);
            }
        });
    }
}));

let showLegend = false;
let currentStep = 0;
let selectedForm = formData[0];
draw_form(selectedForm);

window.onresize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineWidth = 3;
    draw_form(selectedForm);
};

// Construct nav bar from form data
formData.forEach(form => {
    let navBtn = document.createElement('div');
    let span = document.createElement('span');
    let div = document.createElement('div');

    span.innerHTML = form.name;

    div.className = 'belt-indicator';
    div.style.borderTop = '4px solid ' + form.belt;
    div.style.borderBottom = '4px solid ' + form.belt;
    div.style.backgroundColor = form.beltStripe || form.belt;
    if(form.dan) {
        let str = '';
        for(let i = 0; i < form.dan; i++) {
            str += 'l';
        }
        div.innerHTML = str;
    }

    navBtn.className = 'nav-button';
    navBtn.onclick = () => {
        currentStep = 0;
        selectedForm = form;
        draw_form(selectedForm);
    };
    navBtn.appendChild(div);
    navBtn.appendChild(span);
    document.getElementById('forms-nav').appendChild(navBtn);
});

// Construct legend from stance data
stanceData.forEach(stance => {
    let colorDiv = document.createElement('div');
    let nameSpan = document.createElement('span');

    colorDiv.className = 'legend-color-indicator';
    colorDiv.style.backgroundColor = stanceColorData[stance.colorCode].replace('$alpha', '1');

    nameSpan.innerHTML = `${stance.name} (${stance.koreanName})`;

    document.getElementById('legendColorColumn').appendChild(colorDiv);
    document.getElementById('legendNameColumn').appendChild(nameSpan);
});


// Movement navigation clicking
document.getElementById('forwardStepBtn').onclick = () => {
    currentStep = (currentStep + 1) % selectedForm.pattern.length;
    draw_form(selectedForm);
}
document.getElementById('backStepBtn').onclick = () => {
    currentStep = (currentStep - 1 + selectedForm.pattern.length) % selectedForm.pattern.length;
    draw_form(selectedForm);
}

// Legend toggle
document.getElementById('legendBtn').onclick = () => {
    showLegend = !showLegend;
    document.getElementById('legendBtn').innerHTML = showLegend ? 'Hide Legend' : 'Show Legend';
    document.getElementById('legendContainer').style.display = showLegend ? 'flex' : 'none';
    draw_form(selectedForm);
};

// Horizontal scroll
function horizontalScroll(event) {
    if(event.shiftKey) {
        return;
    }

    let nav = document.getElementById('forms-nav');
    if(nav.contains(event.target)) {
        nav.scrollBy({ left: event.detail * 75, behavior: 'smooth' });
    }
}
window.addEventListener('mousewheel', horizontalScroll, false);
window.addEventListener('DOMMouseScroll', horizontalScroll, false);
