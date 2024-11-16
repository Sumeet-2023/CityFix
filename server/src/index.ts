import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/* ROUTE IMPORTS */

import issueRoutes from "./routes/issueRoutes";
import projectRoutes from "./routes/projectRoutes";
import ngoRouters from "./routes/ngoRoutes";
import clanRoutes from "./routes/clanRoutes";
import userRoutes from "./routes/userRoutes";
import exploreRoutes from "./routes/exploreRoutes";
import communityRoutes from "./routes/communityRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import eventRoutes from "./routes/eventRoutes";
import fundingRoutes from "./routes/crowdFundingRoutes";
import { dashboardRoutes } from "./routes/dashboardRoutes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/issues", issueRoutes);
app.use("/project", projectRoutes);
app.use("/ngo", ngoRouters);
app.use("/clan", clanRoutes);
app.use("/user", userRoutes);
app.use("/explore", exploreRoutes);
app.use("/community", communityRoutes);
app.use("/notification", notificationRoutes);
app.use("/event", eventRoutes);
app.use("/funding", fundingRoutes);
app.use("/dashboard", dashboardRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 3000;

if (!port) {
  console.error("ERROR: No PORT environment variable set.");
  process.exit(1);
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});