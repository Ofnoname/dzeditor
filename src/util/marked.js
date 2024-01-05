import {Marked} from "marked";
import "highlight.js/styles/default.css"
import "katex/dist/katex.min.css"
// import hljs from "highlight.js";
// import {markedHighlight} from "marked-highlight";
// import markedKatex from "marked-katex-extension";
import {onMounted, ref} from "vue";

async function highlight(marked) {
    const markedHighlight = (await import('marked-highlight')).markedHighlight;
    const hljs = (await import('highlight.js')).default;
    marked.use(markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, {language}).value;
        }
    }))
}

async function katex(marked) {
    const markedKatex = (await import('marked-katex-extension')).default;
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
}

export function useMarked() {
    const marked = new Marked();
    marked.loading = ref(true);
    /* 消除控制台 warning */
    marked.setOptions({
        headerIds: false,
        mangle: false,
    })

    onMounted(async () => {
        await highlight(marked)
        await katex(marked);
        marked.loading.value = false;
    })
    return marked;
}