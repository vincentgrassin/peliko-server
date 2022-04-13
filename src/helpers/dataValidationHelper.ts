import { User } from "../entities/User";
import { ParticipantInputViewModel } from "../viewModels/ParticipantInputViewModel";

export const getParticipantsWithoutDuplicatesOrAdmin = (
  participants: ParticipantInputViewModel[],
  userAdmin: User
) => {
  return participants.filter(
    (participant, index, array) =>
      array.findIndex((p) => p.phoneNumber === participant.phoneNumber) ===
        index && participant.phoneNumber !== userAdmin?.phoneNumber
  );
};
