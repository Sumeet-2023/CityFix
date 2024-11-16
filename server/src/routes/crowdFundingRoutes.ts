import express from "express";
import {
  createCrowdsourceFunding,
  getAllCrowdsourceFundings,
  getCrowdsourceFunding,
  updateCrowdsourceFunding,
  deleteCrowdsourceFunding,
  createTransaction,
  getTransactionsByFund,
  getTransactionsByUser,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getFundingByProject,
} from "../controller/crowdFundingController"; // Adjust import path based on your project structure

const router = express.Router();

// Routes for CrowdsourceFunding
router.post("/", createCrowdsourceFunding);
router.get("/", getAllCrowdsourceFundings);
router.get('/project/:projectId', getFundingByProject);
router.get("/:id", getCrowdsourceFunding); 
router.put("/:id", updateCrowdsourceFunding);
router.delete("/:id", deleteCrowdsourceFunding);

// Routes for Transactions
router.post("/transaction", createTransaction);
router.get("/transactions/fund/:fundId", getTransactionsByFund);
router.get("/transactions/user/:userId", getTransactionsByUser);
router.get("/transaction/:id", getTransaction);
router.put("/transaction/:id", updateTransaction);
router.delete("/transaction/:id", deleteTransaction);

export default router;