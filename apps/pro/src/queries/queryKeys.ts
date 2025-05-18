export const queryKeys = {
  user: ["user"],
  patients: ["patients"],
  patient: (patientId: string) => ["patient", patientId],
  exercises: (params: { page: number; limit: number }) => ["exercises", params],
  exercise: (exerciseId: string) => ["exercise", exerciseId],
  activities: (params: { page: number; limit: number }) => [
    "activities",
    params,
  ],
  activity: (activityId: string) => ["activity", activityId],
  workoutTemplates: (params: { page: number; limit: number }) => [
    "workoutTemplates",
    params,
  ],
  workoutTemplate: (workoutTemplateId: string) => [
    "workoutTemplate",
    workoutTemplateId,
  ],
};
