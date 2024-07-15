const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
function swaggerConfig(app) {
    const swaggerDocument = swaggerJsDoc({
        swaggerDefinition: {
            openapi: "3.0.1",
            info: {
                title: "Sadra Presentation Backend",
                description: "this is sadra presentation backend made with ❤️ by amirreza abdolrahimi using ExpressJS",
                version:"1.0.0"
            },
        },
        apis: [process.cwd() + "/src/modules/**/*.swagger.js"]
    })
    const swagger = swaggerUi.setup(swaggerDocument, {})
    app.use("/", swaggerUi.serve, swagger)
}
module.exports = swaggerConfig