export interface Roadmap {
  era: string;
  year: string;
  epics: Epic[];
}

export interface Epic {
  name: string;
  description: string;
  features: string[];
  status: "complete" | "proposed" | "inProgress" | "planned";
  quarter: 1 | 2 | 3 | 4;
}

// whitepaper?

export const roadmap: Roadmap[] = [
  {
    era: "Founding & Vision",
    year: "2023",
    epics: [
      {
        name: "Andamio Founded",
        description:
          "By a group of Catalyst veterans, Gimbalabs contributors, and Cardano builders",
        features: [],
        status: "complete",
        quarter: 2,
      },
      {
        name: "Team forming and Org-building",
        description:
          "Clarifying itentions for Andamio in how we organize and build it",
        features: [],
        status: "complete",
        quarter: 2,
      },
      {
        name: "Andamio system designs",
        description:
          "Refining and combining components prototyped at Bridge Builders, Gimbalabs, Mesh, and ODIN",
        features: [],
        status: "complete",
        quarter: 3,
      },
      {
        name: "DAOs <3 smart contracts for skill-acquisition and contribution tracking",
        description: "Catalyst Fund 10 Proposal",
        features: [],
        status: "complete",
        quarter: 4,
      },
    ],
  },
  {
    era: "Andamio 1.0: Building Partnerships & Designing the System",
    year: "2024",
    epics: [
      {
        name: "Andamio Course Platform Prototype",
        description:
          "Initial designs and deployment of Andamio course application.",
        features: [],
        status: "complete",
        quarter: 1,
      },
      {
        name: "Alpha Onboarding to Course Platform",
        description:
          "Content plaform testing with Deep Funding Academy, Governance Guild, Gimbalabs and Mesh",
        features: [],
        status: "complete",
        quarter: 1,
      },
      {
        name: "Catalyst F11: Andamio CLI and Cardano Go",
        description: "Access token and enrollment coming in November 2024",
        features: [],
        status: "complete",
        quarter: 2,
      },
      {
        name: "Andamio Contributor Platform Prototype",
        description: "Testing at Gimbalabs",
        features: ["Contributors can make treasury commitments"],
        status: "complete",
        quarter: 3,
      },
      {
        name: "Andamio Course Platform: Preproduction Release",
        description:
          "For students of Plutus PBL and Mesh PBL, public testing on Cardano Preprod",
        features: [],
        status: "complete",
        quarter: 3,
      },
      {
        name: "Andamio Contribution and Credential Features",
        description:
          "Designs and Preprod deployment of contribution and credential features",
        features: [],
        status: "inProgress",
        quarter: 4,
      },
      {
        name: "Catalyst F12: Delivering for Partners",
        description: "Initial rollout of Andamio and feature testing",
        features: [],
        status: "inProgress",
        quarter: 4,
      },
      {
        name: "Developing a Self Sovereign On-chain Identity (SSOI)",
        description:
          "Research and development into emergent identity built on skills and credentials",
        features: [],
        status: "inProgress",
        quarter: 4,
      },
      {
        name: "Andamio Purpose Sidechain / Layer 2 Concept",
        description:
          "Research and development into how a Cardano sidechain can be used to reduce costs and barriers to entry while increasing the scalability of the Andamio Network",
        features: [],
        status: "inProgress",
        quarter: 4,
      },
    ],
  },
  {
    era: "Andamio 2.0: Andamio Network Initialization",
    year: "2025",
    epics: [
      {
        name: "Andamio Mainnet Release",
        description:
          "Fully featured Andamio Platform with Access Token, learning, contribution, and credential features",
        features: [],
        status: "planned",
        quarter: 1,
      },
      {
        name: "Governance Features, Phase 1: Course Governance",
        description:
          "Initial integration of governance features with on-chain smart contracts and Andamio Platform",
        features: [],
        status: "planned",
        quarter: 2,
      },
      {
        name: "Governance Features, Phase 2: Project Governance",
        description:
          "Integration of governance features with project, contribution and treasury management",
        features: [],
        status: "planned",
        quarter: 3,
      },
    ],
  },
];
