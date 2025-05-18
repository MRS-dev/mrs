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
  newPatient: "/dashboard/new-patient",
  patients: "/dashboard/patients",
  patient: "/dashboard/patients/:patientId",
  patientOverview: "/dashboard/patients/:patientId",
  patientSessions: "/dashboard/patients/:patientId/sessions",
  patientSession: "/dashboard/patients/:patientId/sessions/:sessionId",
  patientReports: "/dashboard/patients/:patientId/reports",
  sessions: "/dashboard/sessions",
  newSession: "/dashboard/sessions/new",
  editSession: "/dashboard/sessions/edit/:sessionId",
  sessionEditor: "/dashboard/sessions/edit/:sessionId",
  session: "/dashboard/sessions/:sessionId",
  programTemplates: "/dashboard/program-templates",
  programTemplate: "/dashboard/program-templates/:programTemplateId",
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
  patientSessions: (patientId: string) =>
    ROUTES_DEF.patientSessions.replace(":patientId", patientId),
  patientSession: (params: { patientId: string; sessionId: string }) =>
    ROUTES_DEF.patientSession
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
  programTemplate: (programTemplateId: string) =>
    ROUTES_DEF.programTemplate.replace(":programTemplateId", programTemplateId),
};
