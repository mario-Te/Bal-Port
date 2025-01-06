module.exports = {
  applicantFormat: (applicants) => {
    const modifiedApplicants = applicants.map((applicant) => {
      const modifiedApplicant = { ...applicant._doc };
      if (modifiedApplicant.fileName) {
        modifiedApplicant.fileName = `${process.env.API_Domain}uploads/documents/${modifiedApplicant.fileName}`;
      }
      return modifiedApplicant;
    });

    return modifiedApplicants;
  },
  formatJobs: (jobs) => {
    const modifiedJobs = jobs.map((job) => {
      const modifiedJob = { ...job._doc };
      if (modifiedJob.image) {
        modifiedJob.image = `${process.env.API_Domain}uploads/images/${modifiedJob.image}`;
      }
      if (modifiedJob.company == null) {
        delete modifiedJob.company;
      }
      if (modifiedJob.deadline) {
        modifiedJob.deadline = module.exports.formatDateTime(
          modifiedJob.deadline
        );
      }
      return modifiedJob;
    });
    return modifiedJobs;
  },
  formatJob: (job) => {
    const modifiedJob = { ...job._doc };
    if (modifiedJob.image) {
      modifiedJob.image = `${process.env.API_Domain}uploads/images/${modifiedJob.image}`;
    }
    if (modifiedJob.deadline) {
      modifiedJob.deadline = module.exports.formatDateTime(
        modifiedJob.deadline
      );
    }
    return modifiedJob;
  },
  formatInfo: (userInfo) => {
    const modifiedInfo = { ...userInfo._doc };

    if (modifiedInfo.image) {
      modifiedInfo.image = `${process.env.API_Domain}uploads/images/${modifiedInfo.image}`;
    }
    if (modifiedInfo.user)
      modifiedInfo.birthdate = module.exports.formatDateTime(
        modifiedInfo.user.birthdate
      );

    return modifiedInfo;
  },

  formatDateTime: (dateTimeString) => {
    if (!dateTimeString) return "";
    const date0 = new Date(dateTimeString);
    const isoString = date0.toISOString();

    const date = new Date(isoString);
    const options = {
      year: "numeric",
      day: "numeric",
      month: "short",
    };
    const formattedDate = new Intl.DateTimeFormat("en-SY", options).format(
      date
    );

    return formattedDate.replace(",", ""); // Remove comma after month
  },
};
