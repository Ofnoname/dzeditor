import { defineStore } from 'pinia'

function emptyFile(id) {
    return {
        id: id,
        title: '未命名',
        content: '',
    }
}
export const useFileStore = defineStore({
    id: 'file',
    state: () => ({
        currentFile: null,
        increment: 0,
        fileList: [],
    }),
    actions: {
        newFile() {
            const newFile = emptyFile(++this.increment)
            this.fileList.push(newFile)
            this.currentFile = newFile
        },
        removeFile(id) {
            const index = this.fileList.findIndex(file => file.id === id)
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
