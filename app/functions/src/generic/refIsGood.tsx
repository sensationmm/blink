module.exports = (ref: string) => {
    return ref.startsWith("http://localhost:") ||
        ref.startsWith("https://localhost:") ||
        ref.startsWith("https://blink-staging-20006.firebaseapp.com/") ||
        ref.startsWith("https://www.blink-bank.com/") ||
        ref.startsWith("https://blink-bank.com/")
}