const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const { run } = require("./sendEmail");

cron.schedule("0 8 * * *", async () => {
  // Send emails to all people who got requests the previous day
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequest = await ConnectionRequest.find({
      status: 'interested',
      createdAt:  {
        $gte: yesterdayStart,
        $lt: yesterdayEnd
      }
    })
    .populate("fromUserId toUserId");    
    const listOfEmails = [...new Set(pendingRequest.map(req => req.toUserId.emailId))];
    console.log("====== listOfEmails =======", listOfEmails)
    for (const email of listOfEmails) {
      try {
        const subject = "New  Friend Requestspending for ";
        const body= "This is a dummy body"
        await run(subject, body);

      } catch(error) {
        console.log("Error: ",error)
        throw new Error("Error in send email address");
      }
    }
  } catch(error) {
    console.error(error)
  }
})