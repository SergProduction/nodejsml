
export const oneLineLog = (text: string) => {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    process.stdout.write(text.toString())
}
