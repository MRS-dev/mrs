export const queryKeys = {
  user: () => ["user"],
  admins: () => ["admins"],
  registrationRequests: () => ["registration-requests"],
  registrationRequest: (id: string) => ["registration-requests", id],
  patients: (params?: { search?: string }) => ["patients", params || {}],
  patient: (id: string) => ["patients", id],
  exercises: (params?: { page?: number; limit?: number }) => [
    "exercises",
    params || {},
  ],
  exercise: (id: string) => ["exercises", id],
  pros: (params?: { page?: number; limit?: number }) => ["pros", params || {}],
  pro: (id: string) => ["pros", id],
  activities: (params?: { page?: number; limit?: number }) => [
    "activities",
    params || {},
  ],
  activity: (id: string) => ["activities", id],

  workoutTemplates: (params: { page: number; limit: number }) => [
    "workoutTemplates",
    params,
  ],
  workoutTemplate: (workoutTemplateId: string) => [
    "workoutTemplate",
    workoutTemplateId,
  ],
};
