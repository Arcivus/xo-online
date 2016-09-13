const sounds = {};
sounds.draw = new Audio("assets/audio/draw.mp3");
sounds.draw.volume = 0.5;
sounds.boop = new Audio("assets/audio/boop.mp3");
sounds.boop.volume = 0.1;

export const play = sound => {
    if (sounds[sound]) {
        sounds[sound].currentTime = 0;
        sounds[sound].play();
    }
};

export const stop = sound => {
    if (sounds[sound]) {
        sounds[sound].pause();
    }
};
