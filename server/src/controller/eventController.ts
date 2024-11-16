import { Request, Response } from "express";
import { CommunityRoles, PrismaClient, ProjectStatus, Event, EventStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const updateStatus = async (event: Event): Promise<void> => {
    const now = new Date();
    const start = event.startDateTime;
    const end = event.endDateTime;

    // Check if an update is needed
    let newStatus: EventStatus | null = null;
    if (now >= start && now <= end && event.status !== EventStatus.ONGOING) {
        newStatus = EventStatus.ONGOING;
    } else if (now > end && event.status !== EventStatus.COMPLETED) {
        newStatus = EventStatus.COMPLETED;
    }

    if (newStatus) {
        try {
            await prisma.event.update({
                where: { id: event.id },
                data: { status: newStatus },
            });
        } catch (error) {
            console.error(`Error updating event ${event.id}: ${error}`);
        }
    }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
    const {id} = req.params;
    try {
        const event = await prisma.event.findUnique({
            where: {
                id: id
            }
        });
        if (event) {
            await updateStatus(event);
        }
        res.status(200).json(event);
    } catch (error: any) {
        res.status(500).json({message: `Error fetching event by this id: ${error}`});
    }
}

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    const { eventId } = req.params;
    const updates = req.body;

    try {
        const existingEvent = await prisma.event.findUnique({
            where: {
                id: eventId,
            },
        });

        if (!existingEvent) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }

        const updatedEvent = await prisma.event.update({
            where: {
                id: eventId,
            },
            data: {
                ...updates,
            },
        });

        res.status(201).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
    const {projectId} = req.params;
    const {
        userId,
        eventName,
        description,
        startDateTime,
        endDateTime,
        location
    } = req.body;

    try{
        const event = await prisma.event.create({
            data: {
                projectId: projectId,
                eventName: eventName,
                description: description,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                creatorId: userId,
                location: location
            }
        });
        await prisma.userEvent.create({
            data: {
                eventId: event.id,
                userId: userId
            }
        })
        res.status(201).json({message: 'Successfully created an event!'});
    } catch (error: any) {
        res
        .status(500)
        .json({ message: `Error creating an project: ${error.message}` });
    }
}

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    const {eventId} = req.params;
    try  {
        await prisma.event.delete({
            where: {
                id: eventId
            }
        })
        res.status(201).json({message: `Event deleted with id: ${eventId}`});
    } catch (error: any) {
        res.status(500).json({message: `Error deleting event: ${error}`});
    }
}

export const getProjectEvents = async (req: Request, res: Response): Promise<void> => {
    const {projectId} = req.params;
  
    try {
        const events = await prisma.event.findMany({
            where: {
            projectId: projectId,
            },
            include: {
                clan: true,
                project: true,
                creator: true,
            }
        });
        res.status(200).json(events);
        if (events.length) {
            await Promise.all(events.map((event) => updateStatus(event)));
        }
    } catch (error: any) {
      res.status(500).json({message: `Error fetching project events: ${error}`});
    }
}