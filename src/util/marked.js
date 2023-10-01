import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/default.css"
import markedKatex from "marked-katex-extension";

export function useMarked() {
    const marked = new Marked();
    marked.use(markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    }))

    marked.use(markedKatex({
        throwOnError: false,
        errorColor: '#cc0000',
        delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$", right: "$", display: false},
            {left: "\\[", right: "\\]", display: true},
            {left: "\\(", right: "\\)", display: false},
        ],
    }))

    /* 消除控制台 warning */
    marked.setOptions({
        headerIds: false,
        mangle: false,
    })

    return marked;
}