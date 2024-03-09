import firepadRef from "./firebase";
import { store } from "../index";

const participantRef = firepadRef.child("participants");

export const updatePreference = (userId, preference) => {
  const currentParticipantRef = participantRef.child(userId).child("preferences");
  currentParticipantRef.update(preference);
};

export const createOffer = async (peerConnection, receiverId, createdID) => {
  const currentParticipantRef = participantRef.child(receiverId);
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      currentParticipantRef.child("offerCandidates").push({
        ...event.candidate.toJSON(),
        userId: createdID,
      });
    }
  };

  const offerDescription = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
    userId: createdID,
  };

  await currentParticipantRef.child("offers").push().set({ offer });
};

export const initializeListeners = async (userId) => {
  const currentUserRef = participantRef.child(userId);

  const handleOffer = async (snapshot) => {
    const data = snapshot.val();
    if (data && data.offer) {
      const pc = store.getState().participants[data.offer.userId].peerConnection;
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      await createAnswer(data.offer.userId, userId);
    }
  };

  const handleOfferCandidates = (snapshot) => {
    const data = snapshot.val();
    if (data && data.userId) {
      const pc = store.getState().participants[data.userId].peerConnection;
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  };

  const handleAnswer = (snapshot) => {
    const data = snapshot.val();
    if (data && data.answer) {
      const pc = store.getState().participants[data.answer.userId].peerConnection;
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  };

  const handleAnswerCandidates = (snapshot) => {
    const data = snapshot.val();
    if (data && data.userId) {
      const pc = store.getState().participants[data.userId].peerConnection;
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  };

  currentUserRef.child("offers").on("child_added", handleOffer);
  currentUserRef.child("offerCandidates").on("child_added", handleOfferCandidates);
  currentUserRef.child("answers").on("child_added", handleAnswer);
  currentUserRef.child("answerCandidates").on("child_added", handleAnswerCandidates);

  // Clean up listeners when participant leaves the call
  // Example: currentUserRef.off();
};

const createAnswer = async (otherUserId, userId) => {
  const pc = store.getState().participants[otherUserId].peerConnection;
  const participantRef1 = participantRef.child(otherUserId);
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      participantRef1.child("answerCandidates").push({
        ...event.candidate.toJSON(),
        userId: userId,
      });
    }
  };

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
    userId: userId,
  };

  await participantRef1.child("answers").push().set({ answer });
};
