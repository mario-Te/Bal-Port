const Notification = require("../models/Notification");
const { Variables } = require("../config/constant");
module.exports = {
  createUserNotification: async (title, message, state, userRecipientIds) => {
    try {
      const notification = new Notification({
        title: title,
        message: message,
        state: state,
        recipient_users: userRecipientIds,
      });
      const savedNotification = await notification.save();
      return savedNotification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },
  createCompanyNotification: async (
    title,
    message,
    state,
    companyRecipientIds
  ) => {
    try {
      const notification = new Notification({
        title: title,
        message: message,
        state,
        recipient_companies: companyRecipientIds,
      });
      const savedNotification = await notification.save();
      return savedNotification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },
  composeNotificationTemplate: (type, actor = null) => {
    let title, message;
    if (type == Variables.NotificationType.opportunity) {
      title = "New Job Opportunity";
      message = `you can apply to job ${actor}`;
    }
    if (type == Variables.NotificationType.applicant) {
      title = "New Job Aapplicant";
      message = `A new Applicant to job ${actor}`;
    }
    if (type == Variables.NotificationType.applied) {
      title = "Thanks for your precious trust";
      message = `Thank you for applying to job ${actor}`;
    }
    return { title, message };
  },
};
