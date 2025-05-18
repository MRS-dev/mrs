export const queryKeys = {
  admins: () => ["admins"],
  registrationRequests: () => ["registration-requests"],
  registrationRequest: (id: string) => ["registration-requests", id],
};
