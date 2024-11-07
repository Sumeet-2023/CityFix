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

/* SERVER */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on part ${port}`);
});