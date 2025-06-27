
function loadPage(game) {
    if (game) {
        window.location.href = `${game}.html`;
    } else {
        console.error("No game specified");
    }
}

