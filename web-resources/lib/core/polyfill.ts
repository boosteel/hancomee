// ie9를 위한 폴리필
if (!document.elementsFromPoint) {
    document.elementsFromPoint = function (x, y) {
        let i = 0, parents = [], parent;
        do {
            if (parent !== document.elementFromPoint(x, y)) {
                parent = document.elementFromPoint(x, y);
                parents[i++] = parent;
                parent.style.pointerEvents = 'none';
            } else {
                parent = false;
            }
        } while (parent);
        while (i-- > 0) parents[i].style.pointerEvents = 'all';
        return parents;
    };
}

