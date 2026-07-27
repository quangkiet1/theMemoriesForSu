// Types for farewell letter experience

export type FarewellStage =
  | "closed"
  | "opening"
  | "reading"
  | "transitioning"
  | "memories"
  | "ending"
  | "closed-again";

export type FarewellLetterData = {
  slug: string;
  recipientName: string;
  senderName: string;
  eyebrow: string;
  title: string;
  opening: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  dateLabel?: string;
  envelopeLabel: string;
  openButtonLabel: string;
  memoryButtonLabel: string;
  memoryIntro: string;
  orbitCenterMessage: string;
  finalTitle: string;
  finalParagraphs: string[];
  finalSignature: string;
};

export type FarewellMemory = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  date?: string;
  objectPosition?: string;
  featured?: boolean;
  orbitOrder?: number;
};
