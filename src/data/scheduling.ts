// Cal.com scheduling configuration.
//
// Availability (weekdays, after 10am ET) and buffer times are configured in
// the Cal.com dashboard, not in code. Event type slugs below must match the
// event types created at https://app.cal.com — see README "Scheduling" section.

export const CAL_USERNAME = "sdaichendt";

export type MeetingType = {
  slug: string;
  title: string;
  duration: number; // minutes
  description: string;
};

export const meetingTypes: MeetingType[] = [
  {
    slug: "quick-chat-15",
    title: "Quick chat",
    duration: 15,
    description: "A short slot for quick questions or a fast hello.",
  },
  {
    slug: "intro-call-30",
    title: "Intro call",
    duration: 30,
    description: "First conversation — recruiters, collaborators, new projects.",
  },
  {
    slug: "deep-dive-60",
    title: "Deep dive",
    duration: 60,
    description: "A longer technical or project discussion.",
  },
];
