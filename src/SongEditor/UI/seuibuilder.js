export function buildSongEditorUI(root) {
	const editorPage = document.createElement("div");
	editorPage.className = "song-editor-page";

	editorPage.innerHTML = `
        <header class="topbar">
            <div class="logo"></div>

            <div class="transport">
                <button id="playButton">Play</button>
                <button id="stopButton">Stop</button>
                <button id="clearButton">Clear Bar</button>

                <span class="transport-info">120 BPM</span>
                <span class="transport-info">4/4</span>
            </div>
        </header>

        <div class="workspace">
            <div class="workspace-main">
                <section id="chordControls">
                    <div class="section-title">Chords</div>
                    <div id="chordButtons"></div>
                </section>

                <section id="timeline"></section>
            </div>

            <aside id="chordProperities">
                <div class="section-title">Chord Properties</div>

                <div id="selectedChordTitle">No chord selected</div>

                <section id="selectedVoicing">
                    <div class="property-heading">Voicing</div>
                    <div id="voicingNotes"></div>
                </section>

                <section id="chordAlterations">
                    <div class="property-heading">Alterations</div>

                    <label class="property-row">
                        <input type="checkbox" id="flattenRootCheckbox" disabled>
                        <span>
                            <strong>b1</strong>
                            <span class="property-description">Flatten root</span>
                        </span>
                    </label>
                </section>
            </aside>
        </div>
	`;

    root.replaceChildren(editorPage);

    return editorPage;
}