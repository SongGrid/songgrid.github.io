const BAR_COUNT = 8;

const state = {
    bars: Array(BAR_COUNT).fill(null),
    selectedBar: 0
};

const listeners = new Set();

export function onTimelineChange(callback) {
    listeners.add(callback);

    return () => listeners.delete(callback);
}
function notifyTimelineChange() {
    for (const callback of listeners) {
        callback(getTimeline());
    }
}
export function createTimeline(container) {
    container.innerHTML = "";

    const timeline = document.createElement("div");
    timeline.className = "timeline";

    for (let i = 0; i < BAR_COUNT; i++) {
        const bar = document.createElement("div");

        bar.className = "timeline-bar";
        bar.dataset.bar = i;

        bar.addEventListener("click", () => {
            selectBar(i);
        });

        timeline.appendChild(bar);
    }

    container.appendChild(timeline);

    renderTimeline();
}
export function setBarChord(barIndex, chord) {
    if (barIndex < 0 || barIndex >= BAR_COUNT) {
        return;
    }

    state.bars[barIndex] = chord;
    renderTimeline();
    notifyTimelineChange();

    if (barIndex < BAR_COUNT - 1) {
        selectBar(barIndex + 1);
    }
}
export function clearBar(barIndex) {
    if (barIndex < 0 || barIndex >= BAR_COUNT) {
        return;
    }

    state.bars[barIndex] = null;

    renderTimeline();
    notifyTimelineChange();
}
export function getTimeline() {
    return [...state.bars];
}
export function getSelectedBar() {
    return state.selectedBar;
}
function selectBar(index) {
    state.selectedBar = index;
    renderTimeline();
    notifyTimelineChange();
}
function renderTimeline() {
    const bars = document.querySelectorAll(".timeline-bar");

    bars.forEach((bar, index) => {
        const chord = state.bars[index];

        bar.classList.toggle(
            "selected",
            index === state.selectedBar
        );

        bar.textContent = chord ?? "";
    });
}