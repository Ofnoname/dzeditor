import { defineStore } from 'pinia'

class textFile {
    constructor(sign) {
        this.sign = sign
        this.title = '未命名'
        this.content = ''
    }
}

export const useFileStore = defineStore('file',{
    state: () => ({
        currentFile: null,
        increment: 1000,
        fileList: [],
    }),
    actions: {
        newFile() {
            const newFile = new textFile(this.increment++)
            this.fileList.push(newFile)
            this.currentFile = newFile
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
        }
    },
})
