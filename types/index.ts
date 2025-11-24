export interface FeatredCardProps {
  icon: string;
  title: string;
  content: string;
  index: number;
}

export interface ButtonProps {
  styles?: string;
  text?: string;
}

export interface FeedBackProps {
  content: string;
  title: string;
  name: string;
  img: string | any;
  email: string;
}

export interface ActivityProps {
  id: string;
  title: string;
  description: string;
  date: string;
  img: string | any;
  frenchTitle?: string;
  participatingOrganizations: string[];
  onlineEventLink?: string;
  program: { time: string; event: string }[];
}
