let Tone = null;
import { voiceProgression, midiToNote } from "../harmony/voicing.js";

let piano = null;
let pianoLoaded = null;

function getPiano() {
    if (!piano) {
        piano = new Tone.Sampler({
            urls: {
                C2: "C2.mp3",
                "D#2": "Ds2.mp3",
                "F#2": "Fs2.mp3",
                A2: "A2.mp3",

                C3: "C3.mp3",
                "D#3": "Ds3.mp3",
                "F#3": "Fs3.mp3",
                A3: "A3.mp3",

                C4: "C4.mp3",
                "D#4": "Ds4.mp3",
                "F#4": "Fs4.mp3",
                A4: "A4.mp3",

                C5: "C5.mp3",
                "D#5": "Ds5.mp3",
                "F#5": "Fs5.mp3",
                A5: "A5.mp3",

                C6: "C6.mp3"
            },
            baseUrl: "https://tonejs.github.io/audio/salamander/",
            release: 1
        }).toDestination();

        pianoLoaded = Tone.loaded();
    }

    return pianoLoaded.then(() => piano);
}

export async function playProgression(timeline, key, bpm = 120) {
    if (!Tone) {
        Tone = await import("https://esm.sh/tone@15.1.22");
    }

    await Tone.start();
    await Tone.getContext().resume();

    const instrument = await getPiano();
    const progression = voiceProgression(timeline, key);
    const transport = Tone.getTransport();

    transport.stop();
    transport.cancel();
    transport.position = 0;
    transport.bpm.value = bpm;
    transport.timeSignature = 4;

    progression.forEach((voicing, index) => {
        if (!voicing?.midi) return

        const notes = voicing.midi.map(midiToNote);

        transport.schedule(time => {
            instrument.triggerAttackRelease(notes, "1m", time);
        }, `${index}m`);
    });

    transport.start("+0.05");
}

export function stopPlayback() {
    if (!Tone) return;
    const transport = Tone.getTransport();

    transport.stop();
    transport.cancel();
    transport.position = 0;

    if (piano) {
        piano.releaseAll();
    }
}