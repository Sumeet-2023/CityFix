import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCrowdsourceFunding = async (req: Request, res: Response) => {
  const { type, amountRaised, amountRequired, goalDescription, clanId, projectId, currency } = req.body;

  try {
    const funding = await prisma.crowdsourceFunding.create({
      data: {
        type,
        amountRaised,
        amountRequired,
        goalDescription,
        clanId,
        projectId,
        currency: currency ?? null,
        dateCreated: new Date(),
        lastUpdated: new Date()
      },
    });

    res.status(201).json(funding);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create funding campaign' });
  }
};

export const getAllCrowdsourceFundings = async (req: Request, res: Response) => {
    try {
      const fundings = await prisma.crowdsourceFunding.findMany({
        include: {
          project: true,
          clan: true,
          transaction: true,
        },
      });
      res.status(200).json(fundings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch funding campaigns' });
    }
};


export const getCrowdsourceFunding = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const funding = await prisma.crowdsourceFunding.findUnique({
        where: { id },
        include: {
          project: true,
          clan: true,
          transaction: true,
        },
      });
  
      if (!funding) {
        res.status(404).json({ error: 'Funding campaign not found' });
      }
  
      res.status(200).json(funding);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch funding campaign' });
    }
};

export const getFundingByProject = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  
  try {
    const fundings = await prisma.crowdsourceFunding.findMany({
      where: { projectId: projectId },
      include: {
        project: true,
        clan: true,
        transaction: true,
      },
    });

    if (!fundings) {
      res.status(404).json({ error: 'Fundings not found for this project' });
    }

    res.status(200).json(fundings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch funding campaign' });
  }
}

export const updateCrowdsourceFunding = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amountRaised, amountRequired, goalDescription, clanId, projectId } = req.body;
  
    try {
      const funding = await prisma.crowdsourceFunding.update({
        where: { id },
        data: {
          amountRaised,
          amountRequired,
          goalDescription,
          clanId,
          projectId,
          lastUpdated: new Date(), // To keep track of the last update time
        },
      });
  
      res.status(200).json(funding);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update funding campaign' });
    }
};

export const deleteCrowdsourceFunding = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      await prisma.crowdsourceFunding.delete({
        where: { id },
      });
  
      res.status(200).json({ message: 'Funding campaign deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete funding campaign' });
    }
};

export const createTransaction = async (req: Request, res: Response) => {
    const { amount, fundId, userId, paymentMethod, externalTxId } = req.body;
  
    try {
      const transaction = await prisma.transcation.create({
        data: {
          amount,
          fundId,
          userId,
          paymentMethod,
          externalTxId,
        },
      });
  
      // Update the amountRaised for the related funding campaign
      await prisma.crowdsourceFunding.update({
        where: { id: fundId },
        data: {
          amountRaised: {
            increment: amount,
          },
        },
      });
  
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
};

export const getTransactionsByFund = async (req: Request, res: Response) => {
    const { fundId } = req.params;
  
    try {
      const transactions = await prisma.transcation.findMany({
        where: { fundId },
        include: {
          user: true,
        },
      });
  
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

export const getTransactionsByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    try {
      const transactions = await prisma.transcation.findMany({
        where: { userId },
        include: {
          fund: true, // Include funding campaign details
        },
      });
  
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transactions for user' });
    }
};

export const getTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const transaction = await prisma.transcation.findUnique({
        where: { id },
        include: {
          fund: true, // Include funding campaign details
          user: true, // Include user details
        },
      });
  
      if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' });
      }
  
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transaction' });
    }
};

export const updateTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { paymentMethod, externalTxId } = req.body;
  
    try {
      const transaction = await prisma.transcation.update({
        where: { id },
        data: {
          paymentMethod,
          externalTxId,
        },
      });
  
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update transaction' });
    }
};

export const deleteTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      await prisma.transcation.delete({
        where: { id },
      });
  
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
};
  