import { defineStore } from 'pinia'

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

class textFile {
    constructor(sign, content) {
        this.sign = sign
        this.title = '未命名'
        this.content = content ?? ''
    }
}

export const useFileStore = defineStore('file',{
    state: () => ({
        currentFile: null,
        increment: 1000,
        fileList: [],
        ...loadState('file'),
    }),
    actions: {
        newFile(content) {
            const newFile = new textFile(this.increment++, content)
            this.fileList.push(newFile)
            this.currentFile = newFile
        },
        openFile() {
            // 打开文件选择框
            const input = document.createElement('input')
            input.type = 'file'

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

            if (this.fileList.length === 0) {
                this.newFile()
            }
        },
        removeCurrentFile() {
            const index = this.fileList.indexOf(this.currentFile)
            this.removeFile(index)
        }
    },
})

export const useSettingStore = defineStore('setting', {
    state: () => ({
        previewSetting: 1, // 0: 编辑，1: 分屏，2: 预览
        previewCssCode: '',
        presetCssName: ['rightblue'],
        presetCssCode: [],

        editorTheme: 'vs-dark',
        ...loadState('setting'),
    })
})