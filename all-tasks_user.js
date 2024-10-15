const userWithTasks = await prisma.user.findUnique({
       where: { id: userId },
       include: { tasks: true }, // This includes all tasks associated with the user
     });
     