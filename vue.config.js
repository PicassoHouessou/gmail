// vue.config.js
module.exports = {
    configureWebpack: {
        optimization: {
            splitChunks: false
        }
        /*
        externals: {
            // only define the dependencies you are NOT using as externals!
            canvg: "canvg",
            html2canvas: "html2canvas",
            dompurify: "dompurify"
        } */

    }
}
