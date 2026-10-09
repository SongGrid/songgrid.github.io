import { getChord } from "./chords.js";
import { NOTE_NAMES } from "./key.js";

const VOICES = [
    { name: "bass", min: 36, max: 60, target: 48 },
    { name: "tenor", min: 48, max: 67, target: 55 },
    { name: "alto", min: 53, max: 72, target: 60 },
    { name: "soprano", min: 60, max: 79, target: 64 }
];

function getChordPitchClasses(chord, key) {
    return chord.pitchClasses;
}

function getNotesInRange(pitchClasses, min, max) {
    const notes = [];

    for (let midi = min; midi <= max; midi++) {
        if (pitchClasses.includes(midi % 12)) {
            notes.push(midi);
        }
    }

    return notes;
}

function generateCandidates(pitchClasses, root) {
    const ranges = VOICES.map(voice =>
        getNotesInRange(
            pitchClasses,
            voice.min,
            voice.max
        )
    );

    const candidates = [];

    for (const bass of ranges[0]) {
        if (bass % 12 !== root) continue;
        for (const tenor of ranges[1]) {
            if (tenor <= bass || tenor - bass > 19) continue

            for (const alto of ranges[2]) {
                if (alto <= tenor || alto - tenor > 12) continue;

                for (const soprano of ranges[3]) {
                    if (soprano <= alto || soprano - alto > 12) continue;

                    const candidate = [bass, tenor, alto, soprano];
                    const coveredTones = new Set(candidate.map(note => note % 12));

                    if (!pitchClasses.every(tone => coveredTones.has(tone))) {
                        continue;
                    }

                    candidates.push(candidate);
                }
            }
        }
    }

    return candidates;
}

function scoreVoicing(candidate, previous) {
    let cost = 0;

    for (let i = 0; i < candidate.length; i++) {
        const note = candidate[i];

        if (previous) {
            const movement = Math.abs(note - previous[i]);

            cost += movement;

            // discourage large voicing leaps
            if (movement > 7) {
                cost += (movement - 7) * 2;
            }

            // reward retatining common tone voicings
            if (movement === 0) {
                cost -= 2;
            }

            // bass stability
            if (i === 0) {
                cost += movement * 0.25
            }
        } else {
            // prefer the comfortable basic voicing
            cost += Math.abs(note - VOICES[i].target);
        }
    }

    return cost;
}

export function voiceChord(name, key, previous = null) {
    const chord = getChord(name, key);

    if (!chord) {
        return null;
    }

    const pitchClasses = getChordPitchClasses(chord, key);
    const candidates = generateCandidates(pitchClasses, chord.root);

    let best = null;
    let bestCost = Infinity;

    for (const candidate of candidates) {
        const cost = scoreVoicing(candidate, previous);

        if (cost < bestCost) {
            best = candidate;
            bestCost = cost;
        }
    }

    return best;
}

export function midiToNote(midi) {
    const name = NOTE_NAMES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;

    return `${name}${octave}`;
}

export function voiceProgression(timeline, key) {
    let previous = null;

    return timeline.map(chordName => {
        if (!chordName) {
            previous = null;
            return null;
        }

        const notes = voiceChord(chordName, key, previous);

        if (notes) {
            previous = notes;
        }

        return {
            chord: chordName,
            midi: notes,
            notes: notes?.map(midiToNote) ?? []
        };
    });
}