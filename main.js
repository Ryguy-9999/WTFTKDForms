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
    bounds.maxY += padding;
    return bounds;
}

function draw_form(form) {
    const bounds = get_form_bounds(form);
    const stepDistance = Math.min(canvas.width / (bounds.maxX - bounds.minX), canvas.height / (bounds.maxY - bounds.minY));
    let currentPoint = { x: canvas.width / (bounds.maxX - bounds.minX) * -bounds.minX, y: canvas.height / (bounds.maxY - bounds.minY) * -bounds.minY };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    form.pattern.forEach((movement, index) => {
        let newPoint = { x: currentPoint.x + movement.moveX * stepDistance, y: currentPoint.y + movement.moveY * stepDistance };
        let colorAlpha = index === currentStep ? 1 : 0.07;

        if(movement.kihup) {
            ctx.fillStyle = `rgba(225,225,0,${colorAlpha})`;
            ctx.beginPath();
            ctx.arc(newPoint.x, newPoint.y, stepDistance / 8, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.setLineDash(movement.backwards ? [10, 5] : []);        
        ctx.strokeStyle = (stanceColorData.hasOwnProperty(movement.stance) ? stanceColorData[movement.stance] : stanceColorData.default).replace('$alpha', ''+colorAlpha);
        canvas_arrow(ctx, currentPoint.x, currentPoint.y, newPoint.x, newPoint.y);

        for(let i = 0; i < (movement.multiMove || 1); i++) {
            canvas_arrow(ctx, currentPoint.x, currentPoint.y, currentPoint.x + movement.moveX * stepDistance * Math.pow(0.93, i), currentPoint.y + movement.moveY * stepDistance * Math.pow(0.93, i));
        }

        currentPoint = newPoint;
    });
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
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance', kihup: true },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance', kihup: true },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
        ]
    }, {
        name: 'Ki-Bon Ee Jang',
        belt: '#ffffff',
        beltStripe: '#eeee00',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance', kihup: true },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance', kihup: true },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
        ]
    }, {
        name: 'Taegeuk Il Jang',
        belt: '#eeee00',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance', multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance', multiMove: 2 },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance', multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance', multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance', kihup: true },
        ]
    }, {
        name: 'Taegeuk Ee Jang',
        belt: '#eeee00',
        beltStripe: '#00ee00',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'highStance' }, // Low block
            { moveX: -1, moveY: 0, stance: 'lowStance' }, // Middle punch
            { moveX: 1, moveY: 0, stance: 'highStance' }, // Low block
            { moveX: 1, moveY: 0, stance: 'lowStance' }, // Middle punch
            { moveX: 0, moveY: -1, stance: 'highStance' }, // Inner block
            { moveX: 0, moveY: -1, stance: 'highStance' }, // Inner block
            { moveX: -1, moveY: 0, stance: 'highStance' }, // Low block
            { moveX: -1, moveY: 0, stance: 'lowStance', multiMove: 2 }, // Front snap, high punch
            { moveX: 1, moveY: 0, stance: 'highStance' }, // Low block
            { moveX: 1, moveY: 0, stance: 'lowStance', multiMove: 2 }, // Front snap, high punch
            { moveX: 0, moveY: -1, stance: 'highStance' }, // High block
            { moveX: 0, moveY: -1, stance: 'highStance' }, // High block
            { moveX: 1, moveY: 0, stance: 'highStance' }, // Inner block
            { moveX: -1, moveY: 0, stance: 'highStance' }, // Inner block
            { moveX: 0, moveY: 1, stance: 'highStance' }, // Low block
            { moveX: 0, moveY: 1, stance: 'highStance', multiMove: 2 }, // Front snap, middle punch
            { moveX: 0, moveY: 1, stance: 'highStance', multiMove: 2 }, // Front snap, middle punch
            { moveX: 0, moveY: 1, stance: 'highStance', multiMove: 2, kihup: true }, // Front snap, middle punch
        ]
    }, {
        name: 'Taegeuk Sam Jang*',
        belt: '#00ee00',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance', multiMove: 3 },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance', multiMove: 3 },
            { moveX: 0, moveY: -1, stance: 'highStance' },
            { moveX: 0, moveY: -1, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'sideStance' },
            { moveX: -0.2, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'sideStance' },
            { moveX: 0.2, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'highStance' },
            { moveX: 0, moveY: -1, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance', multiMove: 3 },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance', multiMove: 3 },
            { moveX: 0, moveY: 1, stance: 'highStance', multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'highStance', multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'highStance', multiMove: 3 },
            { moveX: 0, moveY: 1, stance: 'highStance', multiMove: 3, kihup: true },
        ]
    }, {
        name: 'Taegeuk Sa Jang*',
        belt: '#00ee00',
        beltStripe: '#4444ff',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'sideStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'sideStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance', multiMove: 2 },
            { moveX: 0, moveY: -2, stance: 'sideStance', multiMove: 3 },
            { moveX: 1, moveY: 0, stance: 'sideStance' },
            { moveX: 0.2, moveY: 0, stance: 'sideStance', multiMove: 2 },
            { moveX: -1, moveY: 0, stance: 'sideStance' },
            { moveX: -0.2, moveY: 0, stance: 'sideStance', multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance', multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'highStance', multiMove: 2 },
            { moveX: -1, moveY: 0, stance: 'highStance', multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'lowStance', multiMove: 3 },
            { moveX: 0, moveY: 1, stance: 'lowStance', multiMove: 3, kihup: true },
        ]
    }, {
        name: 'Taegeuk Oh Jang*',
        belt: '#4444ff',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -0.2, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 0.2, moveY: 0, stance: 'highStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance', multiMove: 2 },
            { moveX: 0, moveY: -1, stance: 'lowStance', multiMove: 3 },
            { moveX: 0, moveY: -1, stance: 'lowStance', multiMove: 3 },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'sideStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'sideStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance', multiMove: 2 },
            { moveX: 0, moveY: 1, stance: 'lowStance', multiMove: 3 },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance', multiMove: 3 },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance', multiMove: 3 },
            { moveX: 0, moveY: 1, stance: 'lowStance', multiMove: 2 },
            { moveX: 0, moveY: 1.5, stance: 'catStance', multiMove: 2, kihup: true },
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
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'sideStance', backwards: true },
            { moveX: 0, moveY: 1, stance: 'sideStance', backwards: true },
            { moveX: 0, moveY: 1, stance: 'sideStance', backwards: true },
            { moveX: -0.2, moveY: 0, stance: 'craneStance' },
            { moveX: -1, moveY: 0, stance: 'horseStance' },
            { moveX: -1, moveY: 0, stance: 'horseStance' },
            { moveX: 0, moveY: -1, stance: 'horseStance', kihup: true },
            { moveX: 0, moveY: -1, stance: 'horseStance' },
            { moveX: 0, moveY: 1, stance: 'neutralStance' },
            { moveX: 0, moveY: 1, stance: 'horseStance' },
            { moveX: 0.2, moveY: 0, stance: 'craneStance' },
            { moveX: 1, moveY: 0, stance: 'horseStance' },
            { moveX: 1, moveY: 0, stance: 'horseStance' },
            { moveX: 0.2, moveY: 0, stance: 'craneStance' },
            { moveX: 1, moveY: 0, stance: 'horseStance' },
            { moveX: 1, moveY: 0, stance: 'horseStance' },
            { moveX: 0, moveY: -1, stance: 'horseStance', kihup: true },
            { moveX: 0, moveY: -1, stance: 'horseStance' },
            { moveX: 0, moveY: 1, stance: 'neutralStance' },
            { moveX: 0, moveY: 1, stance: 'horseStance' },
            { moveX: -0.2, moveY: 0, stance: 'craneStance' },
            { moveX: -1, moveY: 0, stance: 'horseStance' },
            { moveX: -1, moveY: 0, stance: 'horseStance' },
        ]
    },
];

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
        nav.scrollBy({ left: event.detail * 16, behavior: 'smooth' });
    }
}
window.addEventListener('mousewheel', horizontalScroll, false);
window.addEventListener('DOMMouseScroll', horizontalScroll, false);
