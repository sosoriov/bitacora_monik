export const MESSAGES = [
    {
        triggerType: "time",
        executeOn: "daily", //daily, 2d, 2d, 1w, 2w, 1m, etc. m: month, d: day, w:week
        runEvery: "1h", // run each hour
        text: "this is the text 1", // text to display
        typeMessage: "warning" // warning, success or info
    },
    {
        triggerType: "time",
        executeOn: "daily", //daily, 2d, 2d, 1w, 2w, 1m, etc. m: month, d: day, w:week
        runEvery: "1h", // run each hour
        text: "this is an extra message", // text to display
        typeMessage: "warning" // warning, success or info
    }
]