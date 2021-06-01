export const _prod = process.env.NODE_ENV == "production";

export const defaultEntitiesValues = {
  pictureNumber: 25,
  participantrole: "participant",
};

export const userErrorMessages = {
  existing: "Existing user",
  unrecognized: "Unrecognized user",
  pictureUploadFailed: "Upload failed",
  unabledToFind: "Unable To Find Data",
};
