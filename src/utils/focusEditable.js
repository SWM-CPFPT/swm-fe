export const getPointerContentEditable = (el) => {
    let caretAt = 0;
    const sel = window.getSelection();

    if (sel.rangeCount === 0) {
        return caretAt;
    }

    const range = sel.getRangeAt(0);
    const preRange = range.cloneRange();
    preRange.selectNodeContents(el);
    preRange.setEnd(range.endContainer, range.endOffset);
    caretAt = preRange.toString().length;

    return caretAt;
};

export const setEndOfContentEditable = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
};
