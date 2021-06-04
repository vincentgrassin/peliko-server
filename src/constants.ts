export const _prod = process.env.NODE_ENV == "production";

export const defaultEntitiesValues = {
  pictureNumber: 25,
  participantrole: "participant",
  rollAccessCode: "AAA111",
};

export const errorMessages = {
  existingUser: "peliko: Existing user",
  unrecognizedUser: "peliko: Unrecognized user",
  unrecognizedParticipant: "peliko: Unrecognized participant",
  pictureUploadFailed: "peliko: Upload failed",
  unabledToFind: "peliko: Unable To Find Data",
  wrongRollAccessCode: "peliko :Wrong access code",
};
