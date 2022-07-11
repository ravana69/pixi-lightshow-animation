const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});
document.body.appendChild(app.view);

const scene = new PIXI.Container();
app.stage.addChild(scene);


let jsonData = [];
let end_of_JSON_array = false;
let frame = 0;
let amount = 600;
let row = 60;
let column = 10;
let el_width;
let el_height;


PIXI.Loader.shared
    .add({
        name: 'json_screenshot',
        url: 'https://raw.githubusercontent.com/isladjan/jsonFiles/main/preview2_2_sv6t3j.json',
        onComplete: jsonLoad    
    })
    .add({
        name: 'json_part1',
        url: 'https://raw.githubusercontent.com/isladjan/jsonFiles/main/part1_f5r3gp.json',
        onComplete: jsonLoad    
    })
    .add({
        name: 'json_part2',
        url: 'https://raw.githubusercontent.com/isladjan/jsonFiles/main/part2_oeowsq.json',
    })
    .load(() => { });   


function jsonLoad(e) {
    jsonData = PIXI.Loader.shared.resources[e.name].data;
    end_of_JSON_array = false;
    if (e.name === 'json_screenshot') painting();
    else {
        window.setTimeout(() => {
            let interval = window.setInterval(() => {
                painting();
                if (end_of_JSON_array) {
                    clearInterval(interval);
                    json2(); 
                }
            }, 100);
        }, 200)
    }
}


function json2() {
    let json = PIXI.Loader.shared.resources.json_part2.data;
    if (json) {
        jsonData = json;
        painting();
        window.setInterval(() => { painting() }, 100);
    }
    else setTimeout(() => { json2() }, 100)
}



function setupElements() {
    let spaceX = (app.screen.width - app.screen.width / row) / row;
    let spaceY = (app.screen.height - app.screen.height / column) / column;

    let element_width = Math.round(app.screen.width / 70);
    let element_height = Math.round(app.screen.width / 70);

    let temp = 0;
    let x = 0;
    let y = spaceY;

    for (let i = 1; i < amount + 1; i++) {
        if (temp === row) {
            temp = 0;
            x = 0;
            y += spaceY;
        }
        x += spaceX; 
        temp++;

        if (scene.children.length === 600) {
            scene.children[i - 1].x = Math.round(x);
            scene.children[i - 1].y = Math.round(y);
        } else {
            let rect = new PIXI.Graphics();
            rect.beginFill(0xFFFFFF);    
            rect.tint = 0x000000;  
            rect.drawRoundedRect(0, 0, element_width, element_width, 5);
            rect.endFill();
            rect.pivot.set(element_width / 2, element_height / 2)
            rect.x = Math.round(x);
            rect.y = Math.round(y);
            //rect.cacheAsBitmap = true;
            scene.addChild(rect);

            rect.interactive = true;
            rect.buttonMode = true;
            rect.on('mouseover', hoverFx);
        }

        if (app.screen.height < 250) scene.children[i - 1].height = element_height / 2;
        else if (app.screen.height > 250 && app.screen.height < 500) scene.children[i - 1].height = element_height;
        else scene.children[i - 1].height = element_height * 1.5;

        if (app.screen.width < 1000) scene.children[i - 1].width = element_width / 1.7;
        else scene.children[i - 1].width = element_width;
    }
}
setupElements();



function hoverFx() {
    gsap.fromTo(this, { width: el_width, height: el_height }, { width: el_width + 5, height: el_height + 10, duration: 0.3, repeat: 1, yoyo: true })
}


function painting() {
    if (frame === jsonData.length) {
        frame = 0;
        end_of_JSON_array = true;
    }

    for (var i = 0; i < scene.children.length; i++) {
        let element = scene.children[i];
        let color = jsonData[frame][i];

        if (color === "b") element.tint = 0x000000;
        else element.tint = "0x" + color;
    }
    frame++
}


window.addEventListener('resize', resizeFx);
function resizeFx() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    setupElements()

    el_width = scene.children[0].width;
    el_height = scene.children[0].height;
}
resizeFx();