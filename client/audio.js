let sounds = {};
sounds.draw = new Audio("assets/audio/draw.mp3");
sounds.boop = new Audio("assets/audio/boop.mp3");
sounds.boop.volume= 0.1;

export let play = sound => {
    if (sounds[sound]) {
        sounds[sound].currentTime = 0;
        sounds[sound].play();
    }
};

export let stop = sound => {
    if (sounds[sound]) {
        sounds[sound].pause();
    }
};
