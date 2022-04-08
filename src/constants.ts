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
  wrongRollAccessCode: "peliko : Wrong access code",
  invalidPassword: "peliko : Invalid password",
  notAuthenticated: "peliko : Not authenticated",
  unauthorized: "peliko : Not authorized",
  databaseError: "peliko : Database error",
};

export const pushMessages = {
  newRollTitle: `Nouvelle pellicule`,
  newRollBody: `Le Peliko {0} est ouvert jusqu'au {1}`,
};

export const SALT_ROUNDS = 10;
