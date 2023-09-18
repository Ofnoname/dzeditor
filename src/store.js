import {defineStore} from 'pinia'

// 持久化 pinia
export function saveState(key, state) {
    localStorage.setItem(key, JSON.stringify(state));
}

export function loadState(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (err) {
        return undefined; // 当不存在状态或者状态不合法时，返回`undefined`
    }
}

class TextFile {
    constructor(sign, content) {
        this.sign = sign
        this.title = '未命名'
        this.content = content ?? ''
    }
}

export const useGs = defineStore('globalStore', {
    state: () => ({
        currentFile: null,
        fileAutoInc: 1000,
        fileList: [],

        previewMode: 1, // 0: 编辑，1: 分屏，2: 预览
        previewCss: {
            css: '',
            preset: ['rightblue'],
            presetChoice: 'rightblue',
        },
        editorSetting: {

            overviewRulerBorder: false, // 不要滚动条的边框
            scrollbar: { // 滚动条设置
                verticalScrollbarSize: 4, // 竖滚动条
                horizontalScrollbarSize: 6, // 横滚动条
            },
            autoIndent: true, // 自动布局
            smoothScrolling: true, // 平滑滚动
            cursorSmoothCaretAnimation: true, // 是否启用光标平滑插入动画  当你在快速输入文字的时候 光标是直接平滑的移动还是直接"闪现"到当前文字所处位置

            automaticLayout: true, // 自动布局
            wordWrap: "bounded", // 自动换行
            theme: 'vs', // 官方自带三种主题vs, hc-black, or vs-dark
            foldingStrategy: 'indentation', // 代码可分小段折叠
            lineNumbers: 'on', // 控制行号的出现on | off
            cursorStyle: 'line', // 光标样式
            cursorBlinking: 'Solid', // 光标动画样式
            renderLineHighlight: 'all', // 当前行突出显示方式  "all" | "line" | "none" | "gutter"
            autoClosingBrackets: 'always', // 是否自动添加结束括号(包括中括号) "always" | "languageDefined" | "beforeWhitespace" | "never"
            autoClosingDelete: 'always', // 是否自动删除结束括号(包括中括号) "always" | "never" | "auto"
            autoClosingQuotes: 'always', // 是否自动添加结束的单引号 双引号 "always" | "languageDefined" | "beforeWhitespace" | "never"

            minimap: { // 关闭小地图
                enabled: false,
            },
            wordWrapColumn: 160,
            fontSize: 16, // 字体大小
            fontFamily: "Consolas, 'Courier New', Monaco, 'Lucida Console', Menlo, 'Liberation Mono', sans-serif",
            lineHeight: 32, // 行高
            tabSize: 2, // tab缩进长度
        },
        markedSetting: {
            gfm: true, // 是否支持github的markdown语法
            headerIds: false, // 是否支持github的header id
            mangle: false,
        },

        /* 在编辑器粘贴图片的设置
            * off: 关闭
            * asMarkdown: 转换为markdown格式
            * asHTML: 转换为<img>标签
        * */
        pasteImage: "asMarkdown",

        /*
        * 打印宽度
        * */
        printWidth: 1000,

        ...loadState('globalStore'),
    }),
    actions: {
        newFile(content) {
            const newFile = new TextFile(this.fileAutoInc++, content)
            this.fileList.push(newFile)
            this.currentFile = newFile
        },
        openFile() {
            // 打开文件选择框
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = "text/plain, .md";

            input.onchange = e => {
                const file = e.target.files[0]
                // 读取文件内容
                const reader = new FileReader()
                reader.readAsText(file)
                reader.onload = e => {
                    this.newFile(e.target.result)
                }
            }
            input.click()
            input.remove()
        },
        switchFile(index) {
            this.currentFile = this.fileList[index]
        },
        removeFile(index) {
            if (this.fileList[index] === this.currentFile) {
                this.currentFile = this.fileList[index - 1] || this.fileList[index + 1]
            }
            this.fileList.splice(index, 1)
        },
        removeCurrentFile() {
            const index = this.fileList.indexOf(this.currentFile)
            this.removeFile(index)
        }
    }
})