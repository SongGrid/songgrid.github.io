import { buildSongEditorUI } from "./UI/seuibuilder.js";
import {
    createTimeline,
    setBarChord,
    getSelectedBar,
    clearBar,
    getTimeline,
    onTimelineChange
} from "../timeline/timeline.js";
import { CURRENT_KEY } from "../harmony/key.js";
import { voiceProgression } from "../harmony/voicing.js";
import {
    playProgression,
    stopPlayback
} from "../audio/playback.js"

const chordButtons = [
    "C",
    "Dm",
    "Em",
    "F",
    "G",
    "Am",
    "Bdim"
]

export function mountSongEditor(root) {
    buildSongEditorUI(root);

    createTimeline(root.querySelector("#timeline"));

    const chordContainer = root.querySelector("#chordButtons");

    chordButtons.forEach(chord => {
        const button = document.createElement("button");

        button.textContent = chord;

        button.addEventListener("click", () => {
            //temp fixed chord at bar 0
            setBarChord(getSelectedBar(), chord);
        });

        chordContainer.appendChild(button);
    });

    const voicingNotes = root.querySelector("#voicingNotes");
    const selectedChordTitle = root.querySelector("#selectedChordTitle");

    function updateVoicings(timeline) {
        const selectedBar = getSelectedBar();
        const chord = timeline[selectedBar];
        const progression = voiceProgression(timeline, CURRENT_KEY);
        const voicing = progression[selectedBar];

        selectedChordTitle.textContent = chord
            ? `Bar ${selectedBar + 1} - ${chord}`
            : `Bar ${selectedBar + 1} - Empty`;

        voicingNotes.innerHTML = "";

        if (!chord || !voicing) {
            const emptyMessage = document.createElement("span");
            emptyMessage.textContent = "Choose a chord to see it's voicing.";
            voicingNotes.appendChild(emptyMessage);
            return;
        }

        const card = document.createElement("div");
        card.className = "voicing-card";

        const notes = document.createElement("span");
        notes.textContent = voicing.notes.join(" . ");

        card.appendChild(notes);
        voicingNotes.appendChild(card);
    }

    root.querySelector("#clearButton").addEventListener("click", () => {
        clearBar(getSelectedBar());
    });

    const unsubscribeTimeline = onTimelineChange(updateVoicings);
    updateVoicings(getTimeline());

    root.querySelector("#playButton").addEventListener("click", async () => {
        try {
            await playProgression(getTimeline(), CURRENT_KEY, 120);
        } catch (error) {
            console.error("Playback failed:", error);
        }
    });

    root.querySelector("#stopButton").addEventListener("click", () => {
        stopPlayback();
    });

    return () => {
        unsubscribeTimeline();
        stopPlayback();
        root.replaceChildren();
    };
}