import {useGs} from "../store.js";

var module

async function toPNG(dom) {
    const {domToImage} = module
    dom.style.overflow = 'visible';
    const url = await domToImage.toPng(dom, {
        bgcolor: 'white',
    })
    dom.style.overflow = 'auto';
    return url;
}
async function toPDF(dom) {
    const {jsPDF} = module
    const url = await toPNG(dom);

    const dpi = 96; // 假设屏幕的DPI为96，这个值可能需要根据你的实际情况进行调整
    const widthInMm = (dom.scrollWidth / dpi) * 25.4;
    const heightInMm = (dom.scrollHeight / dpi) * 25.4;

    const pdf = new jsPDF('p', 'mm', [widthInMm, heightInMm]); // 设置PDF的尺寸
    pdf.addImage(url, 'JPEG', 0, 0, widthInMm, heightInMm); // 将图片添加到PDF中

    return pdf.output('bloburl');
}

async function toHTML(dom) {
    const gs = useGs()

    const html = dom.outerHTML + `<style>${gs.previewCss.css}</style>`;
    const blob = new Blob([html], {type: 'text/html'});
    return URL.createObjectURL(blob);
}

async function toRawHTML(dom) {
    const html = dom.outerHTML
    const blob = new Blob([html], {type: 'text/html'});
    return URL.createObjectURL(blob);
}

async function toMarkdown() {
    const gs = useGs()

    const txt = gs.currentFile.content
    const blob = new Blob([txt], {type: 'text/plain'});
    return URL.createObjectURL(blob);
}

export const useDownload = async (dom) => {
    module = {
        jsPDF: (await import("jspdf")).jsPDF,
        domToImage: (await import("dom-to-image")).default,
    }

    return {
        PNG: () => toPNG(dom),
        PDF: () => toPDF(dom),
        HTML: () => toHTML(dom),
        RawHTML: () => toRawHTML(dom),
        Markdown: () => toMarkdown(),
    }
}