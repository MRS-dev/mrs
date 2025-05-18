export const ROUTES_DEF = {
  login: "/login",
  loginMFA: "/login/mfa",
  logout: "/logout",
  contactUs: "/contact-us",
  registrationRequest: "/registration-request",
  forgetPassword: "/forget-password",
  resetPassword: "/reset-password",
  register: "/register",
  home: "/",
  invitation: "/invitation/:token",
  invitationPatient: "/invitation-patient/:token",
  newPatient: "/new-patient",
  patients: "/patients",
  patient: "/patients/:patientId",
  patientOverview: "/patients/:patientId/overview",
  patientSessions: "/patients/:patientId/sessions",
  patientSession: "/patients/:patientId/sessions/:sessionId",
  patientReports: "/patients/:patientId/reports",
  sessions: "/sessions",
  newSession: "/sessions/new",
  editSession: "/sessions/edit/:sessionId",
  sessionEditor: "/sessions/edit/:sessionId",
  session: "/sessions/:sessionId",
  programTemplates: "/program-templates",
  programTemplate: "/program-templates/:programTemplateId",
  patientInformations: "/patients/:patientId/informations",
  exercises: "/exercises",
  exercise: "/exercises/:exerciseId",

  activities: "/activities",
  activity: "/activities/:activityId",
  files: "/files",
  chats: "/chats",
  chat: "/chats/:chatId",
  feedback: "/feedback",
  support: "/support",

  account: "/account",
  accountInformations: "/account/informations",
  accountBilling: "/account/billing",
  verification: "/verification",
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
