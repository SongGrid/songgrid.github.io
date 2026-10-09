import { mountSongEditor } from "./SongEditor/songeditor.js";

const appRoot = document.querySelector("#app");

let unmountCurrentPage = null;

const routes = new Map([
    [
        "/editor",
        {
            id: "editor",
            mount: mountSongEditor
        }
    ]
]);

function normalizePath(pathname) {
    if (pathname === "/") {
        return "/";
    }

    return pathname.replace(/\/+$/, "");
}

function renderCurrentRoute() {
    if (unmountCurrentPage) {
        unmountCurrentPage();
        unmountCurrentPage = null;
    }

    const path = normalizePath(window.location.pathname);

    // temp behavior for demo
    if (path === "/") {
        navigateTo("/editor", true);
        return;
    }

    const route = routes.get(path);

    if (!route) {
        appRoot.replaceChildren();

        const message = document.createElement("h1");
        message.textContent = "Page not found.";

        appRoot.appendChild(message);
        return;
    }

    unmountCurrentPage = route.mount(appRoot) ?? null;
}

export function navigateTo(path, replace = false) {
    const normalizedPath = normalizePath(path);

    const state = {
        page: routes.get(normalizedPath)?.id ?? null
    };

    if (replace) {
        history.replaceState(
            state,
            "",
            normalizedPath
        );
    } else {
        history.pushState(
            state,
            "",
            normalizedPath
        );
    }

    renderCurrentRoute();
}

window.addEventListener("popstate", () => {
    renderCurrentRoute();
});

renderCurrentRoute();