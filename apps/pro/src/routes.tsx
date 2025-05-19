export const ROUTES_DEF = {
  signIn: "/auth/sign-in",
  loginMFA: "/auth/login-mfa",
  register: "/auth/sign-up",
  logout: "/auth/sign-out",
  invitation: "/invitation/:token",
  mfaSetup: "/mfa/setup",
  mfaVerify: "/mfa/verify",
  contactUs: "/contact-us",
  registrationRequest: "/registration-request",
  home: "/dashboard",
  invitationPatient: "/dashboard/invitation-patient/:token",
  newPatient: "/dashboard/patients/new",
  patients: "/dashboard/patients",
  patient: "/dashboard/patients/:patientId",
  patientOverview: "/dashboard/patients/:patientId",
  patientWorkoutSessions: "/dashboard/patients/:patientId/workout-sessions",
  patientWorkoutSession:
    "/dashboard/patients/:patientId/workout-sessions/:sessionId",
  patientReports: "/dashboard/patients/:patientId/reports",
  sessions: "/dashboard/sessions",
  newSession: "/dashboard/sessions/new",
  editSession: "/dashboard/sessions/:sessionId/edit",
  session: "/dashboard/sessions/:sessionId",
  workoutTemplates: "/dashboard/workout-templates",
  workoutTemplate: "/dashboard/workout-templates/:workoutTemplateId",
  patientInformations: "/dashboard/patients/:patientId/informations",
  exercises: "/dashboard/exercises",
  exercise: "/dashboard/exercises/:exerciseId",

  activities: "/dashboard/activities",
  activity: "/dashboard/activities/:activityId",
  files: "/dashboard/files",
  chats: "/dashboard/chats",
  chat: "/dashboard/chats/:chatId",
  feedback: "/dashboard/feedback",
  support: "/dashboard/support",

  account: "/dashboard/account",
  accountInformations: "/dashboard/account/informations",
  accountBilling: "/dashboard/account/billing",
  verification: "/dashboard/verification",
};

export const ROUTES = {
  ...ROUTES_DEF,
  exercise: (exerciseId: string) =>
    ROUTES_DEF.exercise.replace(":exerciseId", exerciseId),
  session: (sessionId: string) =>
    ROUTES_DEF.session.replace(":sessionId", sessionId),
  activity: (activityId: string) =>
    ROUTES_DEF.activity.replace(":activityId", activityId),
  chat: (chatId: string) => ROUTES_DEF.chat.replace(":chatId", chatId),
  patientOverview: (patientId: string) =>
    ROUTES_DEF.patientOverview.replace(":patientId", patientId),
  patientInformations: (patientId: string) =>
    ROUTES_DEF.patientInformations.replace(":patientId", patientId),
  patientWorkoutSessions: (patientId: string) =>
    ROUTES_DEF.patientWorkoutSessions.replace(":patientId", patientId),
  patientWorkoutSession: (params: { patientId: string; sessionId: string }) =>
    ROUTES_DEF.patientWorkoutSession
      .replace(":patientId", params.patientId)
      .replace(":sessionId", params.sessionId),
  patientReports: (patientId: string) =>
    ROUTES_DEF.patientReports.replace(":patientId", patientId),
  patient: (patientId: string) =>
    ROUTES_DEF.patient.replace(":patientId", patientId),
  sessionEditor: (sessionId: string) =>
    ROUTES_DEF.sessionEditor.replace(":sessionId", sessionId),
  editSession: (sessionId: string) =>
    ROUTES_DEF.editSession.replace(":sessionId", sessionId),
  workoutTemplate: (workoutTemplateId: string) =>
    ROUTES_DEF.workoutTemplate.replace(":workoutTemplateId", workoutTemplateId),
};
