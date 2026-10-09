import { SCALES } from "./scales.js";
import { CHORD_TYPES } from "./chordTypes.js";
import { NOTE_NAMES } from "./key.js";

export function getDiatonicChords(key) {
    const scale = SCALES[key.scaleName];

    if (!scale) {
        throw new Error(`Unknown scale: ${key.scaleName}`);
    }

    return scale.map((rootInterval, degree) => {
        //stack every other chord degree to form a triad (temp since this disregards completely legal chords in certain scales ie in Harmonic Minor it would not allow both the VI and vi even though they are both completely legal in the scale.)
        const degrees = [
            degree,
            (degree + 2) % scale.length,
            (degree + 4) % scale.length
        ];

        const pitchClasses = degrees.map(scaleDegree => {
            const octave = Math.floor(scaleDegree / scale.length);
            const index = scaleDegree % scale.length;

            return (key.tonic + scale[index] + octave * 12) % 12;
        });

        const root = pitchClasses[0];

        const intervals = pitchClasses
            .map(pitch => (pitch - root + 12) % 12)
            .sort((a, b) => a - b);

        const chordType = CHORD_TYPES.find(type =>
            type.intervals.length === intervals.length &&
            type.intervals.every((interval, i) => interval === intervals[i])
        );

        const rootName = NOTE_NAMES[root];
        const suffix = chordType?.suffix ?? "?";

        return {
            id: `${degree + 1}`,
            degree,
            name: `${rootName}${suffix}`,
            root,
            degrees,
            pitchClasses,
            intervals,
            quality: chordType?.name ?? "unknown"
        };
    });
}

export function getChord(name, key) {
    return getDiatonicChords(key).find(chord => chord.name === name) ?? null;
} 