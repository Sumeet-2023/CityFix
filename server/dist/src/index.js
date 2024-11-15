"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/* ROUTE IMPORTS */
const issueRoutes_1 = __importDefault(require("./routes/issueRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const ngoRoutes_1 = __importDefault(require("./routes/ngoRoutes"));
const clanRoutes_1 = __importDefault(require("./routes/clanRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const exploreRoutes_1 = __importDefault(require("./routes/exploreRoutes"));
const communityRoutes_1 = __importDefault(require("./routes/communityRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const dashboardRoutes_1 = require("./routes/dashboardRoutes");
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
/* ROUTES */
app.get("/", (req, res) => {
    res.send("This is home route");
});
app.use("/issues", issueRoutes_1.default);
app.use("/project", projectRoutes_1.default);
app.use("/ngo", ngoRoutes_1.default);
app.use("/clan", clanRoutes_1.default);
app.use("/user", userRoutes_1.default);
app.use("/explore", exploreRoutes_1.default);
app.use("/community", communityRoutes_1.default);
app.use("/notification", notificationRoutes_1.default);
app.use("/dashboard", dashboardRoutes_1.dashboardRoutes);
/* SERVER */
const port = Number(process.env.PORT) || 3000;
if (!port) {
    console.error("ERROR: No PORT environment variable set.");
    process.exit(1);
}
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
