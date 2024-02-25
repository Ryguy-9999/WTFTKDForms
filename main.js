function canvas_arrow(context, fromx, fromy, tox, toy) {
    context.beginPath();
    var headlen = 10; // length of head in pixels
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
        ctx.strokeStyle = (stanceColorData.hasOwnProperty(movement.stance) ? stanceColorData[movement.stance] : stanceColorData.default).replace('$alpha', index === currentStep ? '1' : '0.1');
        let newPoint = { x: currentPoint.x + movement.moveX * stepDistance, y: currentPoint.y + movement.moveY * stepDistance };

        canvas_arrow(ctx, currentPoint.x, currentPoint.y, newPoint.x, newPoint.y);

        currentPoint = newPoint;
    });
}

const canvas = document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
ctx.lineWidth = 3;

const stanceColorData = {
    lowStance: 'rgba(255,0,0,$alpha)',
    walkingStance: 'rgba(0,255,0,$alpha)',
    sideStance: 'rgba(0,0,255,$alpha)',
    default: 'rgba(0,0,0,$alpha)'
}
const formData = [
    {
        name: 'Ki-Bon Il Jang',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
        ]
    }, {
        name: 'Ki-Bon Ee Jang',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
        ]
    }, {
        name: 'Taegeuk Il Jang',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
        ]
    }, {
        name: 'Koryo',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: -1, moveY: 0, stance: 'walkingStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: 1, moveY: 0, stance: 'walkingStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
        ]
    },
];

let currentStep = 0;
let selectedForm = formData[0];
draw_form(selectedForm);

window.onresize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineWidth = 3;
    draw_form(selectedForm);
};

formData.forEach(form => {
    let div = document.createElement('div');
    div.innerHTML = form.name;
    div.className = 'nav-button';
    div.onclick = () => {
        currentStep = 0;
        selectedForm = form;
        draw_form(selectedForm);
    };
    document.getElementById('forms-nav').appendChild(div);
});

// TODO
document.getElementById('forwardStepBtn').onclick = () => {
    currentStep = (currentStep + 1) % selectedForm.pattern.length;
    draw_form(selectedForm);
}
document.getElementById('backStepBtn').onclick = () => {
    currentStep = (currentStep - 1 + selectedForm.pattern.length) % selectedForm.pattern.length;
    draw_form(selectedForm);
}
